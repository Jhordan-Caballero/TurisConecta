"""Consultas a MongoDB que comparten varias rutas.

Las reglas de negocio no viven aquí: solo se trae la información que los
módulos necesitan, ya convertida a fechas de Python.
"""

from datetime import date

from bson import ObjectId
from pymongo.database import Database

from app.database import a_date, a_datetime
from app.modules.impacto import ESTADOS_CONTABLES
from app.modules.ranking import ranking


def _cruce(inicio: date, fin: date) -> dict:
    """Filtro Mongo para reservas que ocupan algún día de [inicio, fin)."""
    return {"fecha_inicio": {"$lt": a_datetime(fin)}, "fecha_fin": {"$gt": a_datetime(inicio)}}


def _a_dict_reserva(doc: dict) -> dict:
    return {
        "fecha_inicio": a_date(doc["fecha_inicio"]),
        "fecha_fin": a_date(doc["fecha_fin"]),
        "personas": doc["personas"],
    }


def reservas_de_servicio(db: Database, servicio_id: ObjectId, inicio: date, fin: date) -> list[dict]:
    docs = db.reservas.find(
        {"servicio_id": servicio_id, "estado": "confirmada", **_cruce(inicio, fin)}
    )
    return [_a_dict_reserva(d) for d in docs]


def reservas_de_turista(db: Database, turista_id: ObjectId, inicio: date, fin: date) -> list[dict]:
    docs = db.reservas.find(
        {"turista_id": turista_id, "estado": "confirmada", **_cruce(inicio, fin)}
    )
    return [_a_dict_reserva(d) for d in docs]


def ocupacion_por_servicio(
    db: Database, servicio_ids: list[ObjectId], inicio: date, fin: date
) -> dict[str, list[dict]]:
    docs = db.reservas.find(
        {"servicio_id": {"$in": servicio_ids}, "estado": "confirmada", **_cruce(inicio, fin)}
    )
    ocupacion: dict[str, list[dict]] = {}
    for d in docs:
        ocupacion.setdefault(str(d["servicio_id"]), []).append(_a_dict_reserva(d))
    return ocupacion


def carga_por_poblador(db: Database) -> dict[str, int]:
    """Reservas recibidas por poblador (clave: id de usuario, en texto)."""
    perfiles = db.pobladores.find({}, {"usuario_id": 1, "reservas_recibidas": 1})
    return {str(p["usuario_id"]): p.get("reservas_recibidas", 0) for p in perfiles}


def reputaciones(db: Database, hoy: date) -> dict[str, dict]:
    """Ranking de reputación por poblador. Clave: id de usuario, en texto."""
    perfiles = list(db.pobladores.find({}, {"usuario_id": 1, "nombre": 1, "creado_en": 1}))
    puntajes = {
        str(g["_id"]): g["puntajes"]
        for g in db.valoraciones.aggregate(
            [{"$group": {"_id": "$poblador_id", "puntajes": {"$push": "$puntaje"}}}]
        )
    }
    datos = [
        {
            "id": str(p["usuario_id"]),
            "nombre": p["nombre"],
            "puntajes": puntajes.get(str(p["usuario_id"]), []),
            "creado_en": a_date(p["creado_en"]),
        }
        for p in perfiles
    ]
    return {fila["poblador_id"]: fila for fila in ranking(datos, hoy)}


def reservas_contables(db: Database) -> list[dict]:
    docs = db.reservas.find(
        {"estado": {"$in": ESTADOS_CONTABLES}},
        {"localidad": 1, "fecha_inicio": 1, "personas": 1},
    )
    return [
        {
            "localidad": d["localidad"],
            "fecha_inicio": a_date(d["fecha_inicio"]),
            "personas": d["personas"],
        }
        for d in docs
    ]
