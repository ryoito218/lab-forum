'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import SimpleMarkdownEditor from '@/components/SimpleMarkdownEditor';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Category {
  id: number;
  name: string;
}

interface NewPostFormProps {
  categories: Category[];
}

const NewPostForm: React.FC<NewPostFormProps> = ({ categories }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 1);
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('access_token');
    if (!token) return setError('ログインが必要です');

    const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          category_id: categoryId,
          tags: tagList,
        }),
      });

      if (res.status === 401) {
        alert('セッションの有効期限が切れました。再ログインしてください。');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('投稿に失敗しました');
      }

      router.push('/posts');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6'>
      <h1 className='text-2xl font-bold mb-4'>新規投稿</h1>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label className='block mb-1'>タイトル</label>
          <input
            type='text'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            required
          />
        </div>

        <div>
          <label className='block mb-1'>カテゴリー</label>
          <select
            name='category_id'
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className='w-full px-3 py-2 border rounded'
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block mb-1'>タグ（半角カンマ区切り）</label>
          <input
            type='text'
            name='tags'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className='w-full px-3 py-2 border rounded'
            placeholder='例: AI, Python, Deep Learning'
          />
        </div>

        <div>
          <label className='block mb-1'>本文（Markdown可）</label>
          <SimpleMarkdownEditor 
            markdown={content}
            setMarkdown={setContent}
          />
        </div>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer'
        >
          投稿
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;
