import { Extension } from '@tiptap/core';

export const LiteralTab = Extension.create({
  name: 'literalTab',

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (!this.editor.isActive('listItem')) {
          return editor.commands.insertContent('\t');
        } else {
          return false;
        }
      },
    };
  },
});
