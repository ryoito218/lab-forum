'use client';

import React, {useEffect, useState, FormEvent} from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

type Category = {
  id: number;
  name: string;
}

const EditCategoryPage = () => {
  const router = useRouter();
  const { categoryId } = useParams();
  const [cat, setCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    const token = Cookies.get('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    (async () => {
      const headers = getHeaders();
      const res = await fetch('http://localhost:8000/admin/categories', { headers });

      if (res.status === 401) {
        router.push('/login');
      }

      if (res.status === 403) {
        router.push('/');
      };

      const list: Category[] = await res.json();
      const c = list.find(c => c.id === Number(categoryId));
      if (c) {
        setCat(c);
        setName(c.name);
      }
      setLoading(false);
    })();
  }, [categoryId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const headers = getHeaders();
    await fetch(`http://localhost:8000/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ name }),
    });
    router.push('/admin');
  };

  if (loading) return <p className='p-4'>読み込み中...</p>
  if (!cat) return <p className='p-4 text-red-500'>カテゴリーが見つかりません</p>

  return (
    <div className='p-6 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>カテゴリー編集</h1>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm'>カテゴリー名</label>
          <input 
            className='mt-1 w-full border rounded p-2'
            value={name}
            type="text"
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className='flex gap-2'>
          <button type='submit' className='flex-1 py-2 bg-blue-600 text-white rounded cursor-pointer'>
            保存
          </button>
          <button
            type='button'
            onClick={() => router.push('/admin')}
            className='flex-1 py-2 bg-gray-300 rounded cursor-pointer'
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCategoryPage;
