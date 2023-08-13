import { Node, nodeInputRule, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageResizeComponent } from '../components/ImageResizeComponent';
// import { ReactHTMLElement } from 'react';
// import {nodeInputRule} from 'tiptap-commands'

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

export type ImageAttribute =
  | {
      id: string;
      disk: string;
    }
  | {
      src: string;
      alt?: string;
      title?: string;
    };

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: ImageAttribute) => ReturnType;
    };
  }
}

export const inputRegex =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

const FILE_ID_REGEX = /\/file\/(\d+)\/file/;
function getIdFromFile(src: string | null) {
  if (src) {
    let id = FILE_ID_REGEX.exec(src)?.at(1);

    if (id) {
      return {
        id,
        disk: 'public',
      };
    }
  }
}
export const Image = Node.create<ImageOptions>({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element =>
          element.hasAttribute('data-id') ? null : element.getAttribute('src'),
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      'data-id': {
        default: null,
      },
      'data-disk': {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[data-id][data-disk]',
      },
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
        //   getAttrs: node => {
        //     if (typeof node !== 'string') {
        //       let title = node.getAttribute('title');
        //       let alt = node.getAttribute('alt');
        //       let src = node.getAttribute('src');
        //
        //       let id = getIdFromFile(src);
        //
        //       let ret = {};
        //       if (id) {
        //         ret = {
        //           ...id,
        //           title,
        //           alt,
        //           src: undefined,
        //         };
        //       } else {
        //         ret = {
        //           src,
        //           title,
        //           alt,
        //         };
        //       }
        //
        //       return ret;
        //     } else {
        //       return {};
        //     }
        //     // if (node instanceof )
        //   },
        //   // getAttrs: (dom: HTMLElement) => ({
        //   // }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, 'data-id': id, 'data-disk': disk, ...attr } = HTMLAttributes;

    if (id != null && disk != null) {
      return [
        'img',
        mergeAttributes(this.options.HTMLAttributes, attr, {
          src: `/file/${id}/file`,
          'data-id': id,
          'data-disk': disk,
        }),
      ];
    }

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setImage:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              ...options,
              ...('id' in options
                ? {
                    'data-disk': options.disk,
                    'data-id': options.id,
                  }
                : {}),
            },
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title] = match;

          return { src, alt, title };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent);
  },
});
