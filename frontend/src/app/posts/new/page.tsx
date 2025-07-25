import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NewPostForm from './NewPostForm';

type Category = {
  id: number;
  name: string;
};

const getCategories = async (): Promise<Category[]> => {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) redirect('/login');

  const res = await fetch('/api/categories', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (res.status === 401) {
    alert('セッションの有効期限が切れました。再ログインしてください。');
    redirect('/login');
  }

  if (!res.ok) {
    redirect('/login');
  }

  return res.json();
};

const NewPostPage = async () => {
  const categories = await getCategories();

  return <NewPostForm categories={categories} />
}

export default NewPostPage;