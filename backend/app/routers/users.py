from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from passlib.context import CryptContext
from app.schemas import UserCreate, UserResponse
from app.dependencies import get_current_user
from app import models


router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(get_current_user)])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role="normal"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user