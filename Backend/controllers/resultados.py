"""Controlador de resultados."""

from connection.BD import get_connection
from models.resultado import crear_resultado as guardar_resultado
from models.resultado import listar_resultados_usuario as consultar_resultados


def crear_resultado(usuario_id: int, juego_id: int, puntaje: int) -> dict:
    """Guarda el puntaje obtenido por un usuario en un juego."""
    connection = get_connection()
    try:
        return guardar_resultado(connection, usuario_id, juego_id, puntaje)
    finally:
        connection.close()


def listar_resultados_usuario(usuario_id: int) -> list[dict]:
    """Devuelve los resultados de un usuario ordenados por fecha."""
    connection = get_connection()
    try:
        return consultar_resultados(connection, usuario_id)
    finally:
        connection.close()
