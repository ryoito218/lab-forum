'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

type SearchResponse = {
  items: Post[];
  total: number;
};

const pageSize = 5;

const SORT_OPTIONS = [
  { value: 'created_desc', label: '新しい順' },
  { value: 'created_asc',  label: '古い順' },
  { value: 'popularity',   label: '人気順' },
];

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'created_desc');
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const totalPages = Math.ceil(total / pageSize);
  const hasNext = page < totalPages;
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        keyword,
        page: String(page),
        page_size: String(pageSize),
        sort,
      });
      const token = Cookies.get('access_token');
      const res = await fetch(`http://localhost:8000/search/posts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: SearchResponse = await res.json();
      setPosts(prev =>
        page === 1
          ? data.items
          : [
              ...prev,
              ...data.items.filter(item => !prev.some(p => p.id === item.id)),
            ]
      );
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, sort]);

  useEffect(() => {
    if (!keyword) return;
    setPage(1);
    setPosts([]);
    setTotal(0);
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          keyword,
          page: '1',
          page_size: String(pageSize),
          sort,
        });
        const token = Cookies.get('access_token');
        const res = await fetch(`http://localhost:8000/search/posts?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: SearchResponse = await res.json();
        setPosts(data.items);
        setTotal(data.total);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [keyword, sort]);

  useEffect(() => {
    if (page <= 1 || !keyword) return;
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNext) return;
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNext]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  if (!keyword) {
    return <div className="p-4 text-red-600">キーワードを入力してください</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">検索結果: "{keyword}"</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">並べ替え:</label>
        <select value={sort} onChange={handleSortChange} className="border p-1">
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="p-4 bg-white rounded shadow">
            <Link href={`/posts/${post.id}`} className="block">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-600 text-sm">
                {post.content.slice(0, 100)}...
              </p>
            </Link>
            <p className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {loading && <p className="text-center mt-4">Loading...</p>}

      <div ref={sentinelRef} className="h-1" />

      {!hasNext && !loading && posts.length > 0 && (
        <p className="text-center mt-4 text-gray-500">
          これ以上結果はありません
        </p>
      )}
    </div>
  );
};

export default SearchPage;