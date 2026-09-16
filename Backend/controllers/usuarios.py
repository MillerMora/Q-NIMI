"""Controlador de usuarios."""

from connection.BD import get_connection
from models.usuario import crear_usuario as registrar_usuario
from models.usuario import obtener_usuario as consultar_usuario
from models.usuario import verificar_credenciales as validar_credenciales
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


class UsuarioCreate(BaseModel):
    nombre_usuario: str
    password: str
    tipo_usuario_id: int = 3


def crear_usuario(
    nombre_usuario: str,
    password: str,
    tipo_usuario_id: int = 3,
) -> dict:
    """Registra un usuario nuevo."""
    connection = get_connection()
    try:
        return registrar_usuario(
            connection, nombre_usuario, password, tipo_usuario_id
        )
    finally:
        connection.close()


class LoginRequest(BaseModel):
    nombre_usuario: str
    password: str

def login_usuario(datos: LoginRequest) -> dict | None:
    connection = get_connection()
    try:
        return validar_credenciales(connection, datos.nombre_usuario, datos.password)
    finally:
        connection.close()


def obtener_usuario(usuario_id: int) -> dict | None:
    """Obtiene un usuario por su identificador."""
    connection = get_connection()
    try:
        return consultar_usuario(connection, usuario_id)
    finally:
        connection.close()


# --- Endpoints ---

@router.post("/", status_code=201)
def post_usuario(datos: UsuarioCreate):
    return crear_usuario(datos.nombre_usuario, datos.password, datos.tipo_usuario_id)


@router.get("/{usuario_id}")
def get_usuario(usuario_id: int):
    usuario = obtener_usuario(usuario_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.post("/login")
def post_login(datos: LoginRequest):
    usuario = login_usuario(datos)
    if usuario is None:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return usuario