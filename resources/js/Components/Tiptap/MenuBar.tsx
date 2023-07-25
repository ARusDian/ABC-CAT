import 'remixicon/fonts/remixicon.css';
import { Editor } from '@tiptap/react';

import React, { Fragment, useState } from 'react';
import './MenuItem.scss';
import MenuItem, { MenuProps } from './MenuItem';
import { router } from '@inertiajs/react';
import axios from 'axios';
import route from 'ziggy-js';

interface Props {
  editor: Editor;
  closeMenu?: () => void;

  uploadImage?: (file: File) => Promise<{ id: string; disk: 'public' } | null>;
}

interface Divider {
  type: 'divider';
}

interface MenuI extends MenuProps {
  type?: undefined;
}

function InsertTableMenu({ closeMenu, editor }: Props) {
  let perRow = 10;
  let [selectedCell, setSelectedCell] = React.useState<[number, number] | null>(
    null,
  );

  return (
    <div className="flex flex-row" onMouseOut={() => setSelectedCell(null)}>
      {[...Array(perRow).keys()].map(col => {
        return (
          <div
            style={{
              margin: '0px',
            }}
          >
            {[...Array(perRow).keys()].map(row => {
              let isSelected = false;
              if (selectedCell != null) {
                let [selectedRow, selectedCol] = selectedCell;
                isSelected = row < selectedRow && col < selectedCol;
              }

              return (
                <button
                  className="w-4 h-2"
                  type="button"
                  onMouseEnter={() => setSelectedCell([row + 1, col + 1])}
                  style={{
                    color: isSelected ? 'blue' : undefined,
                  }}
                  onClick={() => {
                    editor
                      .chain()
                      .insertTable({
                        rows: row + 1,
                        cols: col + 1,
                        withHeaderRow: false,
                      })
                      .run();

                    closeMenu?.();
                  }}
                >
                  □
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
  //
}

export default function MenuBar(props: Props) {
  let { editor, uploadImage } = props;

  const [files, setFiles] = useState<FileList | null>(null);

  React.useEffect(() => {
    (async () => {
      if (files && files.length > 0 && uploadImage) {
        for (const file of files) {
          const response = await uploadImage(file);

          if (response) {
            editor
              .chain()
              .focus()
              .setImage({
                id: response.id,
                disk: response.disk,
                // src: `/storage/${response.data.path}`
              })
              .run();
          }
          // form.append(`file[${index}]`, file);
        }
      }

      setFiles(null);
    })();
  }, [files]);

  const items: Array<MenuI | Divider> = [
    {
      icon: 'bold',
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: 'italic',
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: 'strikethrough',
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },

    {
      title: editor.getAttributes('textStyle').fontSize,
      subMenu: [8, 9, 10, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96].map(
        it => ({
          title: `${it}`,
          action: () => editor.chain().setFontSize(`${it}pt`).run(),
          isActive: () =>
            editor.getAttributes('textStyle').fontSize == `${it}pt`,
        }),
      ),
    },
    ...['left', 'center', 'justify', 'right'].map(it => ({
      icon: `align-${it}`,
      title: `Align ${it}`,
      action: () => {
        return editor.chain().focus().setTextAlign(it).run();
      },
      isActive: () => editor.isActive({ textAlign: it }),
    })),
    {
      title: 'Heading',
      subMenu: [
        {
          icon: 'h-1',
          title: 'Heading 1',
          action: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
          icon: 'h-2',
          title: 'Heading 2',
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive('heading', { level: 2 }),
        },
      ],
    },
    {
      icon: 'code-view',
      title: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
    {
      icon: 'mark-pen-line',
      title: 'Highlight',
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive('highlight'),
    },
    {
      type: 'divider',
    },
    {
      icon: 'paragraph',
      title: 'Paragraph',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive('paragraph'),
    },
    {
      icon: 'list-unordered',
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: 'list-ordered',
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      icon: 'list-check-2',
      title: 'Task List',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive('taskList'),
    },
    {
      icon: 'code-box-line',
      title: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
    {
      type: 'divider',
    },
    {
      icon: 'double-quotes-l',
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      icon: 'separator',
      title: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: 'text-wrap',
      title: 'Hard Break',
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: 'format-clear',
      title: 'Clear Format',
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: 'arrow-go-back-line',
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: 'arrow-go-forward-line',
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
    },
    {
      title: 'Upload image',
      isActive: () => uploadImage != undefined,
      icon: 'gallery-upload-line',
      children: props => {
        if (files == null) {
          return (
            <input
              type="file"
              accept="image/*"
              onChange={event => {
                setFiles(event.target.files ?? new FileList());
                // for (const file of event.target.files ?? []) {
                //   file.stream
                // }
                // console.log(event.target.files);
                // props.closeMenu?.();
              }}
            ></input>
          );
        } else {
          return <div>Loading</div>;
        }
      },
    },
    {
      title: 'Table',
      subMenu: [
        {
          title: 'Insert Table',
          children: ({ closeMenu }) => {
            return (
              <InsertTableMenu
                editor={editor}
                closeMenu={closeMenu}
                uploadImage={uploadImage}
              />
            );
          },
        },
      ],
    },
  ];

  const tableItems: Array<MenuI | Divider> = [
    {
      title: 'Split Cell',
      icon: 'split-cells-vertical',
      action: () => editor.chain().focus().splitCell().run(),
    },
    {
      title: 'Merge Cell',
      icon: 'merge-cells-vertical',
      action: () => editor.chain().focus().mergeCells().run(),
    },
    {
      title: 'Insert Row Above',
      icon: 'insert-row-bottom',
      action() {
        editor.chain().focus().addRowBefore().run();
      },
    },
    {
      title: 'Insert Row Above',
      icon: 'insert-row-top',
      action() {
        editor.chain().focus().addRowAfter().run();
      },
    },
    {
      title: 'Delete Row',
      icon: 'delete-row',
      action() {
        editor.chain().focus().deleteRow().run();
      },
    },
    {
      title: 'Insert Column Left',
      icon: 'insert-column-left',
      action() {
        editor.chain().focus().addColumnBefore().run();
      },
    },
    {
      title: 'Insert Column Right',
      icon: 'insert-column-right',
      action() {
        editor.chain().focus().addColumnAfter().run();
      },
    },
    {
      title: 'Delete Column',
      icon: 'delete-column',
      action() {
        editor.chain().focus().deleteColumn().run();
      },
    },
    {
      title: 'Delete Table',
      action() {
        editor.chain().deleteTable().run();
      },
    },
    {
      title: 'No Border',
      action: () => editor.chain().setCellAttribute('borderType', 'none').run(),
    },
  ];

  return (
    <div>
      <ul className="editor__header">
        {items.map((item, index) => {
          return (
            <li key={index}>
              {item.type == 'divider' ? (
                <i className="divider" />
              ) : (
                <MenuItem menu={item} editor={editor} depth={0} />
              )}
            </li>
          );
        })}
      </ul>
      {editor?.isActive('table') && (
        <ul className="editor__header">
          {tableItems.map((item, index) => {
            return (
              <li key={index}>
                {item.type == 'divider' ? (
                  <i className="divider" />
                ) : (
                  <MenuItem menu={item} editor={editor} depth={0} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
