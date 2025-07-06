import React from 'react'
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LikeButton from '@/components/LikeButton';
import BackButton from '@/components/BackButton';
import PostActions from './PostActions';
import CommentsSection from './CommentsSection';
import PostContent from '@/components/PostContent';

type Props = {
  params: {
    id: string;
  };
};

type Post = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
};

const PostDetailPage = async ({ params }: Props ) => {
  const { id } = await params;
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) redirect("/login");

  const res = await fetch(`http://backend:8000/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status == 401) {
    redirect('/login');
  };

  if (!res.ok) {
    return (
      <div className='p-4 text-red-600'>
        投稿の取得に失敗しました。存在しないか、権限がありません。
      </div>
    );
  }

  const post: Post = await res.json();

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>{post.title}</h1>
      <LikeButton postId={post.id} />
      <p className='text-sm text-gray-500'>
        投稿日: {new Date(post.created_at).toLocaleString()}
      </p>
      <PostContent content={post.content} />

      <PostActions postId={post.id} postUserId={post.user_id} />
      
      <div className='mt-4'>
        <BackButton />
      </div>

      <div className='mt-4'>
        <CommentsSection />
      </div>
    </div>
  );
};

export default PostDetailPage;