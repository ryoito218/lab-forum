from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.auth import decode_access_token
from app.database import SessionLocal
from app import models
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).get(int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user