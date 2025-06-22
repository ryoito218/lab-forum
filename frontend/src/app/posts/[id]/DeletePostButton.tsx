'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type Props = {
  postId: number;
};

const DeletePostButton = ({ postId }: Props) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('本当にこの投稿を削除しますか？');
    if (!confirmed) return;

    const token = Cookies.get('access_token');
    if (!token) {
      alert('ログインが必要です');
      return;
    }

    const res = await fetch(`http://localhost:8000/posts/${postId}`, {
      method: `DELETE`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      alert('セッションの有効期限がきれました。再ログインしてください。');
      router.push('/login');
      return;
    }

    if (res.ok) {
      router.push('/posts');
    } else {
      alert('削除に失敗しました');
    }
  };

  return (
    <button className='bg-red-500 text-white px-4 py-2 rounded cursor-pointer inline-block' onClick={handleDelete}>
      削除する
    </button>
  );
};

export default DeletePostButton;