from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.router import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción restringe esto a tu dominio real
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)