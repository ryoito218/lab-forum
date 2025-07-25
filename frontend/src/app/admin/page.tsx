'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiFetch } from '@/lib/api';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'normal' | 'admin';
}

type Category = {
  id: number;
  name: string;
}

const AdminPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'normal' | 'admin'>('normal');
  const [newCategoryName, setNewCategoryName] = useState('');

  const getHeaders = () => {
    const token = Cookies.get("access_token");
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    (async () => {
      const headers = getHeaders();
      const [uRes, cRes] = await Promise.all([
        apiFetch('/admin/users', { headers, credentials: "include" }),
        apiFetch('/admin/categories', { headers, credentials: "include" }),
      ]);

      if (uRes.status === 401 || cRes.status === 401) {
        router.push('/login');
      }

      if (uRes.status === 403 || cRes.status === 403) {
        router.push('/');
      };

      if (uRes.ok) setUsers(await uRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    })();
  }, [router]);

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    const headers = getHeaders();
    const res = await apiFetch('/admin/users', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      }),
    });

    if (res.ok) {
      const created: User = await res.json();
      setUsers(prev => [...prev, created]);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('normal');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    const headers = getHeaders();
    const res = await apiFetch(`/admin/users/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !==id));
    };
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    const headers = getHeaders();
    const res = await apiFetch('/admin/categories', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: newCategoryName }),
    });
    if (res.ok) {
      const created: Category = await res.json();
      setCategories(prev => [...prev, created]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    const headers = getHeaders();
    const res = await apiFetch(`/admin/categories/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== id));
    };
  };

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6 space-y-8'>
      <h1 className='text-3xl font-bold'>管理者ページ</h1>

      <section>
        <h2 className='text-2xl mb-4'>ユーザ管理</h2>
        <form onSubmit={handleCreateUser} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              className='w-full border px-3 py-2 rounded'
              placeholder='名前'
              type='text'
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
            />
            <input
              className='w-full border px-3 py-2 rounded'
              placeholder='email'
              type='email'
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
            />
            <input 
              className='w-full border px-3 py-2 rounded'
              placeholder='password'
              type="password"
              value={newUserPassword}
              onChange={e => setNewUserPassword(e.target.value)}
            />
            <select 
              className='w-full border px-3 py-2 rounded'
              value={newUserRole}
              onChange={e => setNewUserRole(e.target.value as 'normal' | 'admin')}
            >
              <option value="normal">normal</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className='text-center mt-2 mb-6'>
            <button type='submit' className='w-32 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'>
              追加
            </button>
          </div>
        </form>
        
        <ul className='border rounded p-4 space-y-2 w-full'>
          {users.map(u => (
            <li key={u.id} className='flex justify-between items-center'>
              <span>{u.name} ({u.email}) - {u.role}</span>
              <div>
                <button onClick={() => router.push(`/admin/users/${u.id}/edit`)} className='text-blue-600 mr-2 hover:underline cursor-pointer'>
                  編集
                </button>
                <button onClick={() => handleDeleteUser(u.id)} className='text-red-600 hover:underline cursor-pointer'>
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl mb-2'>カテゴリ管理</h2>
        
        <form onSubmit={handleCreateCategory} className='flex gap-2 max-w-xl'>
          <input
            className='flex-1 border px-3 py-2 rounded'
            placeholder='カテゴリ名'
            type="text"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
          />
          <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer'>
            追加
          </button>
        </form>
        <ul className='border rounded p-4 space-y-2 w-full'>
          {categories.map(c => (
            <li key={c.id} className='flex justify-between items-center'>
              <span>{c.name}</span>
              <div>
                <button
                  onClick={() => router.push(`/admin/categories/${c.id}/edit`)}
                  className='text-blue-600 mr-2 hover:underline cursor-pointer'
                >
                  編集
                </button>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className='text-red-600 hover:underline cursor-pointer'
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminPage;