'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Comment } from '@/types';
import CommentForm from '@/components/CommentForm';

const CommentsSection: React.FC = () => {
  const params = useParams();
  const postId = params?.id as string;
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const token = Cookies.get('access_token');
    const res = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if (!res.ok) return;
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId: number) => {
    const token = Cookies.get('access_token');
    const res = await fetch(`http://localhost:8000/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchComments();
    } else {
      alert('削除に失敗しました');
    }
  };

  return (
    <div className='mt-10'>
      <h3 className='text-lg font-bold mb-2'>コメント</h3>
      <CommentForm postId={postId} onCommentAdded={fetchComments} />
      <ul className='mt-4 space-y-4'>
        {comments.map(comment => (
          <li key={comment.id} className='bg-white p-4 shadow rounded'>
            <p className='text-sm'>{comment.content}</p>
            <p className='text-xs text-gray-500'>
              {new Date(comment.created_at).toLocaleString()}
            </p>
            <button
              onClick={() => handleDelete(comment.id)}
              className='text-red-500 text-sm mt-2 cursor-pointer'
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsSection;