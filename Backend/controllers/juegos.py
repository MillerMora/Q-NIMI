"""Rutas relacionadas con juegos."""

import mysql.connector
from fastapi import APIRouter, HTTPException, status

from connection.BD import get_connection
from models.juego import JuegoResponse


router = APIRouter(prefix="/api/juegos", tags=["Juegos"])


@router.get("", response_model=list[JuegoResponse])
def listar_juegos() -> list[JuegoResponse]:
    """Devuelve todos los juegos disponibles."""
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT juego_id, nombre_juego, descripcion
            FROM Juegos
            ORDER BY juego_id
            """
        )
        resultados = cursor.fetchall()
        cursor.close()
        return [JuegoResponse.model_validate(juego) for juego in resultados]
    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo conectar con la base de datos.",
        ) from error
    finally:
        if connection is not None:
            connection.close()


@router.get("/{juego_id}", response_model=JuegoResponse)
def obtener_juego(juego_id: int) -> JuegoResponse:
    """Obtiene un juego por su identificador."""
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT juego_id, nombre_juego, descripcion
            FROM Juegos
            WHERE juego_id = %s
            """,
            (juego_id,),
        )
        resultado = cursor.fetchone()
        cursor.close()
        if resultado is None:
            raise HTTPException(status_code=404, detail="Juego no encontrado.")
        return JuegoResponse.model_validate(resultado)
    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo conectar con la base de datos.",
        ) from error
    finally:
        if connection is not None:
            connection.close()
