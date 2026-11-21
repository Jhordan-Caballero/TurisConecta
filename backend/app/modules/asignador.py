"""Asignador equitativo: reparte las reservas entre pobladores.

Prioriza a quien tiene menos reservas (balance de carga). Entre empatados
rota: recibe primero quien hace más tiempo no recibe asignaciones.
"""

from collections.abc import Iterable


def clave_equidad(
    poblador_id: str, carga: dict[str, int], ultima: dict[str, int]
) -> tuple:
    """Clave de orden: menor carga primero, luego rotación y, por último, el id
    (para que el resultado sea determinista)."""
    return (carga.get(poblador_id, 0), ultima.get(poblador_id, -1), poblador_id)


def registrar_asignacion(
    poblador_id: str, carga: dict[str, int], ultima: dict[str, int], secuencia: int
) -> None:
    """Anota una asignación: sube su carga y marca el turno en que recibió."""
    carga[poblador_id] = carga.get(poblador_id, 0) + 1
    ultima[poblador_id] = secuencia


def ordenar_pobladores(
    ids: Iterable[str], carga: dict[str, int], ultima: dict[str, int]
) -> list[str]:
    """Devuelve los pobladores desde el que debe recibir primero."""
    return sorted(set(ids), key=lambda p: clave_equidad(p, carga, ultima))
