import { asset } from '@/Models/Helper';
import { Node } from '@tiptap/core';
import {
  mergeAttributes,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import axios from 'axios';
import React, { useState } from 'react';
import route from 'ziggy-js';
import './KopSurat1.scss';

function KopSurat1(props: NodeViewProps) {
  const [isHover, setIsHover] = useState(false);
  let image = props.node.attrs.image;

  function onButtonClick() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = async e => {
      let form = new FormData();
      let target = e?.target as HTMLInputElement | null;
      let files = target?.files;
      if (files?.length == 1) {
        let [file] = files;
        form.append('image', file);

        props.updateAttributes({
          uploading: true,
          ...props.node.attrs,
        });
        try {
          const response = await axios.postForm(route('image.store'), {
            image: file,
          });

          props.updateAttributes({
            uploading: false,
            image: {
              disk: response.data.disk,
              path: response.data.path,
            },
          });
        } catch (e) {
          props.updateAttributes({
            uploading: false,
            ...props.node.attrs,
          });

          throw e;
        }
      }
    };

    input.click();
  }

  return (
    <NodeViewWrapper className="kop-surat-1">
      <table className="c15">
        <tbody>
          <tr className="c22">
            <td className="c29" colSpan={1} rowSpan={1}>
              <span
                style={{
                  overflow: 'hidden',
                  display: 'inline-block',
                  margin: '0px 0px',
                  border: '0px solid #000000',
                  transform: 'rotate(0rad) translateZ(0px)',
                  WebkitTransform: 'rotate(0rad) translateZ(0px)',
                  width: '83.33px',
                  height: '98.67px',
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
                <img
                  src={asset(image.disk, image.path)}
                  style={{
                    width: '83.33px',
                    height: '98.67px',
                    marginLeft: '-0px',
                    marginTop: '-0px',
                    transform: 'rotate(0rad) translateZ(0px)',
                    WebkitTransform: 'rotate(0rad) translateZ(0px)',
                  }}
                  title=""
                />
                {isHover && props.extension.options.canUploadImage && (
                  <button
                    onClick={onButtonClick}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      msTransform: 'translate(-50%, -50%)',
                      backgroundColor: 'white',
                      padding: '4px',
                      border: 'none',
                      borderRadius: '10px',
                    }}
                    type="button"
                  >
                    Upload
                  </button>
                )}
              </span>
              <p className="c9">
                <span className="c5"></span>
              </p>
              <p className="c9">
                <span className="c5"></span>
              </p>
            </td>
            <td className="c19" colSpan={1} rowSpan={1}>
              <NodeViewContent />
            </td>
            <td className="c24" colSpan={1} rowSpan={1}>
              <p className="c9">
                <span className="c5"></span>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: 'kop-surat-1',
  group: 'block',
  selectable: true,
  content: 'block*',
  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'kop-surat-1',
      },
    ];
  },
  addOptions() {
    return {
      canUploadImage: false,
    };
  },
  addAttributes() {
    return {
      image: {
        default: {
          disk: 'root',
          path: 'itk.png',
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['kop-surat-1', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KopSurat1);
  },
});
