from fastapi import APIRouter
from controllers import usuarios, juegos, resultados

router = APIRouter()
router.include_router(usuarios.router)
router.include_router(juegos.router)
router.include_router(resultados.router)