'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchForm from './SearchForm';
import LogoutButton from './LogoutButton';
import Cookies from 'js-cookie';
import { apiFetch } from '@/lib/api';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'normal' | 'admin';
}

const NavBar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const navItems = [
    { label: 'ホーム', href: '/' },
    { label: '投稿', href: '/posts' },
    { label: 'RAG検索', href: '/rag' },
  ]

  const getHeaders = () => {
    const token = Cookies.get("access_token");
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await apiFetch('/auth/me', {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  if (pathname === '/login') return null;

  return (
    <header className='flex justify-between items-center px-6 py-4 bg-white shadow'>
      <div className='flex items-center space-x-6'>
        <Link href={'/'} className='text-xl font-bold cursor-pointer'>
          研究室掲示板
        </Link>
        <nav className='flex space-x-4'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:underline ${
                pathname === item.href ? 'font-bold text-blue-600' : 'text-gray-700' 
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link href={'/admin'} className={`hover:underline ${pathname === '/admin' ? 'font-bold text-blue-600' : 'text-gray-700' }` }>管理</Link>
          )}
        </nav>
      </div>
      
      <div className='flex items-center space-x-4'>
        <SearchForm />
        <LogoutButton />
      </div>
    </header>
  );
};

export default NavBar;