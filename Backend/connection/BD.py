"""Conexion a la base de datos MySQL de Q-NIMI."""

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


def get_connection() -> MySQLConnection:
    """Abre una conexion MySQL usando variables de entorno."""
    config = {**_CONNECTION_CONFIG}
    config["database"] = DATABASE_NAME
    return mysql.connector.connect(**config)
