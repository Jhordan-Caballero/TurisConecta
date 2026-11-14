from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Agrega la carpeta backend al path para que encuentre database.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import servicios_collection

app = FastAPI()

# Configuración de CORS vital para que React no sea bloqueado
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class Servicio(BaseModel):
    tipo: str
    precio: float
    capacidad: int
    localidad: str
    poblador: str

@app.post("/servicios")
def registrar_servicio(servicio: Servicio):
    nuevo_servicio = servicio.model_dump()
    servicios_collection.insert_one(nuevo_servicio)
    return {"mensaje": "Servicio registrado exitosamente"}

@app.get("/servicios")
def listar_servicios():
    servicios = list(servicios_collection.find({}, {"_id": 0}))
    return servicios