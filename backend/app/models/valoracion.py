from pydantic import BaseModel, Field


class ValoracionIn(BaseModel):
    reserva_id: str
    puntaje: int = Field(ge=1, le=5)
    comentario: str = Field(default="", max_length=500)
