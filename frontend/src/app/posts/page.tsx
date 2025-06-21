import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

  if (!res.ok) throw new Error("投稿の取得に失敗しました");
  return res.json();
};

const PostListPage = async () => {
  const posts = await getPosts();

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-4'>投稿一覧</h2>
      <ul className='space-y-4'>
        {posts.map((post) => (
          <li key={post.id} className='p-4 bg-white rounded shadow'>
            <h3 className='text-lg font-bold'>{post.title}</h3>
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
