from datetime import date

import pytest

from app.modules.impacto import desglose, pipeline_por_poblador
from app.modules.ranking import puntuar, ranking
from app.modules.demanda import analizar_demanda

HOY = date(2026, 11, 20)


def test_reputacion_sin_resenas_solo_cuenta_antiguedad():
    assert puntuar([], 0) == 0.0
    assert puntuar([], 5 * 366) == 15.0  # tope de 5 años * peso 0.15


def test_mejores_valoraciones_suben_el_puntaje():
    alto = puntuar([5, 5, 5, 5, 5, 5], 365)
    bajo = puntuar([2, 2, 2, 2, 2, 2], 365)
    assert alto > bajo


def test_mas_resenas_con_la_misma_media_suben_el_puntaje():
    pocas = puntuar([4, 4], 365)
    muchas = puntuar([4] * 20, 365)
    assert muchas > pocas


def test_ranking_ordena_de_mayor_a_menor():
    datos = [
        {"id": "p1", "nombre": "Ana", "puntajes": [3], "creado_en": date(2026, 1, 1)},
        {"id": "p2", "nombre": "Luis", "puntajes": [5] * 10, "creado_en": date(2024, 1, 1)},
        {"id": "p3", "nombre": "Rosa", "puntajes": [], "creado_en": date(2026, 11, 1)},
    ]
    orden = [f["poblador_id"] for f in ranking(datos, HOY)]
    assert orden == ["p2", "p1", "p3"]


def test_desglose_compara_comunidad_contra_agencia():
    d = desglose(1000, comision_plataforma=0.05, comision_agencia=0.30)
    assert d["ingreso_comunidad"] == 950.0
    assert d["ingreso_si_agencia"] == 700.0
    assert d["diferencia_a_favor_comunidad"] == 250.0


def test_pipeline_filtra_solo_reservas_vigentes():
    pipe = pipeline_por_poblador(localidad="Chivay & Valle del Colca")
    assert pipe[0]["$match"]["estado"] == {"$in": ["confirmada"]}
    assert pipe[0]["$match"]["localidad"] == "Chivay & Valle del Colca"


def test_demanda_identifica_temporada_pico():
    pytest.importorskip("pandas")
    reservas = [
        {"localidad": "Chivay", "fecha_inicio": date(2026, 7, 10), "personas": 4},
        {"localidad": "Chivay", "fecha_inicio": date(2026, 7, 20), "personas": 2},
        {"localidad": "Yanque", "fecha_inicio": date(2026, 3, 5), "personas": 1},
    ]
    res = analizar_demanda(reservas)
    assert res["temporada_pico"] == "julio"
    assert res["por_localidad"][0] == {"localidad": "Chivay", "reservas": 2, "personas": 6}
