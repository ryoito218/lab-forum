from fastapi import FastAPI
from .database import engine
from . import models
from app.routers import posts, categories, users, tags, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(posts.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(tags.router)
app.include_router(auth.router)