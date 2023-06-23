import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import MenuBar from './MenuBar';
import '@/Components/Tiptap/styles.scss';

interface Props {
  editor: Editor | null;
  editorRef?: React.MutableRefObject<any>;
}

export default function EditorInput({ editor, editorRef }: Props) {
  return (
    <>
      {editor && (
        <>
          {' '}
          <MenuBar editor={editor} />
          <div className="border-t border-gray-400"></div>
        </>
      )}
      <EditorContent editor={editor} ref={editorRef} />
    </>
  );
}
