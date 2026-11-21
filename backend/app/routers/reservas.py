from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query

from app.consultas import reservas_de_servicio, reservas_de_turista
from app.database import a_date, a_datetime, ahora, como_publico, get_db, oid
from app.models.reserva import ReservaIn
from app.modules.errores import ConflictoReserva, ReservaInvalida
from app.modules.reservas import (
    calcular_precio,
    validar_fechas,
    verificar_capacidad,
    verificar_sin_cruce_turista,
)
from app.security import solo_turista, usuario_actual

router = APIRouter(prefix="/reservas", tags=["reservas"])


def _publica(doc: dict) -> dict:
    salida = como_publico(doc)
    salida["fecha_inicio"] = a_date(doc["fecha_inicio"]).isoformat()
    salida["fecha_fin"] = a_date(doc["fecha_fin"]).isoformat()
    return salida


@router.post("", status_code=201)
def crear_reserva(body: ReservaIn, usuario: dict = Depends(solo_turista)):
    db = get_db()
    servicio = db.servicios.find_one({"_id": oid(body.servicio_id), "activo": True})
    if servicio is None:
        raise HTTPException(404, "Servicio no encontrado")

    ini, fin = body.fecha_inicio, body.fecha_fin
    turista_oid = oid(usuario["id"])
    try:
        validar_fechas(servicio["categoria"], ini, fin, date.today())
        verificar_capacidad(
            servicio["capacidad"],
            reservas_de_servicio(db, servicio["_id"], ini, fin),
            ini,
            fin,
            body.personas,
        )
        verificar_sin_cruce_turista(reservas_de_turista(db, turista_oid, ini, fin), ini, fin)
    except ReservaInvalida as e:
        raise HTTPException(422, str(e))
    except ConflictoReserva as e:
        raise HTTPException(409, str(e))

    precio = calcular_precio(servicio["precio"], servicio["categoria"], body.personas, ini, fin)
    doc = {
        "servicio_id": servicio["_id"],
        "servicio_titulo": servicio["titulo"],
        "categoria": servicio["categoria"],
        "localidad": servicio["localidad"],
        "poblador_id": servicio["poblador_id"],
        "poblador_nombre": servicio["poblador_nombre"],
        "turista_id": turista_oid,
        "turista_nombre": usuario["nombre"],
        "fecha_inicio": a_datetime(ini),
        "fecha_fin": a_datetime(fin),
        "personas": body.personas,
        "precio_unitario": servicio["precio"],
        "precio_base": precio["precio_base"],
        "precio_final": precio["precio_final"],
        "estado": "confirmada",
        "creado_en": ahora(),
    }
    res = db.reservas.insert_one(doc)
    db.pobladores.update_one(
        {"usuario_id": servicio["poblador_id"]},
        {"$inc": {"reservas_recibidas": 1, "ingresos": precio["precio_final"]}},
    )
    doc["_id"] = res.inserted_id
    return _publica(doc)


@router.get("")
def listar_reservas(
    estado: str | None = Query(None, pattern="^(confirmada|cancelada)$"),
    usuario: dict = Depends(usuario_actual),
):
    """Turista: sus reservas. Poblador: las reservas recibidas."""
    db = get_db()
    campo = "turista_id" if usuario["rol"] == "turista" else "poblador_id"
    filtro: dict = {campo: oid(usuario["id"])}
    if estado:
        filtro["estado"] = estado
    return [_publica(d) for d in db.reservas.find(filtro).sort("creado_en", -1)]


@router.post("/{reserva_id}/cancelar")
def cancelar_reserva(reserva_id: str, usuario: dict = Depends(usuario_actual)):
    db = get_db()
    doc = db.reservas.find_one({"_id": oid(reserva_id)})
    if doc is None:
        raise HTTPException(404, "Reserva no encontrada")
    if usuario["id"] not in (str(doc["turista_id"]), str(doc["poblador_id"])):
        raise HTTPException(403, "No puedes cancelar esta reserva")
    if doc["estado"] != "confirmada":
        raise HTTPException(409, "La reserva ya no está activa")
    if a_date(doc["fecha_inicio"]) <= date.today():
        raise HTTPException(409, "No se puede cancelar una reserva que ya comenzó")

    db.reservas.update_one(
        {"_id": doc["_id"]}, {"$set": {"estado": "cancelada", "cancelada_en": ahora()}}
    )
    db.pobladores.update_one(
        {"usuario_id": doc["poblador_id"]},
        {"$inc": {"reservas_recibidas": -1, "ingresos": -doc["precio_final"]}},
    )
    doc["estado"] = "cancelada"
    return _publica(doc)
