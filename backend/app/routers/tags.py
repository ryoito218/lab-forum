from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import SessionLocal
from app import models
from app.schemas import TagResponse, PostResponse
from app.dependencies import get_current_user
from app.routers.posts import make_post_response
from typing import List

router = APIRouter(prefix="/tags", tags=["Tags"], dependencies=[Depends(get_current_user)])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[TagResponse])
def read_tags(db: Session = Depends(get_db)):
    return db.query(models.Tag).all()

@router.get("/{tag_name}/posts", response_model=List[PostResponse])
def get_posts_by_tag(tag_name: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    posts = (
        db.query(models.Post)
        .join(models.Post.tags)
        .filter(models.Tag.name == tag_name)
        .options(joinedload(models.Post.tags))
        .all()
    )

    if not posts:
        raise HTTPException(status_code=404, detail="Tag not found or no posts")
    
    return [make_post_response(post, current_user, db) for post in posts]