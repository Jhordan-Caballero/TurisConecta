"""Análisis de demanda con pandas: meses pico y localidades más visitadas.

Módulo opcional. Recibe reservas confirmadas como dicts con:
localidad (str), fecha_inicio (date), personas (int).
"""

import pandas as pd

MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre",
]


def analizar_demanda(reservas: list[dict]) -> dict:
    if not reservas:
        return {"temporada_pico": None, "por_mes": [], "por_localidad": []}

    df = pd.DataFrame(reservas)[["localidad", "fecha_inicio", "personas"]]
    df["mes"] = pd.to_datetime(df["fecha_inicio"]).dt.month

    por_mes = (
        df.groupby("mes")["personas"].sum().sort_values(ascending=False)
    )
    por_loc = (
        df.groupby("localidad")
        .agg(reservas=("personas", "size"), personas=("personas", "sum"))
        .sort_values("personas", ascending=False)
        .reset_index()
    )

    pico = int(por_mes.index[0])
    return {
        "temporada_pico": MESES[pico - 1],
        "por_mes": [
            {"mes": MESES[int(m) - 1], "personas": int(p)} for m, p in por_mes.items()
        ],
        "por_localidad": [
            {
                "localidad": r.localidad,
                "reservas": int(r.reservas),
                "personas": int(r.personas),
            }
            for r in por_loc.itertuples()
        ],
    }
