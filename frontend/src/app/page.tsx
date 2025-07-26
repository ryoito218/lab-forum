import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PostsList from '@/components/PostsList';
import Link from 'next/link';
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
}

const getPosts = async (): Promise<Post[]> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    return redirect("/login");
  }

  const res = await apiFetch("/posts/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status == 401) {
    return redirect('/login');
  };

  if (!res.ok) throw new Error("取得に失敗しました");
  return res.json();
};

const HomePage = async () => {
  const posts = await getPosts();

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>自分の投稿一覧</h2>
        <Link
          href={'/likes'}
          className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'
        >
          いいねした投稿を見る
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className='text-gray-500'>まだ投稿がありません</p>
      ): (
        <PostsList posts={posts}/>
      )}
    </div>
  );
};

export default HomePage;