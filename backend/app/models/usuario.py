from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Rol = Literal["turista", "poblador"]


class RegistroIn(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    email: EmailStr
    # bcrypt solo usa los primeros 72 bytes de la contraseña.
    password: str = Field(min_length=8, max_length=72)
    rol: Rol = "turista"
    # Obligatoria para pobladores: de aquí sale la localidad de sus servicios.
    localidad: str | None = Field(default=None, min_length=3, max_length=80)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id: str
    nombre: str
    rol: Rol
