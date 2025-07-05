'use client';

import React from 'react';
import Link from 'next/link';

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const PostsList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const dtf = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tokyo',
  });

  return (
    <ul className='space-y-4'>
      {posts.map(post => {
        const created = dtf.format(new Date(post.created_at));
        const updated = dtf.format(new Date(post.updated_at));
        return (
          <li key={post.id} className='p-4 bg-white shadow rounded'>
            <h3 className='text-lg font-bold'><Link href={`/posts/${post.id}`}>{post.title}</Link></h3>
            <p className='text-sm text-gray-400 mt-2'>投稿日: {created}</p>
            <p className='text-sm text-gray-400 mt-2'>更新日: {updated}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default PostsList;