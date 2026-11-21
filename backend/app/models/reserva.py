from datetime import date

from pydantic import BaseModel, Field


class ReservaIn(BaseModel):
    servicio_id: str
    # fecha_fin es el día de salida (sin incluir). Guiados y similares: fin = inicio + 1.
    fecha_inicio: date
    fecha_fin: date
    personas: int = Field(ge=1, le=20)
