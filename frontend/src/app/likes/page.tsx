import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PostsList, { Post } from '@/components/PostsList';

const LikesPage = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get('access_token')?.value;

  if (!token) {
    return redirect('/login');
  };

  const res = await fetch('http://backend:8000/posts/liked', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (res.status === 401){
    redirect('/login');
  };

  if (!res.ok) {
    throw new Error('Failed to fetch liked posts');
  }

  const likedPosts: Post[] = await res.json();

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h2 className='text-2xl font-semibold mb-4'>いいねした投稿</h2>
      <PostsList posts={likedPosts} />
    </div>
  );
}

export default LikesPage;