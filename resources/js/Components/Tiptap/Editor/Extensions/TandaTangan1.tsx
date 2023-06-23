import useRoute from '@/Hooks/useRoute';
import { Node } from '@tiptap/core';
import {
  mergeAttributes,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import React from 'react';
import './KopSurat1.scss';

function TandaTangan1(props: NodeViewProps) {
  let route = useRoute();

  let { image, user } = props.node.attrs;

  if (image?.id != null && image?.src == null) {
    image.src = route('sign.image', [image?.id]);
    props.updateAttributes({
      ...props.node.attrs,
      image,
    });
  }

  return (
    <NodeViewWrapper className="tanda-tangan-1" contentEditable={false}>
      <p>{user?.jabatan ?? "Jabatan (Placeholder)"}</p>
      <div>
        <img src={image?.src} />
      </div>
      <p>{user?.name ?? "Nama (Placeholder)"}</p>
      <p>{user?.nip ?? "NIP (Placeholder)"}</p>
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: 'tanda-tangan-1',
  group: 'block',
  selectable: true,
  isolating: true,
  content: 'inline*',

  addOptions() {
    return {
      canSign: false,
      defaultUser: undefined,
    };
  },

  addAttributes() {
    return {
      image: {
        default: null,
      },
      user: {
        default: this.options.defaultUser,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'tanda-tangan-1',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['tanda-tangan-1', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TandaTangan1);
  },
});
