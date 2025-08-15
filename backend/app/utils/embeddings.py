from openai import OpenAI
from app.config import settings

EMBED_MODEL = settings.RAG_EMBEDDING_MODEL
EMBED_DIM = settings.RAG_EMBEDDING_DIM

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def embed_texts(text: str):
    res = client.embeddings.create(model=EMBED_MODEL, input=list(text))
    vectors = [d.embedding for d in res.data]

    if vectors and len(vectors[0]) != EMBED_DIM:
        raise ValueError(
            f"Embedding dim mismatch: got {len(vectors[0])}, expected {EMBED_DIM}. "
        )

    return vectors