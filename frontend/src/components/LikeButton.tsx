'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Heart, HeartIcon } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
  postId: number;
};

const LikeButton = ({ postId }: Props) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const router = useRouter();

  const fetchLikeStatus = async () => {
    const token = Cookies.get('access_token');
    if (!token) return;

    const likedRes = await fetch(`${API_BASE}/posts/${postId}/liked`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (likedRes.ok) {
      const likedData = await likedRes.json();
      setLiked(likedData.liked);
    }

    const countRes = await fetch(`${API_BASE}/posts/${postId}/likes/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (countRes.ok) {
      const countdata = await countRes.json();
      setLikesCount(countdata.like_count);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [postId]);

  const handleToggleLike = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      alert('ログインが必要です');
      router.push('/login');
      return;
    }

    const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      await fetchLikeStatus();
    } else {
      alert('いいね操作に失敗しました');
    }
  };

  return (
    <button 
      onClick={handleToggleLike} 
      className='flex items-center gap-1 cursor-pointer select-none'
    >
      {liked ? (
        <HeartIcon className='w-6 h-6 text-pink-500 fill-pink-500' />
      ) : (
        <Heart className='w-6 h-6 text-gray-400' />
      )}
      <span className='text-sm text-gray-600'>{likesCount}</span>
    </button>
  )
}

export default LikeButton
