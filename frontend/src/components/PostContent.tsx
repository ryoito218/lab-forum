'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';

const ReactMarkdown = dynamic(() => import('react-markdown'), {ssr: false});

const PostContent = ({ content }: { content: string }) => {
  return (
    <div className='prose max-w-none'>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default PostContent
