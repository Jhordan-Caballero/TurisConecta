from fastapi import APIRouter, Depends, HTTPException
from pymongo.errors import DuplicateKeyError

from app.database import ahora, get_db
from app.models.usuario import LoginIn, RegistroIn, TokenOut
from app.security import crear_token, hash_password, usuario_actual, verificar_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/registro", response_model=TokenOut, status_code=201)
def registro(body: RegistroIn):
    if body.rol == "poblador" and not body.localidad:
        raise HTTPException(422, "Los pobladores deben indicar su localidad")

    db = get_db()
    email = body.email.lower()
    nombre = body.nombre.strip()
    momento = ahora()
    try:
        res = db.usuarios.insert_one(
            {
                "nombre": nombre,
                "email": email,
                "password_hash": hash_password(body.password),
                "rol": body.rol,
                "creado_en": momento,
            }
        )
    except DuplicateKeyError:
        raise HTTPException(409, "Ya existe una cuenta con ese correo")

    if body.rol == "poblador":
        db.pobladores.insert_one(
            {
                "usuario_id": res.inserted_id,
                "nombre": nombre,
                "localidad": body.localidad.strip(),
                "reservas_recibidas": 0,
                "ingresos": 0.0,
                "creado_en": momento,
            }
        )

    return TokenOut(
        access_token=crear_token(str(res.inserted_id), body.rol),
        id=str(res.inserted_id),
        nombre=nombre,
        rol=body.rol,
    )


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn):
    doc = get_db().usuarios.find_one({"email": body.email.lower()})
    # Mismo mensaje si el correo no existe o la contraseña es incorrecta.
    if doc is None or not verificar_password(body.password, doc["password_hash"]):
        raise HTTPException(401, "Correo o contraseña incorrectos")

    return TokenOut(
        access_token=crear_token(str(doc["_id"]), doc["rol"]),
        id=str(doc["_id"]),
        nombre=doc["nombre"],
        rol=doc["rol"],
    )


@router.get("/me")
def me(usuario: dict = Depends(usuario_actual)):
    return usuario
