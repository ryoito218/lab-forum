from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.utils.embeddings import embed_texts
from app.services.rag import retrieve_chunks
from app.utils.llm import generate_answer
from app.schemas import AskRequest, AskResponse, Source

router = APIRouter(prefix="/rag", tags=["RAG"])

@router.post("/answer", response_model=AskResponse)
def answer(req: AskRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    qvec = embed_texts([req.query])[0]

    chunks = retrieve_chunks(db, qvec, k=req.top_k)
    snippets = [c.content for c in chunks]

    ans = generate_answer(req.query, snippets)

    sources = [
        Source(post_id=c.post_id, chunk_index=c.chunk_index, snippet=c.content[:160])
        for c in chunks
    ]
    return AskResponse(answer=ans, sources=sources)