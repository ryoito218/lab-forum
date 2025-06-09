from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.schemas import TagResponse
from typing import List

router = APIRouter(prefix="/tags", tags=["Tags"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[TagResponse])
def read_tags(db: Session = Depends(get_db)):
    return db.query(models.Tag).all()