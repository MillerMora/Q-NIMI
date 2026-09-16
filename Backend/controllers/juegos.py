"""Controlador de juegos."""

from connection.BD import get_connection
from models.juego import listar_juegos as consultar_juegos
from models.juego import obtener_juego as consultar_juego
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/juegos", tags=["juegos"])


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

# --- Endpoints ---

@router.get("/")
def get_juegos():
    return listar_juegos()


@router.get("/{juego_id}")
def get_juego(juego_id: int):
    juego = obtener_juego(juego_id)
    if juego is None:
        raise HTTPException(status_code=404, detail="Juego no encontrado")
    return juego