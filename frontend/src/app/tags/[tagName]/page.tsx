import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PostsList, {Post} from '@/components/PostsList';

interface TagPostsPageProps {
  params: {
    tagName: string;
  };
}

const TagPostsPage = async ({ params: {tagName} }: TagPostsPageProps) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;
  
  if (!token) {
    redirect("/login");
  }
  
  const res = await fetch(`http://backend:8000/tags/${encodeURIComponent(tagName)}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  
  if (res.status == 401) {
    redirect('/login');
  }
  
  if (!res.ok) throw new Error("投稿の取得に失敗しました");
  
  const posts: Post[] = await res.json();

  return (
    <div className='max-w-3l mx-auto p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>タグ: # {tagName}</h2>
        <PostsList posts={posts} />
      </div>
    </div>
  );
}

export default TagPostsPage;