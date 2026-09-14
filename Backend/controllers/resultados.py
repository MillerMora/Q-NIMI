"""Rutas relacionadas con los puntajes."""

import mysql.connector
from fastapi import APIRouter, HTTPException, status

from connection.BD import get_connection
from models.resultado import ResultadoCreate, ResultadoResponse


router = APIRouter(prefix="/api/resultados", tags=["Resultados"])


@router.post("", response_model=ResultadoResponse, status_code=status.HTTP_201_CREATED)
def crear_resultado(resultado: ResultadoCreate) -> ResultadoResponse:
    """Guarda el puntaje obtenido por un usuario en un juego."""
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            INSERT INTO Resultados (usuario_id, juego_id, puntaje)
            VALUES (%s, %s, %s)
            """,
            (resultado.usuario_id, resultado.juego_id, resultado.puntaje),
        )
        connection.commit()
        cursor.execute(
            """
            SELECT resultado_id, usuario_id, juego_id, puntaje, fecha_juego
            FROM Resultados
            WHERE resultado_id = %s
            """,
            (cursor.lastrowid,),
        )
        registro = cursor.fetchone()
        cursor.close()
        return ResultadoResponse.model_validate(registro)
    except mysql.connector.IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El usuario o el juego no existen.",
        ) from error
    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo conectar con la base de datos.",
        ) from error
    finally:
        if connection is not None:
            connection.close()


@router.get("/usuario/{usuario_id}", response_model=list[ResultadoResponse])
def listar_resultados_usuario(usuario_id: int) -> list[ResultadoResponse]:
    """Devuelve los resultados de un usuario ordenados por fecha."""
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT resultado_id, usuario_id, juego_id, puntaje, fecha_juego
            FROM Resultados
            WHERE usuario_id = %s
            ORDER BY fecha_juego DESC
            """,
            (usuario_id,),
        )
        resultados = cursor.fetchall()
        cursor.close()
        return [ResultadoResponse.model_validate(item) for item in resultados]
    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo conectar con la base de datos.",
        ) from error
    finally:
        if connection is not None:
            connection.close()
