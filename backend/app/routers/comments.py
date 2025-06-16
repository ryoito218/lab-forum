from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app import models, schemas
from app.models import User

router = APIRouter(prefix="/posts/{post_id}/comments", tags=["Comments"])

@router.post("/", response_model=schemas.CommentResponse)
def create_comment(
    post_id: int,
    comment_data: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(models.Post).filter(models.Post.id == post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment = models.Comment(
        content=comment_data.content,
        post_id=post_id,
        user_id=current_user.id
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment