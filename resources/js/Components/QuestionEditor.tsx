import { Editor, Content } from '@tiptap/react';
import { useEditor } from './Tiptap/useEditor';
import React, { useRef } from 'react';
import EditorInput from './Tiptap/EditorInput';
import axios from 'axios';
import route from 'ziggy-js';

interface Props {
  content: Content | null;
  onBlur?: (json: object) => void;

  exerciseQuestionId: string;

  disableEdit?: boolean;

  editorRef?: React.MutableRefObject<Editor | null>;

  editorClassName?: string;
}

export default function QuestionEditor(props: Props) {
  const editable = props.disableEdit !== true;
  const editor = useEditor({
    content: props.content,
    editable,
    override: {
      onBlur: ({ editor }) => {
        props.onBlur?.(editor.getJSON());
      },
      editorProps: {
        attributes: {
          class: props.editorClassName ?? 'h-full',
        },
      },
    },
  });

  React.useEffect(() => {
    if (props.editorRef) {
      props.editorRef.current = editor;
    }
  }, [editor]);

  const onUploadImage = React.useCallback(
    async (file: File) => {
      let form = new FormData();
      form.append('file', file);
      const response = await axios.postForm(
        route('exercise-question.upload-image', [props.exerciseQuestionId]),
        form,
      );
      return {
        id: response.data.id,
        disk: response.data.disk,
      };
    },
    [props.exerciseQuestionId],
  );

  const editorRef = useRef();

  return (
    <EditorInput
      editor={editor}
      editorRef={editorRef}
      onChange={props.onBlur}
      disableMenu={props.disableEdit}
      uploadImage={onUploadImage}
    />
  );
}
