import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PostsList, {Post} from '@/components/PostsList';
import { apiFetch } from '@/lib/api';

type Props = {
  params: Promise<{ tagName: string }>;
}

const TagPostsPage = async ( {params}: Props) => {
  const { tagName } = await params;

  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;
  
  if (!token) {
    redirect("/login");
  }
  
  const res = await apiFetch(`/tags/${tagName}/posts`, {
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
    <div className='max-w-3xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>タグ: # {decodeURIComponent(tagName)}</h2>        
      </div>
      <PostsList posts={posts} />
    </div>
  );
}

export default TagPostsPage;