"""Consultas SQL relacionadas con resultados."""

from mysql.connector import MySQLConnection


def crear_resultado(
    connection: MySQLConnection,
    usuario_id: int,
    juego_id: int,
    puntaje: int,
) -> dict:
    """Guarda un puntaje y devuelve el registro creado."""
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            INSERT INTO Resultados (usuario_id, juego_id, puntaje)
            VALUES (%s, %s, %s)
            """,
            (usuario_id, juego_id, puntaje),
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
        return cursor.fetchone()
    except Exception:
        connection.rollback()
        raise
    finally:
        cursor.close()


def listar_resultados_usuario(
    connection: MySQLConnection, usuario_id: int
) -> list[dict]:
    """Devuelve los resultados de un usuario ordenados por fecha."""
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT resultado_id, usuario_id, juego_id, puntaje, fecha_juego
            FROM Resultados
            WHERE usuario_id = %s
            ORDER BY fecha_juego DESC
            """,
            (usuario_id,),
        )
        return cursor.fetchall()
    finally:
        cursor.close()
