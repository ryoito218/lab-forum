'use client';

import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import SimpleMarkdownEditor from '@/components/SimpleMarkdownEditor';

interface Tag {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  tags: Tag[];
}

interface Category {
  id: number;
  name: string;
}

interface EditPostFormProps {
  post: Post;
  categories: Category[];
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post, categories }) => {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags.map((tagObj: {id: number; name: string}) => tagObj.name).join(', '));
  const [categoryId, setCategoryId] = useState(post.category_id);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('access_token');
    if (!token) {
      setError('ログインが必要です');
      return;
    }

    const tagNames = tags.split(',').map(t => t.trim()).filter(Boolean);
    const tagList = tagNames.map(name => {
      const matched = categories.find(cat => cat.name === name);
      return matched ? matched.id : name;
    });

    try {
      const res = await fetch(`http://localhost:8000/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags: tagList, category_id: categoryId }),
      });

      if (res.status === 401) {
        alert('セッションの有効期限が切れました。再ログインしてください。');
        router.push('/login');
        return;
      }

      if (!res.ok) return setError('更新に失敗しました');
      router.push('/posts');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6'>
      <h1 className='text-2xl font-bold mb-4'>投稿編集</h1>
      <form className='space-y-4' onSubmit={handleUpdate}>
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
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
        >
          更新
        </button>
      </form>
    </div>
  )
}

export default EditPostForm
