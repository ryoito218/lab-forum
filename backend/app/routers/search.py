from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, asc, desc
from typing import List

from app import models, schemas
from app.dependencies import get_db, get_current_user
from app.models import User

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)

@router.get("/posts", response_model=List[schemas.PostResponse])
def search_posts(
    keyword: str = Query(..., min_length=1, description="検索キーワード"),
    page: int = Query(1, ge=1, description="ページ番号（1 以上）"),
    page_size: int = Query(20, ge=1, le=100, description="1ページ当たり件数 (1-100)"),
    sort: str = Query(
        "created_desc",
        regex="^(created|title)_(asc|desc)$",
        description="並べ替え: created_asc / created_desc / title_asc / title_desc",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    q = (
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

    sort_map = {
        "created_asc": asc(models.Post.created_at),
        "created_desc": desc(models.Post.created_at),
        "title_asc": asc(models.Post.title),
        "title_desc": desc(models.Post.title),
    }
    q = q.order_by(sort_map[sort])

    total = q.count()
    posts = (
        q
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    if not posts and total:
        raise HTTPException(status_code=404, detail="page not found")
    
    return posts