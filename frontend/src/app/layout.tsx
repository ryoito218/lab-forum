import React from 'react';
import "./globals.css";
import NavBar from '@/components/NavBar';

export const metadata = {
  title: "研究掲示板",
  description: "研究室メンバーによる投稿と知識共有のプラットフォーム",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <body className='bg-gray-100 text-gray-900'>
        <NavBar />
        <main className='max-w-4xl mx-auto py-6 px-4'>{children}</main>
      </body>
    </html>
  )
};

export default RootLayout;
