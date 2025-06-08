from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models
from app.database import SessionLocal

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