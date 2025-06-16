from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.schemas import TagResponse, PostResponse
from app.dependencies import get_current_user
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
def get_posts_by_tag(tag_name: str, db: Session = Depends(get_db)):
    tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag.posts