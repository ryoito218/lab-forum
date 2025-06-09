from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class PostCreate(BaseModel):
    title: str
    content: str
    category_id: int
    tag_ids: Optional[List[int]] = []

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    category_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None

class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class CategoryCreate(BaseModel):
    name: str

class CategoryCreate(BaseModel):
    name: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True