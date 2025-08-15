from typing import List
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM = (
    "以下の『参照コンテキスト』の範囲内で日本語で回答してください．"
    "情報が足りない場合は『該当情報なし』とだけ書いてください．"
    "出力は『結論→根拠』の順，最大8文．前置きや断り書きは不要．"
)

def build_prompt(query: str, snippets: List[str]) -> str:
    ctx = "\n\n".join(f"■スニペット{i+1}:\n{s}" for i, s in enumerate(snippets))
    return f"【ユーザの質問】\n{query}\n\n【参照コンテキスト】\n{ctx}\n\n【回答】"

def generate_answer(query: str, snippets: List[str]) -> str:
    if not snippets:
        return "該当情報なし"
    
    prompt = build_prompt(query, snippets)
    resp = client.responses.create(
        model=getattr(settings, "RAG_ANSWER_MODEL", "gpt-4o-mini"),
        input=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": prompt},
        ],
    )

    return resp.output_text