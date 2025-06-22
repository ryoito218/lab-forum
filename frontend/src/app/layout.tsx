import React from 'react';
import "./globals.css";
import LogoutButton from '@/components/LogoutButton';

export const metadata = {
  title: "研究掲示板",
  description: "研究室メンバーによる投稿と知識共有のプラットフォーム",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <body className='bg-gray-100 text-gray-900'>
        <header className='flex justify-between items-center px-6 py-4 bg-white shadow'>
          <h1 className='text-xl font-bold'>研究室掲示板</h1>
          <LogoutButton />
        </header>
        <main className='max-w-4xl mx-auto py-6 px-4'>{children}</main>
      </body>
    </html>
  )
};

export default RootLayout;
