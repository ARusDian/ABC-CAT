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
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

import { getStorageFileUrl } from '@/Models/FileModel';

interface Props {
  document: BaseLearningMaterialDocumentModel;
  height?: string;
}

export default function PDFViewer({ document, height }: Props) {
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
      <Worker workerUrl={workerUrl}>
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
        <div style={{ height: height ?? '800px' }} id="pdfviewer">
          <Viewer
            fileUrl={getStorageFileUrl(document.document_file) as string}
            plugins={[toolbarPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  );
}
