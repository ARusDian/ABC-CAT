import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import {
  ToolbarSlot,
  TransformToolbarSlot,
  toolbarPlugin,
} from '@react-pdf-viewer/toolbar';
import { asset, getUniqueKey } from '@/Models/Helper';
import { BaseLearningMaterialDocumentModel } from '@/Models/LearningMaterial';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface Props {
  document: BaseLearningMaterialDocumentModel;
}

export default function PDFViewer(props: Props) {
  const document = props.document;
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
    OpenMenuItem: () => <></>,
    OpenFile: () => <></>,
    Open: () => <></>,
    Print: () => <></>,
  });

  return (
    <div className="border border-gray-300 rounded-md p-2 h-1.2 w-6/12 mx-auto">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.js">
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#eeeeee',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            padding: '4px',
          }}
        >
          <Toolbar key={`document-${getUniqueKey(document)}-toolbar`}>
            {renderDefaultToolbar(transform)}
          </Toolbar>
        </div>
        <div style={{ height: '600px' }} id="pdfviewer">
          <Viewer
            fileUrl={asset('public', document.document_file.path!) as string}
            plugins={[toolbarPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  );
}
