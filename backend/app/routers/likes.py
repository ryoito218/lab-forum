from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.dependencies import get_db, get_current_user
from app.models import User

router = APIRouter(
    prefix="/posts",
    tags=["Likes"]
)

@router.post("/{post_id}/like")
def toggle_like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_like = db.query(models.Like).filter_by(post_id=post_id, user_id=current_user.id).first()

    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"message": "Unliked"}
    else:
        like = models.Like(post_id=post_id, user_id=current_user.id)
        db.add(like)
        db.commit()
        return {"message": "Liked"}

@router.get("/{post_id}/likes/count")
def get_like_count(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    like_count = db.query(models.Like).filter(models.Like.post_id == post_id).count()
    return {"post_id": post_id, "like_count": like_count}