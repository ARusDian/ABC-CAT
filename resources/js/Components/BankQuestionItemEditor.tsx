import { Editor, Content } from '@tiptap/react';
import { useEditor } from './Tiptap/useEditor';
import React, { useRef } from 'react';
import EditorInput from './Tiptap/EditorInput';
import axios from 'axios';
import route from 'ziggy-js';
import ResourceEditor, { Props as ResourceEditorProps } from './ResourceEditor';

export type Props = ResourceEditorProps & { documentFileType?: undefined };

export default function BankQuestionItemEditor(props: Props) {
  return <ResourceEditor {...props} documentFileType="bank-question" />;
  // const editable = props.disableEdit !== true;
  // const editor = useEditor({
  //   content: props.content,
  //   editable,
  //   override: {
  //     onBlur: ({ editor }) => {
  //       props.onBlur?.(editor.getJSON());
  //     },
  //     editorProps: {
  //       attributes: {
  //         class: props.editorClassName ?? 'h-96',
  //       },
  //     },
  //   },
  // });
  //
  // React.useEffect(() => {
  //   if (props.editorRef) {
  //     props.editorRef.current = editor;
  //   }
  // }, [editor]);
  //
  // const onUploadImage = React.useCallback(
  //   async (file: File) => {
  //     const { bankQuestionId } = props;
  //
  //     if (!bankQuestionId) {
  //       console.error("bank question id empty, cannot upload image")
  //       return null;
  //     }
  //
  //     let form = new FormData();
  //     form.append('file', file);
  //     const response = await axios.postForm(
  //       route('bank-question.upload-image', [props.bankQuestionId]),
  //       form,
  //     );
  //
  //     return {
  //       id: response.data.id,
  //       disk: response.data.disk,
  //     };
  //   },
  //   [props.bankQuestionId],
  // );
  //
  // const editorRef = useRef();
  //
  // return (
  //   <EditorInput
  //     editor={editor}
  //     editorRef={editorRef}
  //     onChange={props.onBlur}
  //     disableMenu={props.disableEdit}
  //     uploadImage={onUploadImage}
  //   />
  // );
}
