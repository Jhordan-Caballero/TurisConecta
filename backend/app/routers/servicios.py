from datetime import date
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query

from app.consultas import reputaciones
from app.database import ahora, como_publico, get_db, oid
from app.models.servicio import Categoria, ServicioIn
from app.security import solo_poblador

router = APIRouter(prefix="/servicios", tags=["servicios"])


def _publico(doc: dict, reputacion: float | None) -> dict:
    salida = como_publico(doc)
    salida["activo"] = doc.get("activo", True)
    salida["reputacion"] = reputacion
    salida["creado_en"] = doc["creado_en"]
    # El frontend usa camelCase para la imagen.
    salida["imagenUrl"] = doc.get("imagen_url")
    return salida


@router.post("", status_code=201)
def crear_servicio(body: ServicioIn, usuario: dict = Depends(solo_poblador)):
    db = get_db()
    perfil = db.pobladores.find_one({"usuario_id": oid(usuario["id"])})
    if perfil is None:
        raise HTTPException(409, "Tu perfil de poblador no está completo")

    doc = body.model_dump()
    doc["localidad"] = body.localidad or perfil["localidad"]
    doc.update(
        poblador_id=oid(usuario["id"]),
        poblador_nombre=usuario["nombre"],
        activo=True,
        creado_en=ahora(),
    )
    res = db.servicios.insert_one(doc)
    doc["_id"] = res.inserted_id
    return _publico(doc, None)


@router.get("")
def listar_servicios(
    categoria: Categoria | None = None,
    localidad: str | None = None,
    precio_min: float | None = Query(None, ge=0),
    precio_max: float | None = Query(None, ge=0),
    personas: int = Query(1, ge=1, le=20),
    orden: Literal["precio", "reputacion"] = "precio",
):
    db = get_db()
    filtro: dict = {"activo": True, "capacidad": {"$gte": personas}}
    if categoria:
        filtro["categoria"] = categoria
    if localidad:
        filtro["localidad"] = localidad
    if precio_min is not None or precio_max is not None:
        rango = {}
        if precio_min is not None:
            rango["$gte"] = precio_min
        if precio_max is not None:
            rango["$lte"] = precio_max
        filtro["precio"] = rango

    reps = reputaciones(db, date.today())
    servicios = [
        _publico(d, reps.get(str(d["poblador_id"]), {}).get("reputacion"))
        for d in db.servicios.find(filtro)
    ]
    if orden == "reputacion":
        servicios.sort(key=lambda s: -(s["reputacion"] or 0))
    else:
        servicios.sort(key=lambda s: s["precio"])
    return servicios


@router.get("/mios")
def mis_servicios(usuario: dict = Depends(solo_poblador)):
    db = get_db()
    docs = db.servicios.find({"poblador_id": oid(usuario["id"])}).sort("creado_en", -1)
    return [_publico(d, None) for d in docs]


@router.delete("/{servicio_id}")
def desactivar_servicio(servicio_id: str, usuario: dict = Depends(solo_poblador)):
    """Borrado lógico: el servicio deja de aparecer, pero las reservas se conservan."""
    res = get_db().servicios.update_one(
        {"_id": oid(servicio_id), "poblador_id": oid(usuario["id"]), "activo": True},
        {"$set": {"activo": False}},
    )
    if res.matched_count == 0:
        raise HTTPException(404, "Servicio no encontrado")
    return {"mensaje": "Servicio desactivado"}
