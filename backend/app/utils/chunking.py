def split_to_chunks(text: str, max_length: int = 500, overlap: int = 50):
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + max_length
        chunk = text[start:end]
        chunks.append(chunk)

        start += max_length - overlap
    
    return chunks