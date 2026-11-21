"""Contraseñas cifradas (bcrypt), tokens JWT y control de roles."""

from datetime import datetime, timedelta, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import get_settings
from app.database import get_db

_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
_bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return _pwd.hash(password)


def verificar_password(password: str, password_hash: str) -> bool:
    return _pwd.verify(password, password_hash)


def crear_token(usuario_id: str, rol: str) -> str:
    s = get_settings()
    vence = datetime.now(timezone.utc) + timedelta(minutes=s.jwt_expire_minutes)
    return jwt.encode(
        {"sub": usuario_id, "rol": rol, "exp": vence}, s.jwt_secret, algorithm=s.jwt_alg
    )


def usuario_actual(cred: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> dict:
    no_autenticado = HTTPException(
        status_code=401,
        detail="Inicia sesión para continuar",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if cred is None:
        raise no_autenticado

    s = get_settings()
    try:
        payload = jwt.decode(cred.credentials, s.jwt_secret, algorithms=[s.jwt_alg])
        usuario_oid = ObjectId(payload["sub"])
    except (JWTError, KeyError, InvalidId, TypeError):
        raise no_autenticado

    doc = get_db().usuarios.find_one({"_id": usuario_oid}, {"password_hash": 0})
    if doc is None:
        raise no_autenticado
    return {
        "id": str(doc["_id"]),
        "nombre": doc["nombre"],
        "email": doc["email"],
        "rol": doc["rol"],
    }


def requerir_rol(*roles: str):
    def dependencia(usuario: dict = Depends(usuario_actual)) -> dict:
        if usuario["rol"] not in roles:
            raise HTTPException(status_code=403, detail="No tienes permiso para esta acción")
        return usuario

    return dependencia


solo_turista = requerir_rol("turista")
solo_poblador = requerir_rol("poblador")

@router.delete("/{servicio_id}")
def desactivar_servicio(servicio_id: str, usuario: dict = Depends(solo_poblador)):
    res = get_db().servicios.update_one(
        {"_id": oid(servicio_id), "poblador_id": oid(usuario["id"]), "activo": True},
        {"$set": {"activo": False}},
    )
    if res.matched_count == 0:
        raise HTTPException(404, "Servicio no encontrado")
    return {"mensaje": "Servicio desactivado"}