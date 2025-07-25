import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PostsList from '@/components/PostsList';
import { apiFetch } from '@/lib/api';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  liked_by_me: boolean;
  tags: { id: number, name: string }[];
};

const getPosts = async (): Promise<Post[]> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await apiFetch("/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status == 401) {
    redirect('/login');
  }

  if (!res.ok) throw new Error("投稿の取得に失敗しました");
  return res.json();
};

const PostListPage = async () => {
  const posts = await getPosts();

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>投稿一覧</h2>
        <Link href='/posts/new'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'>
            ＋新規投稿
          </button>
        </Link>
      </div>
      
      <PostsList posts={posts} />
      
    </div>
  );
};

export default PostListPage;
