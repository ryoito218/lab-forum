from fastapi import APIRouter
from app import schemas
from typing import List

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)

@router.get("/posts", response_model=List[schemas.PostResponse])
def search_posts():
    pass