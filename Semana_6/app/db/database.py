import os
from sqlmodel import Field, Session, create_engine, select, SQLModel

#Definir Conexion a Base de Datos
url_connection = "sqlite:///./db/restaurant.db"

# Configuración optimizada para SQLite con mejor manejo de concurrencia
engine = create_engine(
    url_connection,
    connect_args={
        "check_same_thread": False,
        "timeout": 30  # Aumentar timeout a 30 segundos para evitar bloqueos
    },
    pool_pre_ping=True,  # Verificar conexión antes de usarla
    pool_recycle=3600,  # Reciclar conexiones cada hora
    echo=False  # Cambiar a True para debug
)

def get_Session():
    with Session(engine) as session:
        yield session