"""Ranking de reputación ponderada de los pobladores.

Puntuación de 0 a 100 = valoraciones + cantidad de reseñas + antigüedad.
Los pesos y constantes están aquí para ajustarlos sin tocar el resto del código.
"""

from datetime import date

PESO_VALORACION = 0.60
PESO_CANTIDAD = 0.25
PESO_ANTIGUEDAD = 0.15
# Reseñas necesarias para llegar a la mitad del peso de cantidad.
K_CANTIDAD = 5
# A partir de este número de años, la antigüedad ya no suma más.
ANIOS_MAX = 5


def puntuar(puntajes: list[int], antiguedad_dias: int) -> float:
    n = len(puntajes)
    promedio = sum(puntajes) / n if n else 0.0
    valoracion = promedio / 5                     # 0..1
    cantidad = n / (n + K_CANTIDAD)               # 0..1, satura al crecer
    anios = min(max(antiguedad_dias, 0) / 365.25, ANIOS_MAX) / ANIOS_MAX  # 0..1
    score = (
        PESO_VALORACION * valoracion
        + PESO_CANTIDAD * cantidad
        + PESO_ANTIGUEDAD * anios
    )
    return round(score * 100, 2)


def ranking(pobladores: list[dict], hoy: date) -> list[dict]:
    """Ordena de mayor a menor reputación.

    Cada dict de entrada: id, nombre, puntajes (list[int]), creado_en (date).
    """
    filas = []
    for p in pobladores:
        puntajes = p.get("puntajes", [])
        filas.append(
            {
                "poblador_id": p["id"],
                "nombre": p.get("nombre"),
                "reputacion": puntuar(puntajes, (hoy - p["creado_en"]).days),
                "promedio": round(sum(puntajes) / len(puntajes), 2) if puntajes else None,
                "n_resenas": len(puntajes),
            }
        )
    # Desempate estable por id para que el orden sea reproducible.
    return sorted(filas, key=lambda f: (-f["reputacion"], f["poblador_id"]))
