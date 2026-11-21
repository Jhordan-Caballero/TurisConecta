from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Categoria = Literal["Hospedaje", "Guiado", "Gastronomía", "Artesanía"]
Interes = Literal["Aventura", "Cultura", "Comida", "Naturaleza"]


class ServicioIn(BaseModel):
    # Acepta "imagenUrl" (frontend) e "imagen_url" (Python).
    model_config = ConfigDict(populate_by_name=True)

    titulo: str = Field(min_length=3, max_length=120)
    categoria: Categoria
    # Soles por persona. En hospedaje, por noche.
    precio: float = Field(gt=0, le=10000)
    # Personas que puede atender por día (o por noche en hospedaje).
    capacidad: int = Field(ge=1, le=100)
    # Si no se envía, se usa la localidad del perfil del poblador.
    localidad: str | None = Field(default=None, min_length=3, max_length=80)
    descripcion: str = Field(default="", max_length=800)
    imagen_url: str | None = Field(default=None, alias="imagenUrl")
    intereses: list[Interes] = Field(default_factory=list)
