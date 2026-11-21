from app.modules.asignador import ordenar_pobladores, registrar_asignacion


def test_prioriza_al_que_tiene_menos_reservas():
    carga = {"A": 5, "B": 1, "C": 3}
    assert ordenar_pobladores(["A", "B", "C"], carga, {}) == ["B", "C", "A"]


def test_empate_rota_al_que_recibio_hace_mas_tiempo():
    carga = {"A": 2, "B": 2}
    ultima = {"A": 7, "B": 3}  # B recibió antes
    assert ordenar_pobladores(["A", "B"], carga, ultima) == ["B", "A"]


def test_registrar_asignacion_actualiza_carga_y_turno():
    carga, ultima = {}, {}
    registrar_asignacion("A", carga, ultima, 1)
    registrar_asignacion("A", carga, ultima, 2)
    assert carga == {"A": 2}
    assert ultima == {"A": 2}


def test_reparto_en_lote_queda_balanceado():
    carga, ultima = {}, {}
    ids = ["A", "B", "C"]
    for turno in range(9):
        primero = ordenar_pobladores(ids, carga, ultima)[0]
        registrar_asignacion(primero, carga, ultima, turno + 1)
    assert carga == {"A": 3, "B": 3, "C": 3}
