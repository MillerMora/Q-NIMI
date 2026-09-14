"""Modelos de resultados."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResultadoCreate(BaseModel):
    """Datos necesarios para guardar un puntaje."""

    usuario_id: int = Field(ge=1)
    juego_id: int = Field(ge=1)
    puntaje: int = Field(ge=0)


class ResultadoResponse(BaseModel):
    """Resultado devuelto por la API."""

    model_config = ConfigDict(from_attributes=True)

    resultado_id: int
    usuario_id: int
    juego_id: int
    puntaje: int
    fecha_juego: datetime
