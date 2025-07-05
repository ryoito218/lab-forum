'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SearchForm from './SearchForm';
import LogoutButton from './LogoutButton';

const NavBar = () => {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <header className='flex justify-between items-center px-6 py-4 bg-white shadow'>
      <h1 className='text-xl font-bold'>研究室掲示板</h1>
      <div className='flex items-center space-x-4'>
        <SearchForm />
        <LogoutButton />
      </div>
    </header>
  );
};

export default NavBar;