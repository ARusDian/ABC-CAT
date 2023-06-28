import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useMemo,
} from 'react';
import JoditEditor from 'jodit-react';

interface JoditProps {
  contentValue: string;
  contentValueHandler?: (newValue: string) => void;
  imageValue: string[];
  imageValueHandler: Dispatch<SetStateAction<string[]>>;
  editorRef?: any;
}

export default function TextEditorInput({
  contentValue,
  contentValueHandler,
  imageValue,
  imageValueHandler,
  editorRef,
}: JoditProps) {
  const imagesStateHandler = (element: any) => {
    const src = element.getAttribute('src');
    imageValue.push(src);
    imageValueHandler(imageValue);
  };

  const config = useMemo(
    () => ({
      readonly: false,
      autofocus: true,
      tabIndex: 1,
      height: '50vh',
      width: '100%',
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      enableDragAndDropFileToEditor: true,
      // defaultActionOnPaste: 'insert_clear_html',
      placeholder: '...',
      beautyHTML: true,
      // toolbarButtonSize: "large",
      buttons: [
        'source',
        'image',
        '|',
        'bold',
        'italic',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'paragraph',
        '|',
        'table',
        'link',
        '|',
        'left',
        'center',
        'right',
        'justify',
        '|',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'fullsize',
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      events: {
        afterInsertImage: imagesStateHandler, // Mengaitkan fungsi dengan acara 'afterInsertImage'
      },
    }),
    [],
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
      className="prose m-auto"
    >
      <div style={{ width: '100%', margin: 'auto' }}>
        <JoditEditor
          ref={editorRef}
          value={contentValue}
          config={config}
          onBlur={newContent => contentValueHandler?.(newContent)}
        />
      </div>
    </div>
  );
}
