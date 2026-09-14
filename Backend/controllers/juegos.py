"""Controlador de juegos."""

from connection.BD import get_connection
from models.juego import listar_juegos as consultar_juegos
from models.juego import obtener_juego as consultar_juego


def listar_juegos() -> list[dict]:
    """Devuelve todos los juegos disponibles."""
    connection = get_connection()
    try:
        return consultar_juegos(connection)
    finally:
        connection.close()


def obtener_juego(juego_id: int) -> dict | None:
    """Obtiene un juego por su identificador."""
    connection = get_connection()
    try:
        return consultar_juego(connection, juego_id)
    finally:
        connection.close()
