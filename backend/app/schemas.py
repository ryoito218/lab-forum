from pydantic import BaseModel
from typing import List, Optional

class PostCreate(BaseModel):
    title: str
    content: str
    category_id: int
    tag_ids: Optional[List[int]] = []