import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const getPosts = async (): Promise<Post[]> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://backend:8000/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status == 401) {
    alert('セッションの有効期限が切れました。再ログインしてください。');
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
      
      <ul className='space-y-4'>
        {posts.map((post) => (
          <li key={post.id} className='p-4 bg-white rounded shadow'>
            <h3 className='text-lg font-bold'><Link href={`/posts/${post.id}`}>{post.title}</Link></h3>
            <p className='text-gray-700'>{post.content}</p>
            <p className='text-sm text-gray-400 mt-2'>
              {new Date(post.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostListPage;
