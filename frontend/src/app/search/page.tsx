// src/app/search/page.tsx
import React, { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4">読み込み中です…</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
