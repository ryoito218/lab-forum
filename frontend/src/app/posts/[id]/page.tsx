import React from 'react'
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DeletePostButton from './DeletePostButton';
import LikeButton from '@/components/LikeButton';
import CommentsSection from './CommentsSection';

type Props = {
  params: {
    id: string;
  };
};

type Post = {
  id: number;
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
  }

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
      <p className='mb-4'>{post.content}</p>
      <p className='text-sm text-gray-500'>
        投稿日: {new Date(post.created_at).toLocaleString()}
      </p>

      <div className='flex gap-4 mt-6'>
        <Link href={`/posts/${post.id}/edit`}>
          <button className='bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer'>
            編集する
          </button>
        </Link>

        <DeletePostButton postId={post.id} />
      </div>
      
      <div className='mt-4'>
        <Link href='/posts'>
          <button className='bg-gray-300 text-gray-800 px-4 py-2 rounded cursor-pointer'>
            ← 投稿一覧に戻る
          </button>
        </Link>
      </div>

      <div className='mt-4'>
        <CommentsSection />
      </div>
    </div>
  );
};

export default PostDetailPage;