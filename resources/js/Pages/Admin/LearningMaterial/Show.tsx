import React from 'react';
import route from 'ziggy-js';
import parse from 'html-react-parser';
import { router } from '@inertiajs/react';
import { LearningMaterialModel } from '@/Models/LearningMaterial';
import PDFViewer from '@/Components/PDFViewer';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props {
  learningMaterial: LearningMaterialModel;
}

export default function Index(props: Props) {
  const learningMaterial = props.learningMaterial;

  const {
    learning_packet,
    sub_learning_packet,
    learning_category,
  } = useDefaultClassificationRouteParams();

  return (
    <AdminShowLayout
      title={`Materi Belajar ${learningMaterial.title}`}
      headerTitle={'Data Materi Belajar'}
      backRoute={route('learning-packet.sub-learning-packet.learning-category.show', [
        learning_packet,
        sub_learning_packet,
        learning_category,
      ])}
      backRouteTitle="Kembali"
      editRoute={route('learning-packet.sub-learning-packet.learning-category.learning-material.edit', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        learningMaterial.id,
      ])}
      editRouteTitle="Edit"
      onDelete={() => {
        router.post(route('learning-packet.sub-learning-packet.learning-category.learning-material.destroy', [
          learning_packet,
          sub_learning_packet,
          learning_category,
          learningMaterial.id,
        ]), {
          _method: 'DELETE',
        });
      }}
      deleteTitle="Hapus"
    >
      <div>
        <div className="text-xl font-bold">{learningMaterial.title}</div>
      </div>
      <div>Deskripsi Materi Pembelajaran :</div>
      <div className="border-2 border-gray-200 p-5">
        <div className="prose ">{parse(learningMaterial.description)}</div>
      </div>
      <div className="mt-8 text-2xl">Dokumen Materi Pembelajaran</div>
      <div className="flex flex-col gap-2">
        {learningMaterial.documents.length > 0 &&
          learningMaterial.documents.map((document, index) => {
            return (
              <div key={document.id} className="border-b-2 pb-5">
                <div className="my-5 flex flex-col gap-2">
                  <div className="flex-1">
                    <label className="label" htmlFor={`document_name_${index}`}>
                      Nama Dokumen
                    </label>
                    <input
                      id={`document_name_${index}`}
                      key={`document-${document.id}-name`}
                      type="text"
                      className="input w-full"
                      required
                      value={document.caption}
                      disabled
                    />
                  </div>
                  <PDFViewer document={document} />
                </div>
              </div>
            );
          })}
      </div>
    </AdminShowLayout>
  );
}
