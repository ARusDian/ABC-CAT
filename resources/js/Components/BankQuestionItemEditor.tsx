import { Editor, Content } from '@tiptap/react';
import { useEditor } from './Tiptap/useEditor';
import React, { useRef } from 'react';
import EditorInput from './Tiptap/EditorInput';
import axios from 'axios';
import route from 'ziggy-js';
import ResourceEditor, { ImmutableProps, MutableProps } from './ResourceEditor';

export type Props = Omit<MutableProps, 'documentFileType'>;

export default function BankQuestionItemEditor(props: Props) {
  return <ResourceEditor {...props} documentFileType="bank-question" />;
}
