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
import { UseFormReturn, useFieldArray } from 'react-hook-form';

interface Props {
  form: UseFormReturn<BaseLearningMaterialModel>;
  className?: string;
}
export default function DocumentForm(props: Props) {
  const { form } = props;
  const documentsArray = useFieldArray({
    control: form.control,
    name: 'documents',
  });

  return (
    <div className={`flex-col gap-5 my-8 ${props.className}`}>
      <div className="border-t-2 text-lg">Dokumen Materi Pembelajaran</div>
      <div className="flex-col gap-2">
        <AddNewHeader
          title=""
          id="add-new-document"
          onClick={() => {
            documentsArray.append(createDefaultLearningMaterialDocument());
          }}
        />
        {documentsArray.fields.length > 0 &&
          documentsArray.fields.map((document, index) => {
            const document_file = form.watch(
              `documents.${index}.document_file`,
            );
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
                      {...form.register(`documents.${index}.caption`)}
                      defaultValue={
                        form.formState.defaultValues?.documents?.at(index)
                          ?.caption
                      }
                    />
                    <InputError
                      message={
                        form.formState.errors.documents?.at?.(index)?.message
                      }
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
                        name={`documents.${index}.file`}
                        onChange={(e: any) => {
                          form.setValue(
                            `documents.${index}.document_file.file`,
                            e.target.files.item(0),
                          );
                        }}
                      />
                      <InputLabel htmlFor={`document_file_${index}`}>
                        <div className="flex justify-between text-red-500">
                          <span className="label-text-alt">Maksimal 50 MB</span>
                          <span className="label-text-alt">
                            Dalam bentuk PDF
                          </span>
                        </div>
                      </InputLabel>
                      <InputError
                        message={
                          form.formState.errors?.documents?.at?.(index)?.message
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div
                    className="my-3"
                    onClick={() => documentsArray.remove(index)}
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
                  {document_file.file || document_file.path ? (
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
