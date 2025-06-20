from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app import models, schemas
from app.dependencies import get_db, get_current_user
from sqlalchemy import or_
from typing import List
from app.models import User

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

@router.get("/posts", response_model=List[schemas.PostResponse])
def search_posts(
    keyword: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(models.Post).filter(
        or_(
            models.Post.title.ilike(f"%{keyword}%"),
            models.Post.content.ilike(f"%{keyword}%")
        )
    ).all()
    return results