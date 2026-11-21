from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException

from app.config import get_settings
from app.consultas import carga_por_poblador, ocupacion_por_servicio, reputaciones
from app.database import ahora, get_db, oid
from app.models.itinerario import ItinerarioIn
from app.modules.errores import PresupuestoInsuficiente, SinOferta
from app.modules.impacto import desglose
from app.modules.itinerarios import Solicitud, generar_itinerario
from app.security import solo_turista

router = APIRouter(prefix="/itinerario", tags=["itinerario"])


@router.post("", status_code=201)
def generar(body: ItinerarioIn, usuario: dict = Depends(solo_turista)):
    db = get_db()
    s = get_settings()
    hoy = date.today()

    filtro: dict = {"activo": True, "capacidad": {"$gte": body.personas}}
    if body.localidad:
        filtro["localidad"] = body.localidad
    documentos = list(db.servicios.find(filtro))
    reps = reputaciones(db, hoy)

    servicios = [
        {
            "id": str(d["_id"]),
            "titulo": d["titulo"],
            "categoria": d["categoria"],
            "precio": d["precio"],
            "capacidad": d["capacidad"],
            "localidad": d["localidad"],
            "poblador_id": str(d["poblador_id"]),
            "poblador_nombre": d.get("poblador_nombre"),
            "intereses": d.get("intereses", []),
            "reputacion": reps.get(str(d["poblador_id"]), {}).get("reputacion", 0),
        }
        for d in documentos
    ]

    inicio = body.fecha_inicio or hoy
    ocupacion = ocupacion_por_servicio(
        db,
        [d["_id"] for d in documentos],
        inicio,
        inicio + timedelta(days=body.dias),
    )

    sol = Solicitud(
        presupuesto=body.presupuesto,
        dias=body.dias,
        personas=body.personas,
        intereses=list(body.intereses),
        localidad=body.localidad,
        fecha_inicio=body.fecha_inicio,
    )
    try:
        plan = generar_itinerario(
            sol,
            servicios,
            hoy=hoy,
            carga=carga_por_poblador(db),
            ocupacion=ocupacion,
        )
    except PresupuestoInsuficiente as e:
        raise HTTPException(422, detail={"mensaje": str(e), "minimo": e.minimo})
    except SinOferta as e:
        raise HTTPException(422, detail={"mensaje": str(e), "minimo": None})

    impacto = desglose(plan["total"], s.comision_plataforma, s.comision_agencia)
    res = db.itinerarios.insert_one(
        {
            "turista_id": oid(usuario["id"]),
            "solicitud": body.model_dump(mode="json"),
            "plan": plan,
            "impacto": impacto,
            "creado_en": ahora(),
        }
    )
    return {"id": str(res.inserted_id), **plan, "impacto": impacto}
