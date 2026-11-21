from datetime import date

import pytest

from app.modules.errores import PresupuestoInsuficiente, SinOferta
from app.modules.itinerarios import Solicitud, generar_itinerario

HOY = date(2026, 3, 1)


def servicio(id_, titulo, categoria, precio, poblador, localidad="Chivay & Valle del Colca",
             capacidad=10, intereses=(), rep=50.0):
    return {
        "id": id_, "titulo": titulo, "categoria": categoria, "precio": precio,
        "capacidad": capacidad, "localidad": localidad, "poblador_id": poblador,
        "poblador_nombre": poblador.upper(), "intereses": list(intereses), "reputacion": rep,
    }


CATALOGO = [
    servicio("h1", "Hospedaje Rural Ana", "Hospedaje", 60, "ana", intereses=()),
    servicio("h2", "Casa Comunal Luis", "Hospedaje", 45, "luis", intereses=()),
    servicio("g1", "Guía Cañón", "Guiado", 70, "rosa", intereses=("Aventura", "Naturaleza")),
    servicio("g2", "Caminata Terrazas", "Guiado", 40, "pedro", intereses=("Cultura",)),
    servicio("c1", "Picantería", "Gastronomía", 35, "ana", intereses=("Comida",)),
    servicio("a1", "Taller Textiles", "Artesanía", 25, "marta", intereses=("Cultura",)),
]


def test_plan_respeta_presupuesto_y_dias():
    sol = Solicitud(presupuesto=500, dias=3, personas=2, intereses=["Aventura", "Comida"])
    plan = generar_itinerario(sol, CATALOGO, hoy=HOY)
    assert len(plan["dias"]) == 3
    assert plan["alojamiento"] is not None
    assert plan["total"] <= 500
    assert plan["restante"] == round(500 - plan["total"], 2)


def test_un_dia_no_tiene_alojamiento():
    sol = Solicitud(presupuesto=200, dias=1, personas=1, intereses=["Cultura"])
    plan = generar_itinerario(sol, CATALOGO, hoy=HOY)
    assert plan["alojamiento"] is None
    assert len(plan["dias"]) == 1


def test_no_repite_actividades_si_hay_alternativas():
    sol = Solicitud(presupuesto=1000, dias=3, personas=1, intereses=["Cultura", "Aventura"])
    plan = generar_itinerario(sol, CATALOGO, hoy=HOY)
    ids = [d["actividad"]["servicio_id"] for d in plan["dias"]]
    assert len(set(ids)) == len(ids)


def test_prefiere_actividades_que_coinciden_con_intereses():
    sol = Solicitud(presupuesto=1000, dias=1, personas=1, intereses=["Comida"])
    plan = generar_itinerario(sol, CATALOGO, hoy=HOY)
    assert plan["dias"][0]["actividad"]["servicio_id"] == "c1"


def test_presupuesto_insuficiente_informa_minimo():
    sol = Solicitud(presupuesto=50, dias=3, personas=2, intereses=["Cultura"])
    with pytest.raises(PresupuestoInsuficiente) as e:
        generar_itinerario(sol, CATALOGO, hoy=HOY)
    assert e.value.minimo > 50


def test_servicios_sin_capacidad_se_descartan():
    sol = Solicitud(presupuesto=900, dias=2, personas=5, intereses=["Cultura"])
    catalogo = [s for s in CATALOGO if s["categoria"] != "Gastronomía"]
    catalogo.append(servicio("chico", "Mini Guía", "Guiado", 10, "zoe", capacidad=2))
    plan = generar_itinerario(sol, catalogo, hoy=HOY)
    assert all(d["actividad"]["servicio_id"] != "chico" for d in plan["dias"])


def test_filtra_por_localidad():
    catalogo = CATALOGO + [servicio("y1", "Guía Yanque", "Guiado", 30, "iris", localidad="Yanque & Coporaque")]
    sol = Solicitud(presupuesto=900, dias=1, personas=1, intereses=["Aventura"], localidad="Yanque & Coporaque")
    plan = generar_itinerario(sol, catalogo, hoy=HOY)
    assert plan["dias"][0]["actividad"]["servicio_id"] == "y1"


def test_reparte_entre_pobladores_con_menos_reservas():
    # Dos guías iguales: el que tiene más reservas previas no debe ganar
    catalogo = [
        servicio("g_a", "Guía A", "Guiado", 50, "ana", intereses=("Aventura",)),
        servicio("g_b", "Guía B", "Guiado", 50, "beto", intereses=("Aventura",)),
    ]
    sol = Solicitud(presupuesto=500, dias=1, personas=1, intereses=["Aventura"])
    plan = generar_itinerario(sol, catalogo, hoy=HOY, carga={"ana": 9, "beto": 0})
    assert plan["dias"][0]["actividad"]["poblador_id"] == "beto"


def test_ocupacion_en_la_fecha_excluye_servicio_lleno():
    catalogo = [
        servicio("g_lleno", "Guía lleno", "Guiado", 20, "ana", capacidad=2, intereses=("Aventura",)),
        servicio("g_libre", "Guía libre", "Guiado", 90, "beto", intereses=("Aventura",)),
    ]
    ocupacion = {"g_lleno": [{"fecha_inicio": date(2026, 4, 2), "fecha_fin": date(2026, 4, 3), "personas": 2}]}
    sol = Solicitud(presupuesto=500, dias=1, personas=1, intereses=["Aventura"], fecha_inicio=date(2026, 4, 2))
    plan = generar_itinerario(sol, catalogo, hoy=HOY, ocupacion=ocupacion)
    assert plan["dias"][0]["actividad"]["servicio_id"] == "g_libre"


def test_sin_oferta_para_el_dia():
    sol = Solicitud(presupuesto=500, dias=1, personas=1, intereses=["Cultura"], localidad="Arequipa Centro Histórico")
    with pytest.raises(SinOferta):
        generar_itinerario(sol, CATALOGO, hoy=HOY)
