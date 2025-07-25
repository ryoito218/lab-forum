import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditPostForm from './EditPostForm';
import { apiFetch } from '@/lib/api';

type Tag = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  category_id: number;
  tags: Tag[];
};

type User = {
  id: number;
  email: string;
  role: string;
};

const getPost = async (id: string): Promise<Post> => {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) redirect('/login');

  const res = await apiFetch(`/posts/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
    cache: `no-store`,
  });

  if (!res.ok) redirect('/posts');
  return res.json();
};

const getCategories = async (): Promise<Category[]> => {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) redirect('/login');

  const res = await apiFetch('/categories', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (res.status == 401) {
    redirect('/login');
  }

  if (!res.ok) redirect('/posts');
  return res.json();
};

const getCurrentUser = async (): Promise<User | null> => {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) return null;

  const res = await apiFetch('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
};

const EditPostPage = async (props: { params: Promise<{id: string}> } ) => {
  const { id } = await props.params;
  const post = await getPost(id);
  const categories = await getCategories();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.id !== post.user_id) {
    redirect('/posts');
  }

  return <EditPostForm post={post} categories={categories} />;
};

export default EditPostPage;