"use client";

import React, {useState} from 'react';
import { apiFetch } from '@/lib/api';
import Cookies from 'js-cookie';

type Source = {
  post_id: number;
  chunk_index: number;
  snippet: string;
};

type RagRes = {
  answer: string;
  sources: Source[]
};

const RagPage = () => {

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<RagRes | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const ask = async () => {
    setLoading(true);
    setErr(null);
    setRes(null);

    const token = Cookies.get('access_token');
    if (!token) return setErr('ログインが必要です');

    try {
      const r = await apiFetch("/rag/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: q, top_k: 3 }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.detail || `HTTP ${r.status}`);
      setRes(data);
    } catch (e: any) {
      setErr(e?.message || "通信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-2xl p-6 space-y-4 '>
      <h1 className='text-2xl font-bold'>RAG 検索</h1>
      <div className='flex gap-2'>
        <input
          className='flex-1 border rounded-xl px-3 py-2 bg-white'
          placeholder='質問を入力...'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className='border rounded-xl px-4 py-2 bg-white cursor-pointer'
          onClick={ask}
          disabled={loading || !q.trim()}
        >
          {loading ? "検索中" : "検索"}
        </button>
      </div>

      {err && <p className='text-red-600'>{err}</p>}

      {res && (
        <section className='space-y-3'>
          <h2 className='text-xl font-semibold'>回答</h2>
          <p className='whitespace-pre-wrap border bg-white rounded-xl p-3'>{res.answer}</p>

          <h3 className='text-lg font-semibold'>参照スニペット</h3>
          <ul className='list-disc pl-6 space-y-1'>
            {res.sources.map((s, i) => (
              <li key={i}>
                <span className='font-mono'>post:{s.post_id}#{s.chunk_index}</span>{" "}
                — {s.snippet}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default RagPage;
