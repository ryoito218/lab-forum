'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('access_token');
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className='bg-gray-800 text-white px-4 py-2 rounded cursor-pointer'>
      ログアウト
    </button>
  );
};

export default LogoutButton;
