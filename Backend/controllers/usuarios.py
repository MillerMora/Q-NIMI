"""Controlador de usuarios."""

from connection.BD import get_connection
from models.usuario import crear_usuario as registrar_usuario
from models.usuario import obtener_usuario as consultar_usuario


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


def obtener_usuario(usuario_id: int) -> dict | None:
    """Obtiene un usuario por su identificador."""
    connection = get_connection()
    try:
        return consultar_usuario(connection, usuario_id)
    finally:
        connection.close()
