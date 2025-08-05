import os
import openai
from app.config import settings

openai.api_key = settings.OPENAI_API_KEY

def embed_text(text: str):
    res = openai.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )

    return res["data"][0]["embedding"]