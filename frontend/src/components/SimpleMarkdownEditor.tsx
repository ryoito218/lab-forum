'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export interface SimpleMarkdownEditorProps {
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}

const SimpleMarkdownEditor: React.FC<SimpleMarkdownEditorProps> = ({
  markdown,
  setMarkdown,
}) => {

  return (
    <div className='flex h-full gap-4 p-4'>
      <textarea
        className='w-1/2 h-full border rounded p-2 focus:outline-none focus:ring'
        placeholder='ここに Markdown を入力'
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
      />

      <div className='w-1/2 h-full overflow-auto border rounded p-4 bg-white prose'>      
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default SimpleMarkdownEditor;