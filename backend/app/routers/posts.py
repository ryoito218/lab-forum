from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app import models
from app.database import SessionLocal
from app.schemas import PostCreate, PostResponse, PostUpdate, TagResponse
from app.dependencies import get_current_user
from app.models import User, Like, Post
from typing import List

router = APIRouter(prefix="/posts", tags=["Posts"], dependencies=[Depends(get_current_user)])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def make_post_response(post: Post, current_user: User, db: Session):
    pr = PostResponse.model_validate(post)
    pr.tags = [ TagResponse.model_validate(t) for t in post.tags ]
    pr.like_count = db.query(Like).filter(Like.post_id == post.id).count()
    pr.liked_by_me = db.query(Like).filter(
        Like.post_id == post.id, Like.user_id == current_user.id
    ).first() is not None
    return pr

@router.get("/", response_model=List[PostResponse])
def read_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    posts = (
        db.query(models.Post)
        .options(joinedload(models.Post.tags))
        .order_by(models.Post.updated_at.desc())
        .limit(20)
        .all()
    )
    return [ make_post_response(post, current_user, db) for post in posts ]

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
            .options(joinedload(models.Post.tags))
            .filter(models.Post.user_id == current_user.id)
            .order_by(models.Post.created_at.desc())
            .all()
        )
    return [ make_post_response(post, current_user, db) for post in posts ] 

@router.get("/liked", response_model=List[PostResponse])
def get_liked_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    liked_posts = (
        db.query(models.Post)
        .options(joinedload(models.Post.tags))
        .join(models.Like, models.Like.post_id == models.Post.id)
        .filter(models.Like.user_id == current_user.id)
        .all()
    )
    return liked_posts

@router.get("/{post_id}", response_model=PostResponse)
def read_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(models.Post).options(joinedload(models.Post.tags)).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return make_post_response(post, current_user, db)

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
