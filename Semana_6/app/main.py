from fastapi import FastAPI
from routers import users, products, auth_user
from core.config import settings
from fastapi.staticfiles import StaticFiles
from db.models.category import Category
from db.models.dishes import Dishes


#---- Inicializacion de la app
app = FastAPI()

#---- Routers
app.include_router(users.router)
app.include_router(auth_user.router)
app.include_router(products.router)

#app.mount("/static", StaticFiles(directory="static"), name="static")
