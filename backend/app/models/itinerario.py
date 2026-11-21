from datetime import date

from pydantic import BaseModel, Field

from app.models.servicio import Interes


class ItinerarioIn(BaseModel):
    presupuesto: float = Field(gt=0, le=100000, description="Soles")
    dias: int = Field(ge=1, le=5)
    personas: int = Field(ge=1, le=20)
    intereses: list[Interes] = Field(min_length=1)
    localidad: str | None = None
    fecha_inicio: date | None = None
