from typing import List

def split_to_chunks(text: str, max_length: int = 500, overlap: int = 50) -> List[str]:

    assert max_length > 0, "max_length must be > 0"
    assert 0 <= overlap < max_length, "0 <= overlap < max_length must hold"

    chunks: List[str] = []
    n = len(text)
    start = 0
    while start < n:
        end = min(n, start + max_length)
        chunks.append(text[start:end])
        if end == n:
            break
        start = end - overlap
    return chunks