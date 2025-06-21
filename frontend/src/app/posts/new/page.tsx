import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Category = {
  id: number;
  name: string;
};

const getCategories = async (): Promise<Category[]> => {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) redirect("/login");

  const res = await fetch("http://backend:8000/categories", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status == 401) {
    const response = redirect('/login');
  }

  if (!res.ok) {
    throw new Error("カテゴリーの取得に失敗しました");
  }

  return res.json()
};

const NewPostPage = async () => {
  const categories = await getCategories();

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6'>
      <h1 className='text-2xl font-bold mb-4'>新規投稿</h1>
      <form className='space-y-4'>
        <div>
          <label className='block mb-1'>タイトル</label>
          <input type='text' name='title' className='w-full px-3 py-2 border rounded' required/>
        </div>

        <div>
          <label className='block mb-1'>カテゴリー</label>
          <select name='category_id' className='w-full px-3 py-2 border rounded'>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block mb-1'>タグ（半角カンマ区切り）</label>
          <input type='text' name='tags' className='w-full px-3 py-2 border rounded' placeholder='例: AI, Python, Deep Learning' />
        </div>

        <div>
          <label className='block mb-1'>本文（Markdown可）</label>
          <textarea name='content' rows={6} className='w-full px-3 py-2 border rounded'/>
        </div>

        <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
          投稿
        </button>
      </form>
    </div>
  )
}

export default NewPostPage
