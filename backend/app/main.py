from fastapi import FastAPI
from .database import engine, SessionLocal
from . import models
from app.routers import posts

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.include_router(posts.router)

# @app.get("/")
# def read_root():
#     return {"message": "Hello from FastAPI!"}
