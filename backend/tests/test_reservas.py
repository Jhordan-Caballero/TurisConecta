from datetime import date

import pytest

from app.modules.errores import ConflictoReserva, ReservaInvalida
from app.modules.reservas import (
    calcular_precio,
    cupo_minimo,
    validar_fechas,
    verificar_capacidad,
    verificar_sin_cruce_turista,
)

HOY = date(2026, 3, 1)


def test_precio_baja_temporada_por_persona_y_noche():
    p = calcular_precio(80, "Hospedaje", 2, date(2026, 3, 10), date(2026, 3, 13))
    assert p["unidades"] == 3
    assert p["precio_final"] == 480.0  # 80 * 2 personas * 3 noches


def test_precio_temporada_alta_aplica_recargo_por_noche():
    # Junio: factor 1.25 cada noche
    p = calcular_precio(80, "Hospedaje", 1, date(2026, 6, 1), date(2026, 6, 3))
    assert p["precio_base"] == 160.0
    assert p["precio_final"] == 200.0


def test_guiado_se_cobra_una_vez():
    p = calcular_precio(60, "Guiado", 3, date(2026, 4, 2), date(2026, 4, 3))
    assert p["unidades"] == 1
    assert p["precio_final"] == 180.0


def test_fecha_salida_debe_ser_posterior():
    with pytest.raises(ReservaInvalida):
        validar_fechas("Hospedaje", date(2026, 5, 2), date(2026, 5, 2), HOY)


def test_no_se_reserva_en_el_pasado():
    with pytest.raises(ReservaInvalida):
        validar_fechas("Guiado", date(2026, 2, 1), date(2026, 2, 2), HOY)


def test_guiado_de_dos_dias_no_permitido():
    with pytest.raises(ReservaInvalida):
        validar_fechas("Guiado", date(2026, 5, 1), date(2026, 5, 3), HOY)


def test_capacidad_considera_el_dia_mas_lleno():
    reservas = [
        {"fecha_inicio": date(2026, 4, 1), "fecha_fin": date(2026, 4, 3), "personas": 4},
        {"fecha_inicio": date(2026, 4, 2), "fecha_fin": date(2026, 4, 4), "personas": 2},
    ]
    # El 2 de abril hay 6 ocupados: con capacidad 8 quedan 2 libres
    assert cupo_minimo(8, reservas, date(2026, 4, 1), date(2026, 4, 4)) == 2
    with pytest.raises(ConflictoReserva):
        verificar_capacidad(8, reservas, date(2026, 4, 1), date(2026, 4, 4), 3)


def test_salida_el_dia_de_llegada_no_cruza():
    # Una reserva que termina el 5 no choca con una que empieza el 5
    reservas = [{"fecha_inicio": date(2026, 4, 1), "fecha_fin": date(2026, 4, 5), "personas": 8}]
    assert cupo_minimo(8, reservas, date(2026, 4, 5), date(2026, 4, 6)) == 8


def test_turista_no_puede_cruzar_reservas():
    propias = [{"fecha_inicio": date(2026, 4, 1), "fecha_fin": date(2026, 4, 4)}]
    verificar_sin_cruce_turista(propias, date(2026, 4, 4), date(2026, 4, 6))  # ok
    with pytest.raises(ConflictoReserva):
        verificar_sin_cruce_turista(propias, date(2026, 4, 3), date(2026, 4, 6))
