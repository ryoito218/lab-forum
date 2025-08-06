from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_admin
from app.models import RAGChunk, Post
from app.utils.embedding import embed_text
from app.utils.chunking import split_to_chunks

router = APIRouter(prefix="/admin/rag", tags=["Admin RAG"], dependencies=[Depends(get_current_admin)],)

@router.post("/update_unvectorized")
def update_unvectorized_posts(
    db: Session = Depends(get_db),
):
    vectorized_ids = [pid for (pid,) in db.query(RAGChunk.post_id).distinct().all()]

    unvec_posts = db.query(Post).filter(~Post.id.in_(vectorized_ids)).all()

    if not unvec_posts:
        return {"message": "No unvectorized posts found."}
    
    total = 0
    for post in unvec_posts:
        chunks = split_to_chunks(post.content)
        for idx, chunk in enumerate(chunks):
            emb = embed_text(chunk)
            db.add(
                RAGChunk(
                    post_id=post.id,
                    chunk_index=idx,
                    content=chunk,
                    embedding=emb,
                )
            )
        total += len(chunks)
    
    db.commit()
    return {
        "message": f"Updated embeddings for {len(unvec_posts)} posts",
        "total_chunks": total,
    }

@router.post("/update/{post_id}")
def update_single_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.query(RAGChunk).filter(RAGChunk.post_id == post_id).delete()

    chunks = split_to_chunks(post.content)

    for idx, chunk in enumerate(post.content):
        emb = embed_text(chunk)
        db.add(
            RAGChunk(
                post_id=post_id,
                chunk_index=idx,
                content=chunk,
                embedding=emb,
            )
        )
    db.commit()
    return {"message": f"Post {post_id} embeddings updated", "chunks": len(chunks)}