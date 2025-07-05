'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchForm from './SearchForm';
import LogoutButton from './LogoutButton';

const NavBar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'ホーム', href: '/' },
    { label: '投稿一覧', href: '/posts' }
  ]

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