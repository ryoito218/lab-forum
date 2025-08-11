from typing import List
from sqlalchemy.orm import Session
from app import models

def retrieve_chunks(db: Session, query_vec: list[float], k: int=3) -> List[models.RAGChunk]:
    return (
        db.query(models.RAGChunk)
        .order_by(models.RAGChunk.embedding.cosine_distance(query_vec))
        .limit(k)
        .all()
    )