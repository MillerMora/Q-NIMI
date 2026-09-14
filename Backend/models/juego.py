"""Modelos de juegos."""

from pydantic import BaseModel, ConfigDict


class JuegoResponse(BaseModel):
    """Juego disponible para el usuario."""

    model_config = ConfigDict(from_attributes=True)

    juego_id: int
    nombre_juego: str
    descripcion: str | None = None
