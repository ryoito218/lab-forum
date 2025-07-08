from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import SessionLocal
from app.schemas import PostCreate, PostResponse, PostUpdate
from app.dependencies import get_current_user
from app.models import User, Like
from typing import List

router = APIRouter(prefix="/posts", tags=["Posts"], dependencies=[Depends(get_current_user)])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[PostResponse])
def read_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    posts = (
        db.query(models.Post)
        .order_by(models.Post.updated_at.desc())
        .limit(20)
        .all()
    )
    result = []
    for post in posts:
        like_count = db.query(Like).filter(Like.post_id == post.id).count()
        liked_by_me = (
            db.query(Like).filter(Like.post_id == post.id, Like.user_id == current_user.id).first() is not None
        )
        post_data = PostResponse.from_orm(post)
        post_data.like_count = like_count
        post_data.liked_by_me = liked_by_me
        result.append(post_data)
    return result

@router.post("/", response_model=PostResponse)
def create_post(post_data: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tags = []

    for tag_name in set(post_data.tags):
        tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
        if not tag:
            tag = models.Tag(name=tag_name)
            db.add(tag)
            db.flush()
        tags.append(tag)

    db_post = models.Post(
        title=post_data.title,
        content=post_data.content,
        category_id=post_data.category_id,
        user_id=current_user.id,
        tags=tags
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/me", response_model=List[PostResponse])
def read_my_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    posts = (
            db.query(models.Post)
            .filter(models.Post.user_id == current_user.id)
            .order_by(models.Post.created_at.desc())
            .all()
        )
    
    result = []

    for post in posts:
        like_count = db.query(Like).filter(Like.post_id == post.id).count()
        liked_by_me = (
            db.query(Like)
            .filter(Like.post_id == post.id, Like.user_id == current_user.id)
            .first() is not None
        )

        post_data = PostResponse.from_orm(post)
        post_data.like_count = like_count
        post_data.liked_by_me = liked_by_me

        result.append(post_data)

    return result

@router.get("/{post_id}", response_model=PostResponse)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, update_data: PostUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(models.Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.user_id != current_user.id and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    
    update_fields = update_data.dict(exclude_unset=True)

    if "tags" in update_fields and update_data.tags is not None:
        tags = []
        for tag_name in set(update_data.tags):
            tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
            if not tag:
                tag = models.Tag(name=tag_name)
                db.add(tag)
                db.flush()
            tags.append(tag)
        post.tags = tags
        del update_fields["tags"]

    for key, value in update_fields.items():
        setattr(post, key, value)
    
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(models.Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    db.delete(post)
    db.commit()
    return {"detail": f"Post {post_id} deleted"}
