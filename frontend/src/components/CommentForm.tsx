'use client';

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { apiFetch } from '@/lib/api';

type Props = {
  postId: string;
  onCommentAdded: () => void;
};

const CommentForm: React.FC<Props> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('access_token');
    if (!token) return setError('ログインが必要です');

    const res = await apiFetch(`/posts/${postId}/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      setError('コメントの投稿に失敗しました');
      return;
    }

    setContent('');
    setError('');
    onCommentAdded();
  };
  
  return (
    <form onSubmit={handleSubmit} className='mt-4'>
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        className='w-full border p-2 rounded mb-2' 
        placeholder='コメントを入力．．．' 
        required 
      />
      <button type='submit' className='bg-blue-500 text-white px-4 py-1 rounded cursor-pointer'>
        投稿
      </button>
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </form>
  );
};

export default CommentForm;