"""Consultas SQL relacionadas con juegos."""

from mysql.connector import MySQLConnection


def listar_juegos(connection: MySQLConnection) -> list[dict]:
    """Devuelve todos los juegos disponibles."""
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT juego_id, nombre_juego, descripcion
            FROM Juegos
            ORDER BY juego_id
            """
        )
        return cursor.fetchall()
    finally:
        cursor.close()


def obtener_juego(connection: MySQLConnection, juego_id: int) -> dict | None:
    """Devuelve un juego por su identificador."""
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT juego_id, nombre_juego, descripcion
            FROM Juegos
            WHERE juego_id = %s
            """,
            (juego_id,),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
