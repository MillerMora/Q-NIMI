"""Consultas SQL relacionadas con usuarios."""

from mysql.connector import MySQLConnection


def crear_usuario(
    connection: MySQLConnection,
    nombre_usuario: str,
    password: str,
    tipo_usuario_id: int = 3,
) -> dict:
    """Registra un usuario y devuelve sus datos publicos."""
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            INSERT INTO Usuarios (nombre_usuario, password, tipo_usuario_id)
            VALUES (%s, %s, %s)
            """,
            (nombre_usuario, password, tipo_usuario_id),
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
        return cursor.fetchone()
    except Exception:
        connection.rollback()
        raise
    finally:
        cursor.close()


def obtener_usuario(connection: MySQLConnection, usuario_id: int) -> dict | None:
    """Devuelve un usuario sin exponer su contrasena."""
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT usuario_id, nombre_usuario, tipo_usuario_id, fecha_registro
            FROM Usuarios
            WHERE usuario_id = %s
            """,
            (usuario_id,),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        
def verificar_credenciales(connection, nombre_usuario: str, password: str) -> dict | None:
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM Usuarios WHERE nombre_usuario=%s AND password=%s",
        (nombre_usuario, password)
    )
    usuario = cursor.fetchone()
    cursor.close()
    return usuario