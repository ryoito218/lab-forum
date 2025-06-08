from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.schemas import CategoryResponse, CategoryCreate
from typing import List

router = APIRouter(prefix="/categories", tags=["Categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[CategoryResponse])
def read_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, updated: CategoryCreate, db: Session = Depends(get_db)):
    category = db.query(models.Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category.name = updated.name
    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {"detail": f"Category {category_id} deleted"}