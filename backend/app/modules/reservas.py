"""Motor de reservas: fechas, capacidad, cruces de fechas y precio final.

Convenciones:
- fecha_inicio es el día de llegada; fecha_fin es el día de salida, sin incluir.
  Un hospedaje con inicio=10 y fin=12 ocupa las noches del 10 y del 11.
- Guiados, gastronomía y artesanías ocupan un solo día: fin = inicio + 1.
- El precio del servicio es por persona (por noche en hospedaje).
- En temporada alta el precio de cada día se multiplica por FACTOR_ALTA.
"""

from datetime import date, timedelta

from app.modules.errores import ConflictoReserva, ReservaInvalida

CATEGORIA_HOSPEDAJE = "Hospedaje"
# Enero, y junio a agosto (temporada seca y vacaciones), y diciembre.
MESES_ALTA = frozenset({1, 6, 7, 8, 12})
FACTOR_ALTA = 1.25
FACTOR_BAJA = 1.0


def factor_temporada(dia: date) -> float:
    return FACTOR_ALTA if dia.month in MESES_ALTA else FACTOR_BAJA


def dias_ocupados(inicio: date, fin: date) -> list[date]:
    """Días que ocupa una reserva: desde inicio hasta fin (sin incluir)."""
    return [inicio + timedelta(days=i) for i in range((fin - inicio).days)]


def se_solapan(a_ini: date, a_fin: date, b_ini: date, b_fin: date) -> bool:
    return a_ini < b_fin and b_ini < a_fin


def validar_fechas(categoria: str, inicio: date, fin: date, hoy: date) -> None:
    if fin <= inicio:
        raise ReservaInvalida("La fecha de salida debe ser posterior a la de llegada.")
    if inicio < hoy:
        raise ReservaInvalida("No se puede reservar en fechas pasadas.")
    if categoria != CATEGORIA_HOSPEDAJE and (fin - inicio).days != 1:
        raise ReservaInvalida(
            "Este servicio se reserva por un solo día: "
            "la salida debe ser el día siguiente a la llegada."
        )


def calcular_precio(
    precio_unitario: float, categoria: str, personas: int, inicio: date, fin: date
) -> dict:
    """Precio final de una reserva, con recargo por temporada día a día."""
    dias = dias_ocupados(inicio, fin)
    base = precio_unitario * personas * len(dias)
    final = precio_unitario * personas * sum(factor_temporada(d) for d in dias)
    return {
        "unidades": len(dias),
        "precio_base": round(base, 2),
        "precio_final": round(final, 2),
    }


def cupo_minimo(
    capacidad: int, reservas: list[dict], inicio: date, fin: date
) -> int:
    """Lugares libres en el día más lleno del rango [inicio, fin).

    `reservas` son las confirmadas del servicio, con fecha_inicio, fecha_fin
    (ambas date) y personas.
    """
    libres = []
    for dia in dias_ocupados(inicio, fin):
        ocupados = sum(
            r["personas"] for r in reservas if r["fecha_inicio"] <= dia < r["fecha_fin"]
        )
        libres.append(capacidad - ocupados)
    return min(libres)


def verificar_capacidad(
    capacidad: int, reservas: list[dict], inicio: date, fin: date, personas: int
) -> None:
    libres = cupo_minimo(capacidad, reservas, inicio, fin)
    if libres < personas:
        raise ConflictoReserva(
            f"Sin cupo: solo quedan {max(libres, 0)} lugar(es) en alguno de esos días."
        )


def verificar_sin_cruce_turista(
    reservas_turista: list[dict], inicio: date, fin: date
) -> None:
    for r in reservas_turista:
        if se_solapan(inicio, fin, r["fecha_inicio"], r["fecha_fin"]):
            raise ConflictoReserva(
                "Ya tienes una reserva confirmada que se cruza con esas fechas."
            )
