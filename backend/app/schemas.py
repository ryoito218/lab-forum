from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class TagResponse(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }

class PostCreate(BaseModel):
    title: str
    content: str
    category_id: int
    tags: List[str] = []

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    category_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    tags: List[TagResponse] = []
    like_count: int = 0
    liked_by_me: bool = False

    model_config = {
        "from_attributes": True
    }

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[List[str]] = None

class CategoryResponse(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }

class CategoryCreate(BaseModel):
    name: str

class CategoryUpdate(BaseModel):
    name: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "normal"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    user_id: int
    post_id: int

    model_config = {
        "from_attributes": True
    }

class SearchResponse(BaseModel):
    items: List[PostResponse]
    total: int

    model_config = {
        "from_attributes": True
    }

class AskRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(3, ge=1, le=10)

class Source(BaseModel):
    post_id: int
    chunk_index: int
    snippet: str

class AskResponse(BaseModel):
    answer: str
    sources: List[Source]