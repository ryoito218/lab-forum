'use client';

import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import DeletePostButton from './DeletePostButton';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
  postId: number;
  postUserId: number;
};

const PostActions: React.FC<Props> = ({ postId, postUserId }) => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = Cookies.get('access_token');
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const user = await res.json();
        setCurrentUserId(user.id);
      }
    };

    fetchCurrentUser();
  }, []);

  if (currentUserId !== postUserId) return null;

  return (
    <div className='flex space-x-4 mt-6'>
      <button
        onClick={() => router.replace(`/posts/${postId}/edit`)}
        className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer inline-block'
      >
        編集する
      </button>
      <DeletePostButton postId={postId} />
    </div>
  )
}

export default PostActions;