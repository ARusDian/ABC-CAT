import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { QuestionModel } from '@/Models/Question';
import { InertiaLink } from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';
import parse from 'html-react-parser';
import { Inertia } from '@inertiajs/inertia';
import { Dialog, DialogContent } from '@mui/material';
import AdminShowLayout from '@/Layouts/AdminShowLayout';

interface Props {
  question: QuestionModel;
}

export default function Index(props: Props) {
  const question = props.question;
  return (
    <AdminShowLayout
      title={`Pertanyaan ${question.id}`}
      headerTitle={'Data Pertanyaan'}
      backRoute={route('question.index')}
      backRouteTitle="Kembali"
      editRoute={route('question.edit', question.id)}
      editRouteTitle="Edit"
      onDelete={() => {
        Inertia.post(route('question.destroy', question.id), {
          _method: 'DELETE',
        });
      }}
      deleteTitle="Hapus"
    >
      <div className="border-2 border-gray-200 p-5">
        <div className="prose mx-auto">{parse(question.content)}</div>
      </div>
    </AdminShowLayout>
  );
}
