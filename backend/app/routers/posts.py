from fastapi import APIRouter

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get("/")
def read_posts():
    return {"message": "List of posts"}