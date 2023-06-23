import { Editor, Content } from '@tiptap/react';
import { useEditor } from './Tiptap/useEditor';
import React, { useRef } from 'react';
import EditorInput from './Tiptap/EditorInput';

interface Props {
  content: Content | null;
  // onBlur: (editor: Editor) =>
}

export default function QuestionEditor(props: Props) {
  const editor = useEditor({
    content: props.content,
  });

    const editorRef = useRef();


    return <EditorInput editor={editor} editorRef={editorRef}/>
}
