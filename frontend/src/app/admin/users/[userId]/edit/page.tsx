'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type User = {
  id: number;
  name: string;
  email: string;
  role: 'normal' | 'admin';
}

const EditUserPage = () => {
  const router = useRouter();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'normal' | 'admin'>('normal');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    const token = Cookies.get('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    (async () => {
      const headers = getHeaders();
      const res = await fetch('${API_BASE}/admin/users', { headers });

      if (res.status === 401) {
        router.push('/login');
      }

      if (res.status === 403) {
        router.push('/');
      };

      const list: User[] = await res.json();
      const u = list.find(u => u.id === Number(userId));
      if (u) {
        setUser(u);
        setName(u.name);
        setEmail(u.email);
        setRole(u.role as 'normal' | 'admin');
      }
      setLoading(false);
    })();
  }, [userId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const headers = getHeaders();

    const body: Record<string, any> = { name, email, role };
    if (password.trim()) {
      body.password = password;
    }
    await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    router.push('/admin');
  };

  if (loading) return <p className='p-4'>読み込み中...</p>
  if (!user) return <p className='p-4 text-red-500'>ユーザが見つかりません</p>

  return (
    <div className='p-6 max-w-md mx-auto bg-white rounded shadow mt-6'>
      <h1 className='text-2xl font-bold mb-4'>ユーザ編集</h1>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm'>名前</label>
          <input 
            className='mt-1 w-full border rounded p-2'
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className='block text-sm'>メールアドレス</label>
          <input
            className='mt-1 w-full border rounded p-2' 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className='block text-sm'>ロール</label>
          <select
            className='mt-1 w-full border rounded p-2'
            value={role}
            onChange={e => setRole(e.target.value as 'normal' | 'admin')}
          >
            <option value="normal">normal</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div>
          <label className='block text-sm'>新しいパスワード（任意）</label>
          <input
            className='mt-1 w-full border rounded p-2' 
            type="password" 
            placeholder='変更する場合のみ入力'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className='flex gap-2'>
          <button type='submit' className='flex-1 py-2 bg-blue-600 text-white rounded cursor-pointer'>
            保存
          </button>
          <button
            type='button'
            onClick={() => router.push('/admin')}
            className='flex-1 py-2 bg-gray-300 rounded cursor-pointer'
          >
            キャンセル
          </button>
        </div>
      </form> 
    </div>
  );
}

export default EditUserPage;