"""Generador de itinerarios: arma el plan día por día dentro del presupuesto.

Orden de decisión:
1. Alojamiento para todo el viaje (si son 2 días o más), elegido con el
   asignador equitativo entre los que caben en el presupuesto.
2. Una actividad por día (guiado, gastronomía o artesanía). Se prefiere la que
   coincide con los intereses del turista y que no se repite. Entre empatados
   manda el asignador equitativo.
3. En cada paso se verifica que el gasto acumulado, más el mínimo de lo que
   falta por pagar, no supere el presupuesto. Así el plan nunca se pasa.
"""

from dataclasses import dataclass
from datetime import date, timedelta

from app.modules.asignador import clave_equidad, registrar_asignacion
from app.modules.errores import PresupuestoInsuficiente, SinOferta
from app.modules.reservas import calcular_precio, cupo_minimo

CATEGORIA_HOSPEDAJE = "Hospedaje"
CATEGORIAS_ACTIVIDAD = ("Guiado", "Gastronomía", "Artesanía")

# Qué categorías encajan con cada interés, si el servicio no tiene etiquetas.
MAPA_INTERES_CATEGORIA = {
    "Aventura": {"Guiado"},
    "Cultura": {"Guiado", "Artesanía"},
    "Comida": {"Gastronomía"},
    "Naturaleza": {"Guiado"},
}


@dataclass
class Solicitud:
    presupuesto: float
    dias: int
    personas: int
    intereses: list[str]
    localidad: str | None = None
    fecha_inicio: date | None = None


def puntaje_interes(servicio: dict, intereses: list[str]) -> int:
    """2 puntos si el servicio tiene la etiqueta del interés, 1 si su categoría encaja."""
    etiquetas = set(servicio.get("intereses") or [])
    puntos = 0
    for interes in intereses:
        if interes in etiquetas:
            puntos += 2
        elif servicio["categoria"] in MAPA_INTERES_CATEGORIA.get(interes, set()):
            puntos += 1
    return puntos


def _costo(servicio: dict, personas: int, inicio: date, fin: date) -> float:
    return calcular_precio(servicio["precio"], servicio["categoria"], personas, inicio, fin)[
        "precio_final"
    ]


def _item(servicio: dict, personas: int, inicio: date, fin: date, puntaje: int = 0) -> dict:
    precio = calcular_precio(servicio["precio"], servicio["categoria"], personas, inicio, fin)
    return {
        "servicio_id": servicio["id"],
        "titulo": servicio["titulo"],
        "categoria": servicio["categoria"],
        "localidad": servicio["localidad"],
        "poblador_id": servicio["poblador_id"],
        "poblador_nombre": servicio.get("poblador_nombre"),
        "precio_unitario": servicio["precio"],
        "unidades": precio["unidades"],
        "costo_total": precio["precio_final"],
        "fecha_inicio": inicio.isoformat(),
        "fecha_fin": fin.isoformat(),
        "puntaje_interes": puntaje,
    }


