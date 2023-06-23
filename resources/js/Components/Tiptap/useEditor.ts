import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import {
  Content,
  EditorOptions,
  useEditor as useEditorTiptap,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { LiteralTab } from './Editor/Extensions/LiteralTab';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import KopSurat1 from './Editor/Extensions/KopSurat1';
import { FontSize } from './Editor/Extensions/FontSize';
import TandaTangan1 from './Editor/Extensions/TandaTangan1';
import {Image} from './Editor/Extensions/Image';

export interface CustomEditorOption {
  canSign: boolean;
  canUploadKopSuratImage: boolean;
}

interface Props {
  override: Partial<EditorOptions>;
  content: Content;
  editable: boolean;
}

export function useEditor(props: Partial<Props> & Partial<CustomEditorOption> = {}) {
  let { content, override, editable, ...custom } = props;
  return useEditorTiptap({
    extensions: [
      LiteralTab,
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write here',
      }),
      Highlight,
      TaskItem,
      TaskList,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
            Image,
      TableHeader,
      TableRow,
      TableCell.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            borderType: {
              default: 'all',
            },
          };
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily,
      FontSize,

      KopSurat1.configure({
        canUploadImage: custom?.canUploadKopSuratImage ?? false,
      }),
      TandaTangan1.configure({
        canSign: custom?.canSign ?? false,
      }),
    ],

    content: content,
    editable: editable ?? true,
    ...(override || {}),
  });
}
