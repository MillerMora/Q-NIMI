"""Conexion e inicializacion de la base de datos de Q-NIMI."""

import os
from typing import Any

import mysql.connector
from dotenv import load_dotenv
from mysql.connector import MySQLConnection


load_dotenv()

DATABASE_NAME = os.getenv("DB_NAME", "juego_memoria")
_CONNECTION_CONFIG: dict[str, Any] = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
}


def _connect(database: str | None = DATABASE_NAME) -> MySQLConnection:
    """Abre una conexion MySQL usando variables de entorno."""
    config = {**_CONNECTION_CONFIG}
    if database:
        config["database"] = database
    return mysql.connector.connect(**config)


def create_database() -> None:
    """Crea la base de datos si todavia no existe."""
    connection = _connect(database=None)
    try:
        cursor = connection.cursor()
        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS `{DATABASE_NAME}` "
            "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
        connection.commit()
        cursor.close()
    finally:
        connection.close()


def initialize_database() -> None:
    """Crea las tablas y los datos iniciales de Q-NIMI."""
    create_database()
    connection = _connect()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS TipoUsuario (
                tipo_usuario_id INT AUTO_INCREMENT PRIMARY KEY,
                descripcion VARCHAR(50) NOT NULL UNIQUE
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS Usuarios (
                usuario_id INT AUTO_INCREMENT PRIMARY KEY,
                nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                tipo_usuario_id INT,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tipo_usuario_id)
                    REFERENCES TipoUsuario(tipo_usuario_id)
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS Juegos (
                juego_id INT AUTO_INCREMENT PRIMARY KEY,
                nombre_juego VARCHAR(100) NOT NULL UNIQUE,
                descripcion TEXT
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS Resultados (
                resultado_id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT,
                juego_id INT,
                puntaje INT NOT NULL,
                fecha_juego TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
                FOREIGN KEY (juego_id) REFERENCES Juegos(juego_id)
            )
            """
        )
        cursor.executemany(
            "INSERT IGNORE INTO TipoUsuario (descripcion) VALUES (%s)",
            [("Padre",), ("Profesional",), ("Niño",)],
        )
        cursor.executemany(
            """
            INSERT IGNORE INTO Juegos (nombre_juego, descripcion)
            VALUES (%s, %s)
            """,
            [
                (
                    "Buscar diferencias",
                    "Juego para encontrar diferencias entre dos imágenes",
                ),
                (
                    "Memoria parejas",
                    "Juego para encontrar parejas iguales en cartas de memoria",
                ),
            ],
        )
        connection.commit()
        cursor.close()
    finally:
        connection.close()


def get_connection() -> MySQLConnection:
    """Devuelve una conexion a la base de datos ya inicializada."""
    return _connect()


if __name__ == "__main__":
    initialize_database()
    print(f"Base de datos '{DATABASE_NAME}' lista.")
