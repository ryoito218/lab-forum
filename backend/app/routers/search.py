from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, asc, desc, func
from typing import List
from app import models, schemas
from app.dependencies import get_db, get_current_user
from app.models import User

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("/posts", response_model=schemas.SearchResponse)
def search_posts(
    keyword: str = Query(..., min_length=1, description="Search keyword"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(5, ge=1, le=100, description="Items per page"),
    sort: str = Query(
        "created_desc",
        regex="^(created_asc|created_desc|popularity)$",
        description="Sort: created_desc / created_asc / popularity",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    base_q = (
        db.query(models.Post)
        .options(joinedload(models.Post.tags))
        .filter(
            or_(
                models.Post.title.ilike(f"%{keyword}%"),
                models.Post.content.ilike(f"%{keyword}%"),
                models.Post.tags.any(models.Tag.name.ilike(f"%{keyword}%")),
            )
        )
    )

    total = base_q.count()

    if sort == "created_asc":
        items_q = base_q.order_by(asc(models.Post.created_at))
    elif sort == "created_desc":
        items_q = base_q.order_by(desc(models.Post.created_at))
    else:
        items_q = (
            base_q
            .outerjoin(models.Like)
            .group_by(models.Post.id)
            .order_by(func.count(models.Like.id).desc())
        )

    items = (
        items_q
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    if not items and total:
        raise HTTPException(status_code=404, detail="Page out of range")

    return {"items": items, "total": total}