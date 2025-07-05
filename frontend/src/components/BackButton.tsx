'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  label = '← 戻る',
  className = '',
}) => {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.back()}
        className={`bg-gray-300 text-gray-800 px-4 py-2 rounded cursor-pointer ${className}`}
      >
        {label}
      </button>
    </div>
  );
};

export default BackButton;