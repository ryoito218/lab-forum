'use client';

import React, {useState} from 'react';
import { useRouter } from 'next/navigation';

const SearchForm = () => {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = keyword.trim();
    if (!term) return;
    const params = new URLSearchParams({
      keyword: term,
      page: '1',
      sort: 'created_desc',
    });
    router.push(`/search?${params.toString()}`);
    setKeyword('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex'>
      <input 
        type="text" 
        value={keyword} 
        onChange={(e) => setKeyword(e.target.value)} 
        placeholder='Search...' 
        className='border border-gray-300 rounded-l px-2 py-2 focus:outline-none' 
      />
      <button
        type='submit'
        className='bg-blue-500 text-white px-3 py-2 rounded-r hover:bg-blue-600 cursor-pointer'
      >
        検索
      </button>
    </form>
  );
};

export default SearchForm;