import sys
from typing import Iterable
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import SessionLocal
from app import models
from app.utils.chunking import split_to_chunks
from app.utils.embeddings import embed_texts

def _iter_target_posts(db: Session, mode: str) -> Iterable[models.Post]:
    if mode == "all":
        return db.query(models.Post).all()
    elif mode == "changed":
        subq = (
            db.query(models.RAGChunk.post_id, func.max(models.RAGChunk.created_at).label("last_ingested"))
            .group_by(models.RAGChunk.post_id)
            .subquery()
        )

        return (
            db.query(models.Post)
            .outerjoin(subq, subq.c.post_id == models.Post.id)
            .filter((subq.c.last_ingested.is_(None)) | (models.Post.updated_at > subq.c.last_ingested))
            .all()
        )
    else:
        raise ValueError("mode must be 'all' or 'changed'")

def ingest_posts(mode: str = "changed"):
    db: Session = SessionLocal()
    try:
        targets = _iter_target_posts(db, mode)
        count = 0
        for post in targets:
            db.query(models.RAGChunk).filter(models.RAGChunk.post_id == post.id).delete()
            
            chunks = split_to_chunks(post.content or "", 500, 50)
            if not chunks:
                continue

            vecs = embed_texts(chunks)
            for idx, (c, v) in enumerate(zip(chunks, vecs)):
                db.add(models.RAGChunk(
                    post_id=post.id,
                    chunk_index=idx,
                    content=c,
                    embedding=v,
                ))
            count += 1
        db.commit()
        print(f"Ingestion done. mode={mode}, posts_ingested={count}")
    finally:
        db.close()

if __name__ == "__main__":
    mode = "changed"
    if len(sys.argv) >= 3 and sys.argv[1] == "--mode":
        mode = sys.argv[2]
    ingest_posts(mode)