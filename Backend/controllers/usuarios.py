"""Rutas relacionadas con usuarios."""

import mysql.connector
from fastapi import APIRouter, HTTPException, status

from connection.BD import get_connection
from models.usuario import UsuarioCreate, UsuarioResponse


router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])


@router.post("", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario: UsuarioCreate) -> UsuarioResponse:
    """Registra un usuario nuevo."""
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            INSERT INTO Usuarios (nombre_usuario, password, tipo_usuario_id)
            VALUES (%s, %s, %s)
            """,
            (usuario.nombre_usuario, usuario.password, usuario.tipo_usuario_id),
        )
        connection.commit()
        cursor.execute(
            """
            SELECT usuario_id, nombre_usuario, tipo_usuario_id, fecha_registro
            FROM Usuarios
            WHERE usuario_id = %s
            """,
            (cursor.lastrowid,),
        )
        resultado = cursor.fetchone()
        cursor.close()
        return UsuarioResponse.model_validate(resultado)
    except mysql.connector.IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El nombre de usuario ya existe o el tipo de usuario no es valido.",
        ) from error
    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo conectar con la base de datos.",
        ) from error
    finally:
        if connection is not None:
            connection.close()


@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obtener_usuario(usuario_id: int) -> UsuarioResponse:
    """Obtiene un usuario por su identificador."""
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT usuario_id, nombre_usuario, tipo_usuario_id, fecha_registro
            FROM Usuarios
            WHERE usuario_id = %s
            """,
            (usuario_id,),
        )
        resultado = cursor.fetchone()
        cursor.close()
        if resultado is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado.")
        return UsuarioResponse.model_validate(resultado)
    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo conectar con la base de datos.",
        ) from error
    finally:
        if connection is not None:
            connection.close()
