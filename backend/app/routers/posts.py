from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import SessionLocal
from app.schemas import PostCreate

router = APIRouter(prefix="/posts", tags=["Posts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def read_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()
    return posts

@router.post("/")
def create_post(post_data: PostCreate, db: Session = Depends(get_db)):
    db_post = models.Post(
        title=post_data.title,
        content=post_data.content,
        category_id=post_data.category_id,
        user_id=1
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post