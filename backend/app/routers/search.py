from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.dependencies import get_db, get_current_user
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from typing import List
from app.models import User

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

@router.get("/posts", response_model=List[schemas.PostResponse])
def search_posts(
    keyword: str = Query(..., min_length=1),
    page: int = Query(1, ge=1, description="1 以上"),
    page_size: int = Query(20, ge=1, le=100),
    sort: str = Query(
        "created_desc",
        description="created_asc / created_desc / title_asc / title_desc",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    posts = db.query(models.Post).options(joinedload(models.Post.tags)).filter(
        or_(
            models.Post.title.ilike(f"%{keyword}%"),
            models.Post.content.ilike(f"%{keyword}%"),
            models.Post.tags.any(models.Tag.name.ilike(f"%{keyword}%"))
        )
    ).all()
    return posts