def generar_itinerario(
    sol: Solicitud,
    servicios: list[dict],
    *,
    hoy: date,
    carga: dict[str, int] | None = None,
    ocupacion: dict[str, list[dict]] | None = None,
) -> dict:
    """Arma el plan del turista.

    servicios: dicts con id, titulo, categoria, precio, capacidad, localidad,
        poblador_id, poblador_nombre, intereses (list), reputacion (float).
    carga: reservas actuales por poblador_id (para el balance de carga).
    ocupacion: reservas confirmadas por servicio_id, con fecha_inicio, fecha_fin
        y personas. Sirve para descartar servicios sin cupo en esas fechas.
    hoy: fecha de referencia cuando el turista no indica fecha de inicio.
    """
    if sol.dias < 1:
        raise ValueError("El número de días debe ser al menos 1.")

    carga = dict(carga or {})
    ultima: dict[str, int] = {}
    secuencia = [0]
    ocupacion = ocupacion or {}
    usados: set[str] = set()

    base = sol.fecha_inicio or hoy
    fechas = [base + timedelta(days=i) for i in range(sol.dias)]
    fin_alojamiento = base + timedelta(days=sol.dias - 1)

    def con_cupo(s: dict, inicio: date, fin: date) -> bool:
        libres = cupo_minimo(s["capacidad"], ocupacion.get(s["id"], []), inicio, fin)
        return libres >= sol.personas

    candidatos = [
        s
        for s in servicios
        if s["capacidad"] >= sol.personas
        and (not sol.localidad or s["localidad"] == sol.localidad)
    ]
    hospedajes = [s for s in candidatos if s["categoria"] == CATEGORIA_HOSPEDAJE]
    actividades = [s for s in candidatos if s["categoria"] in CATEGORIAS_ACTIVIDAD]

    # Actividades que se pueden hacer cada día y su costo mínimo.
    pools = []
    for d in fechas:
        pool = [s for s in actividades if con_cupo(s, d, d + timedelta(days=1))]
        if not pool:
            raise SinOferta(
                f"No hay actividades disponibles el {d.isoformat()} "
                f"para {sol.personas} persona(s)."
            )
        pools.append(pool)
    min_act = [
        min(_costo(s, sol.personas, d, d + timedelta(days=1)) for s in pool)
        for d, pool in zip(fechas, pools)
    ]

    def asignar(s: dict) -> None:
        secuencia[0] += 1
        registrar_asignacion(s["poblador_id"], carga, ultima, secuencia[0])

    gasto = 0.0
    alojamiento = None

    # 1) Alojamiento para todo el viaje.
    if sol.dias > 1:
        pool_h = [h for h in hospedajes if con_cupo(h, base, fin_alojamiento)]
        if not pool_h:
            raise SinOferta(
                f"No hay alojamiento disponible del {base.isoformat()} "
                f"al {fin_alojamiento.isoformat()} para {sol.personas} persona(s)."
            )
        minimo_total = min(_costo(h, sol.personas, base, fin_alojamiento) for h in pool_h) + sum(min_act)
        if minimo_total > sol.presupuesto:
            raise PresupuestoInsuficiente(minimo_total)

        orden_h = sorted(
            pool_h,
            key=lambda h: clave_equidad(h["poblador_id"], carga, ultima) + (-h.get("reputacion", 0),),
        )
        elegido = None
        for h in orden_h:
            costo = _costo(h, sol.personas, base, fin_alojamiento)
            if gasto + costo + sum(min_act) <= sol.presupuesto:
                elegido = h
                break
        if elegido is None:
            raise PresupuestoInsuficiente(minimo_total)

        gasto += _costo(elegido, sol.personas, base, fin_alojamiento)
        asignar(elegido)
        alojamiento = _item(elegido, sol.personas, base, fin_alojamiento)

    # 2) Una actividad por día.
    dias_out = []
    for i, d in enumerate(fechas):
        fin_d = d + timedelta(days=1)
        restante_min = sum(min_act[i + 1:])

        orden = sorted(
            pools[i],
            key=lambda s: (
                s["id"] in usados,
                -puntaje_interes(s, sol.intereses),
                *clave_equidad(s["poblador_id"], carga, ultima),
            ),
        )
        elegido = None
        for s in orden:
            if gasto + _costo(s, sol.personas, d, fin_d) + restante_min <= sol.presupuesto:
                elegido = s
                break
        if elegido is None:  # no debería ocurrir: el mínimo ya se verificó
            raise PresupuestoInsuficiente(gasto + sum(min_act[i:]))

        gasto += _costo(elegido, sol.personas, d, fin_d)
        asignar(elegido)
        usados.add(elegido["id"])
        dias_out.append(
            {
                "dia": i + 1,
                "fecha": d.isoformat(),
                "actividad": _item(
                    elegido, sol.personas, d, fin_d, puntaje_interes(elegido, sol.intereses)
                ),
            }
        )

    total = round(gasto, 2)
    proveedores = {alojamiento["poblador_id"]} if alojamiento else set()
    proveedores |= {d["actividad"]["poblador_id"] for d in dias_out}

    return {
        "fecha_inicio": base.isoformat(),
        "presupuesto": round(sol.presupuesto, 2),
        "total": total,
        "restante": round(sol.presupuesto - total, 2),
        "alojamiento": alojamiento,
        "dias": dias_out,
        "pobladores_beneficiados": len(proveedores),
    }
