'use client';

import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import { useSearchParams, useRouter } from 'next/navigation';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

const pageSize = 10;

const SORT_OPTIONS = [
  { value: 'created_desc', label: '新しい順' },
  { value: 'created_asc', label: '古い順' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'title Z-A' },
]

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const keyword = searchParams.get('keyword') || '';
  const page = Number(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'created_desc';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const hasNext = posts.length === pageSize;

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);

    const fetchPosts = async () => {
      try {
        const query = new URLSearchParams({
          keyword,
          page: String(page),
          page_size: '5',
          sort,
        });
        const token = Cookies.get('access_token');
        const res = await fetch(`http://localhost:8000/search/posts?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [keyword, page, sort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/search/${params}`);
  };

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`/search?${params}`)
  };

  if (!keyword) {
    return <div className='p-4 text-red-600'>キーワードを入力してください</div>
  }

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>検索結果: "{keyword}"</h2>

      <div className='mb-4'>
        <label className='mr-2 font-medium'>並べ替え</label>
        <select value={sort} onChange={handleSortChange} className='border p-1'>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className='space-y-4'>
          {posts.map((post) => (
            <li key={post.id} className='p-4 bg-white rounded shadow'>
              <h3 className='text-lg font-semibold'>{post.title}</h3>
              <p className='text-gray-600 text-sm'>{post.content.slice(0, 100)}...</p>
              <p className='text-xs text-gray-400'>{new Date(post.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      <div className='mt-6 flex justify-between'>
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
        >
          Prev
        </button>
        <button
          disabled={!hasNext}
          onClick={() => handlePageChange(page + 1)}
          className='px-4 py-2 bg-gray-200 rounded'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchPage;