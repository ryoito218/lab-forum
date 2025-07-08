'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, HeartIcon } from 'lucide-react';

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  liked_by_me: boolean;
  tags: { id: number, name: string }[];
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
            <div className='mt-2 flex items-center space-x-2'>
              {post.liked_by_me ? (
                <HeartIcon className='w-6 h-6 text-pink-500 fill-pink-500' />
              ): (
                <Heart className='w-6 h-6 text-gray-400' />
              )}
              <span className='text-sm text-gray-600'>{post.like_count}</span>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {post.tags.map(tag => (
                <span
                  key={tag.id}
                  className='px-2 py-1 bg-gray-100 rounded text-sm text-gray-600'
                >
                  #{tag.name}
                </span>
              ))}
            </div>
            <p className='text-sm text-gray-400 mt-2'>投稿日: {created}</p>
            <p className='text-sm text-gray-400 mt-2'>更新日: {updated}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default PostsList;