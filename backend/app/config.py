"""Configuración leída de variables de entorno (.env o docker-compose)."""

import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    mongo_uri: str
    mongo_db: str
    jwt_secret: str
    jwt_alg: str
    jwt_expire_minutes: int
    comision_plataforma: float
    comision_agencia: float
    cors_origins: tuple[str, ...]


@lru_cache
def get_settings() -> Settings:
    origenes = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    return Settings(
        mongo_uri=os.getenv("MONGO_URL") or os.getenv("MONGO_URI", "mongodb://localhost:27017"),
        mongo_db=os.getenv("MONGO_DB", "turisconecta"),
        jwt_secret=os.getenv("JWT_SECRET", "cambiar-en-produccion"),
        jwt_alg=os.getenv("JWT_ALG", "HS256"),
        jwt_expire_minutes=int(os.getenv("JWT_EXPIRE_MINUTES", "120")),
        comision_plataforma=float(os.getenv("COMISION_PLATAFORMA", "0.05")),
        comision_agencia=float(os.getenv("COMISION_AGENCIA", "0.30")),
        cors_origins=tuple(o.strip() for o in origenes.split(",") if o.strip()),
    )
