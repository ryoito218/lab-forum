from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from app.routers import posts, categories, users, tags, auth, comments, likes, search, admin
from app.config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI(debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(tags.router)
app.include_router(auth.router)
app.include_router(comments.router)
app.include_router(likes.router)
app.include_router(search.router)
app.include_router(admin.router)