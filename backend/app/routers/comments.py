from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app import models, schemas
from app.models import User
from typing import List

router = APIRouter(prefix="/posts/{post_id}/comments", tags=["Comments"])

@router.post("", response_model=schemas.CommentResponse)
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
    return schemas.CommentResponse(
        id=comment.id,
        content=comment.content,
        post_id=comment.post_id,
        user_id=comment.user_id,
        username=current_user.name,
        created_at=comment.created_at, 
    )

@router.get("", response_model=List[schemas.CommentResponse])
def list_comments(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).all()
    return [
        schemas.CommentResponse(
            id=comment.id,
            content=comment.content,
            post_id=comment.post_id,
            user_id=comment.user_id,
            username=comment.user.name,
            created_at=comment.created_at,
        )
        for comment in comments
    ]

# なぜcomments/{comment_id}?
@router.delete("/{comment_id}", status_code=204)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    db.delete(comment)
    db.commit()
    return