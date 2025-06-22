'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

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

    const likedRes = await fetch(`http://localhost:8000/posts/${postId}/liked`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (likedRes.ok) {
      const likedData = await likedRes.json();
      setLiked(likedData.liked);
    }

    const countRes = await fetch(`http://localhost:8000/posts/${postId}/likes/count`, {
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

    const res = await fetch(`http://localhost:8000/posts/${postId}/like`, {
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
    <button onClick={handleToggleLike} className={`px-4 py-2 rounded cursor-pointer ${liked ? 'bg-pink-500 text-white': 'bg-gray-200 text-gray-800'}`}>
      {likesCount}
    </button>
  )
}

export default LikeButton
