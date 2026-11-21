"""Conexión a MongoDB, índices y utilidades de conversión de tipos."""

from datetime import date, datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException
from pymongo import ASCENDING, MongoClient
from pymongo.database import Database

from app.config import get_settings

_cliente: MongoClient | None = None


def get_db() -> Database:
    global _cliente
    if _cliente is None:
        _cliente = MongoClient(get_settings().mongo_uri, serverSelectionTimeoutMS=5000)
    return _cliente[get_settings().mongo_db]


def crear_indices(db: Database) -> None:
    db.usuarios.create_index("email", unique=True)
    db.pobladores.create_index("usuario_id", unique=True)
    db.servicios.create_index([("localidad", ASCENDING), ("categoria", ASCENDING)])
    db.reservas.create_index([("servicio_id", ASCENDING), ("estado", ASCENDING)])
    db.reservas.create_index([("turista_id", ASCENDING), ("estado", ASCENDING)])
    db.reservas.create_index([("poblador_id", ASCENDING), ("estado", ASCENDING)])
    db.valoraciones.create_index("reserva_id", unique=True)
    db.valoraciones.create_index("poblador_id")


def ahora() -> datetime:
    """Fecha y hora UTC sin zona, tal como la guarda MongoDB."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def a_datetime(d: date) -> datetime:
    """MongoDB no tiene tipo fecha: las fechas se guardan a medianoche."""
    return datetime(d.year, d.month, d.day)


def a_date(valor: datetime | date) -> date:
    return valor.date() if isinstance(valor, datetime) else valor


def oid(valor: str | ObjectId) -> ObjectId:
    try:
        return ObjectId(valor)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail="Identificador no válido")


def como_publico(doc: dict) -> dict:
    """Convierte _id en id y los ObjectId en texto. Quita datos sensibles."""
    salida = {}
    for clave, valor in doc.items():
        if clave == "_id":
            salida["id"] = str(valor)
        elif isinstance(valor, ObjectId):
            salida[clave] = str(valor)
        else:
            salida[clave] = valor
    salida.pop("password_hash", None)
    return salida
