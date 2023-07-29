import { Editor, Content } from '@tiptap/react';
import { useEditor } from './Tiptap/useEditor';
import React, { useRef } from 'react';
import EditorInput from './Tiptap/EditorInput';
import axios from 'axios';
import route from 'ziggy-js';

export type Props =
  | {
      content: Content | null;
      onBlur: (json: object) => void;
      editorRef?: React.MutableRefObject<Editor | null>;
      editorClassName?: string;
      documentFileType: 'learning-material';
      disableEdit?: false;
    }
  | {
      content: Content | null;
      disableEdit: true;
      editorRef?: React.MutableRefObject<Editor | null>;
      editorClassName?: string;

      onBlur?: undefined;
      bankQuestionId?: undefined;
      documentFileType?: undefined;
    };

export default function ResourceEditor(props: Props) {
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
          class: props.editorClassName ?? 'h-96',
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
      const { documentFileType } = props;
      if (!documentFileType) {
        return null;
      }

      let form = new FormData();
      form.append('file', file);
      form.append('type', documentFileType);
      const response = await axios.postForm(
        route('document-file.store', []),
        form,
      );

      return {
        id: response.data.id,
        disk: response.data.disk,
      };
    },
    [props.documentFileType],
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