"""Modelos de usuarios."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UsuarioCreate(BaseModel):
    """Datos necesarios para registrar un usuario."""

    nombre_usuario: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=1, max_length=255)
    tipo_usuario_id: int = Field(default=3, ge=1)


class UsuarioResponse(BaseModel):
    """Usuario devuelto por la API sin exponer la contrasena."""

    model_config = ConfigDict(from_attributes=True)

    usuario_id: int
    nombre_usuario: str
    tipo_usuario_id: int | None
    fecha_registro: datetime
