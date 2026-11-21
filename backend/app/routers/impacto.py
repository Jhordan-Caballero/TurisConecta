from fastapi import APIRouter, Depends

from app.config import get_settings
from app.consultas import reservas_contables
from app.database import get_db, oid
from app.modules.demanda import analizar_demanda
from app.modules.impacto import (
    desglose,
    pipeline_por_localidad,
    pipeline_por_poblador,
    pipeline_total,
)
from app.security import usuario_actual

router = APIRouter(prefix="/impacto", tags=["impacto"])


@router.get("")
def reporte_impacto(
    localidad: str | None = None,
    poblador_id: str | None = None,
    usuario: dict = Depends(usuario_actual),
):
    """Ingresos de la comunidad frente a lo que se llevaría una agencia.

    Un poblador solo ve su propio reporte.
    """
    if usuario["rol"] == "poblador":
        poblador_id = usuario["id"]
    pid = oid(poblador_id) if poblador_id else None

    db = get_db()
    s = get_settings()
    com = (s.comision_plataforma, s.comision_agencia)

    total = next(
        db.reservas.aggregate(pipeline_total(localidad, pid)),
        {"reservas": 0, "ingreso_bruto": 0.0},
    )
    por_localidad = list(db.reservas.aggregate(pipeline_por_localidad(localidad, pid)))
    por_poblador = list(db.reservas.aggregate(pipeline_por_poblador(localidad, pid)))

    return {
        "reservas": total["reservas"],
        "total": desglose(total["ingreso_bruto"], *com),
        "por_localidad": [{**fila, **desglose(fila["ingreso_bruto"], *com)} for fila in por_localidad],
        "por_poblador": [{**fila, **desglose(fila["ingreso_bruto"], *com)} for fila in por_poblador],
    }


@router.get("/demanda")
def demanda(usuario: dict = Depends(usuario_actual)):
    """Temporadas y localidades con más turismo (análisis con pandas)."""
    return analizar_demanda(reservas_contables(get_db()))
