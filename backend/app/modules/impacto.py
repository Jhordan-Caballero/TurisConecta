"""Indicador de impacto: cuánto queda en la comunidad frente a una agencia.

Las comisiones son supuestos de negocio y se configuran en .env:
- COMISION_PLATAFORMA: lo que se queda TurisConecta (venta directa).
- COMISION_AGENCIA: lo que se quedaría una agencia por el mismo servicio.
"""

# Solo cuentan las reservas que siguen vigentes.
ESTADOS_CONTABLES = ["confirmada"]


def desglose(total_bruto: float, comision_plataforma: float, comision_agencia: float) -> dict:
    comunidad = total_bruto * (1 - comision_plataforma)
    agencia = total_bruto * (1 - comision_agencia)
    return {
        "ingreso_bruto": round(total_bruto, 2),
        "ingreso_comunidad": round(comunidad, 2),
        "ingreso_si_agencia": round(agencia, 2),
        "diferencia_a_favor_comunidad": round(comunidad - agencia, 2),
        "porcentaje_comunidad": round((1 - comision_plataforma) * 100, 2),
    }


def _match(localidad: str | None, poblador_id: str | None) -> dict:
    filtro: dict = {"estado": {"$in": ESTADOS_CONTABLES}}
    if localidad:
        filtro["localidad"] = localidad
    if poblador_id:
        filtro["poblador_id"] = poblador_id
    return {"$match": filtro}


def pipeline_total(localidad: str | None = None, poblador_id: str | None = None) -> list[dict]:
    return [
        _match(localidad, poblador_id),
        {
            "$group": {
                "_id": None,
                "reservas": {"$sum": 1},
                "ingreso_bruto": {"$sum": "$precio_final"},
            }
        },
        {"$project": {"_id": 0, "reservas": 1, "ingreso_bruto": {"$round": ["$ingreso_bruto", 2]}}},
    ]


def pipeline_por_localidad(localidad: str | None = None, poblador_id: str | None = None) -> list[dict]:
    return [
        _match(localidad, poblador_id),
        {
            "$group": {
                "_id": "$localidad",
                "reservas": {"$sum": 1},
                "ingreso_bruto": {"$sum": "$precio_final"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "localidad": "$_id",
                "reservas": 1,
                "ingreso_bruto": {"$round": ["$ingreso_bruto", 2]},
            }
        },
        {"$sort": {"ingreso_bruto": -1}},
    ]


def pipeline_por_poblador(localidad: str | None = None, poblador_id: str | None = None) -> list[dict]:
    return [
        _match(localidad, poblador_id),
        {
            "$group": {
                "_id": "$poblador_id",
                "poblador_nombre": {"$first": "$poblador_nombre"},
                "localidad": {"$first": "$localidad"},
                "reservas": {"$sum": 1},
                "ingreso_bruto": {"$sum": "$precio_final"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "poblador_id": {"$toString": "$_id"},
                "poblador_nombre": 1,
                "localidad": 1,
                "reservas": 1,
                "ingreso_bruto": {"$round": ["$ingreso_bruto", 2]},
            }
        },
        {"$sort": {"ingreso_bruto": -1}},
    ]
