from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pymongo.errors import DuplicateKeyError

from app.database import a_date, ahora, como_publico, get_db, oid
from app.models.valoracion import ValoracionIn
from app.security import solo_turista, usuario_actual

router = APIRouter(prefix="/valoraciones", tags=["valoraciones"])


@router.post("", status_code=201)
def valorar(body: ValoracionIn, usuario: dict = Depends(solo_turista)):
    db = get_db()
    reserva = db.reservas.find_one({"_id": oid(body.reserva_id)})
    if reserva is None or str(reserva["turista_id"]) != usuario["id"]:
        raise HTTPException(404, "Reserva no encontrada")
    if reserva["estado"] != "confirmada":
        raise HTTPException(409, "Solo se pueden valorar reservas confirmadas")
    if a_date(reserva["fecha_fin"]) > date.today():
        raise HTTPException(409, "Podrás valorar el servicio cuando termine")

    doc = {
        "reserva_id": reserva["_id"],
        "servicio_id": reserva["servicio_id"],
        "servicio_titulo": reserva["servicio_titulo"],
        "poblador_id": reserva["poblador_id"],
        "turista_id": reserva["turista_id"],
        "puntaje": body.puntaje,
        "comentario": body.comentario.strip(),
        "creado_en": ahora(),
    }
    try:
        res = db.valoraciones.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(409, "Ya valoraste esta reserva")
    doc["_id"] = res.inserted_id
    return como_publico(doc)


@router.get("")
def listar_valoraciones(usuario: dict = Depends(usuario_actual)):
    """Poblador: las valoraciones que recibió. Turista: las que escribió."""
    db = get_db()
    campo = "poblador_id" if usuario["rol"] == "poblador" else "turista_id"
    docs = db.valoraciones.find({campo: oid(usuario["id"])}).sort("creado_en", -1)
    return [como_publico(d) for d in docs]
