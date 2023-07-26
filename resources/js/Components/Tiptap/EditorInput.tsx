import { Editor, EditorContent } from '@tiptap/react';
import React from 'react';
import MenuBar from './MenuBar';
import '@/Components/Tiptap/styles.scss';

interface Props {
  editor: Editor | null;
  editorRef?: React.MutableRefObject<any>;
  onChange?: (json: object) => void;

  uploadImage?: (file: File) => Promise<{ id: string; disk: 'public' } | null>;

  disableMenu?: boolean;
}

export default function EditorInput({
  editor,
  editorRef,
  onChange,
  uploadImage,
  disableMenu,
}: Props) {
  const onChangeCallback = React.useCallback(() => {
    onChange?.call?.(null, editor?.getJSON()!);
  }, [editor, onChange]);
  return (
    <>
      {editor && disableMenu !== true && (
        <>
          {' '}
          <MenuBar editor={editor} uploadImage={uploadImage} />
          <div className="border-t border-gray-400"></div>
        </>
      )}
      <EditorContent
        editor={editor}
        ref={editorRef}
        onChange={onChangeCallback}
      />
    </>
  );
}
