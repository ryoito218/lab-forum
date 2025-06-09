from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import SessionLocal
from app.schemas import PostCreate, PostResponse, PostUpdate
from typing import List

router = APIRouter(prefix="/posts", tags=["Posts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[PostResponse])
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

@router.get("/{post_id}", response_model=PostResponse)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, update_data: PostUpdate, db: Session = Depends(get_db)):
    post = db.query(models.Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_fields = update_data.dict(exclude_unset=True)
    for key, value in update_fields.items():
        setattr(post, key, value)
    
    db.commit()
    db.refresh(post)
    return post