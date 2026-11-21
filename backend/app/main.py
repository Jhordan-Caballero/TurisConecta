import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import PyMongoError

from app.config import get_settings
from app.database import crear_indices, get_db
from app.routers import auth, impacto, itinerario, reservas, servicios, valoraciones

log = logging.getLogger("turisconecta")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Con Docker Compose, la API puede arrancar antes que MongoDB: reintentamos.
    for intento in range(1, 11):
        try:
            crear_indices(get_db())
            break
        except PyMongoError as e:
            log.warning("MongoDB no responde (intento %d/10): %s", intento, e)
            time.sleep(2)
    else:
        raise RuntimeError("No se pudo conectar a MongoDB")
    yield


app = FastAPI(
    title="TurisConecta API",
    version="1.0.0",
    description="Conecta turistas con pobladores y artesanos de Arequipa.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(get_settings().cors_origins),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(servicios.router)
app.include_router(itinerario.router)
app.include_router(reservas.router)
app.include_router(valoraciones.router)
app.include_router(impacto.router)


@app.get("/health", tags=["sistema"])
def health():
    return {"estado": "ok"}
