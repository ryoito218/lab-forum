import React from 'react'
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LikeButton from '@/components/LikeButton';
import BackButton from '@/components/BackButton';
import PostActions from './PostActions';
import CommentsSection from './CommentsSection';
import PostContent from '@/components/PostContent';
import { apiFetch } from '@/lib/api';

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
  updated_at: string;
  tags: { id: number, name: string }[];
};

const PostDetailPage = async ({ params }: Props ) => {
  const dtf = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tokyo',
  });

  const { id } = await params;
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) redirect("/login");

  const res = await apiFetch(`/posts/${id}`, {
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
    <div className='max-w-3xl mx-auto mt-6 px-4 bg-white rounded shadow p-6'>
      <h1 className='text-2xl font-bold mb-4'>{post.title}</h1>
      <LikeButton postId={post.id} />
      
      <div className='flex flex-wrap gap-2 mt-2'>
        {post.tags.map(tag => (
          <Link
            key={tag.id}
            href={`/tags/${tag.name}`}
            className='px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 cursor-pointer'
          >
            {tag.name}
          </Link>
        ))}
      </div>
      
      <p className='text-sm text-gray-400 mt-2'>投稿日: {dtf.format(new Date(post.created_at))}</p>
      <p className='text-sm text-gray-400 mt-2'>更新日: {dtf.format(new Date(post.updated_at))}</p>


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