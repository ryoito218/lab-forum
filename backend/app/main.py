from fastapi import FastAPI
from .database import engine
from . import models
from app.routers import posts

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(posts.router)