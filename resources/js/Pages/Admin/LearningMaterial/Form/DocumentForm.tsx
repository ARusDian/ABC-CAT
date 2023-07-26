import React from 'react';

import AddNewHeader from '@/Components/AddNewHeader';
import InputError from '@/Components/Jetstream/InputError';
import { ErrorHelper } from '@/Models/ErrorHelper';
import { getUniqueKey } from '@/Models/Helper';
import {
  BaseLearningMaterialDocumentModel,
  BaseLearningMaterialModel,
  createDefaultLearningMaterialDocument,
} from '@/Models/LearningMaterial';
import InputLabel from '@/Components/Jetstream/InputLabel';
import PDFViewer from '@/Components/PDFViewer';
import { Button } from '@mui/material';
import { InertiaFormProps } from '@inertiajs/react/types/useForm';

interface Props {
  form: InertiaFormProps<BaseLearningMaterialModel>;
  className?: string;
  documents: Array<BaseLearningMaterialDocumentModel>;
  onChange: (value: Array<BaseLearningMaterialDocumentModel>) => void;
}
export default function DocumentForm(props: Props) {
  let errors = new ErrorHelper(props.form.errors);

  function handleChange<T>(callback: (args0: T) => void) {
    return (e: T) => {
      callback(e);
      props.onChange(props.documents);
    };
  }

  return (
    <div className={`flex-col gap-5 my-8 ${props.className}`}>
      <div className="border-t-2 text-lg">Dokumen Materi Pembelajaran</div>
      <div className="flex-col gap-2">
        <AddNewHeader
          title=""
          id="add-new-document"
          onClick={handleChange(() =>
            props.documents.push(createDefaultLearningMaterialDocument()),
          )}
        />
        {props.form.data.documents.length > 0 &&
          props.form.data.documents.map((document, index) => {
            return (
              <div key={getUniqueKey(document)} className="border-b-2 pb-5">
                <div className="my-5 flex flex-col md:flex-row gap-2">
                  <div className="">
                    <label className="label" htmlFor={`document_name_${index}`}>
                      Keterangan Dokumen
                    </label>
                    <input
                      id={`document_name_${index}`}
                      key={`document-${getUniqueKey(document)}-name`}
                      type="text"
                      className="input w-full"
                      required
                      value={props.form.data.documents[index].caption}
                      onChange={handleChange(e => {
                        document.caption = e.target.value;
                      })}
                    />
                    <InputError
                      message={errors.getChild('documents', 'caption')}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex justify-center flex-1">
                    <div>
                      <label
                        className="label"
                        htmlFor={`document_file_${index}`}
                      >
                        <span className="label-text">Dokumen</span>
                      </label>
                      <input
                        id={`document_file_${index}`}
                        key={`document-${getUniqueKey(document)}-file`}
                        type="file"
                        className="p-2 md:input"
                        accept="application/pdf"
                        onChange={handleChange((e: any) => {
                          document.document_file.file = e.target.files.item(0);
                        })}
                      />
                      <InputLabel htmlFor={`document_file_${index}`}>
                        <div className="flex justify-between">
                          <span className="label-text-alt">Maksimal 10 MB</span>
                          <span className="label-text-alt">
                            Dalam bentuk PDF
                          </span>
                        </div>
                      </InputLabel>
                      <InputError
                        message={errors.getChild('documents', 'file')}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div
                    className="my-3"
                    onClick={handleChange(_ => {
                      props.documents.splice(index, 1);
                    })}
                  >
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      size="large"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
                <div
                  className="mt-4 flex items-center justify-center"
                  key={`document-${getUniqueKey(document)}-preview`}
                >
                  {document.document_file.file ||
                  document.document_file.path ? (
                    <PDFViewer document={document} />
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-md p-2 w-8/12 flex justify-center items-center text-xl">
                      Preview area
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
