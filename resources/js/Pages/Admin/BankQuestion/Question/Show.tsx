import React from 'react';
import route from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import QuestionEditor from '@/Components/QuestionEditor';
import { numberToUpperCase } from '@/Utils/Convert';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';

interface Props {
  item: BankQuestionItemModel;
}

export default function Index(props: Props) {
  const item = props.item;
  return (
    <AdminShowLayout
      title={`Pertanyaan ${item.id}`}
      headerTitle={'Data Pertanyaan'}
      backRoute={route('bank-question.show', [
        item.bank_question_id,
      ])}
      backRouteTitle="Kembali"
      editRoute={route('bank-question.item.edit', [
        item.bank_question_id,
        item.id,
      ])}
      editRouteTitle="Edit"
      onDelete={() => {
        item.is_active
          ? Inertia.delete(
              route('bank-question.item.destroy', [
                item.bank_question_id,
                item.id,
              ]),
            )
          : Inertia.post(
              route('bank-question.item.restore', [
                item.bank_question_id,
                item.id,
              ]),
            );
      }}
      deleteTitle={item.is_active ? 'Hapus' : 'Restore'}
      onDeleteMessage={
        item.is_active
          ? `Ini akan menghapus pertanyaan.`
          : `Ini akan mengembalikan pertanyaan.`
      }
      isRestore={!item.is_active}
    >
      <div className="border-2 border-gray-200 p-5">
        <label>Pertanyaan</label>
        <div className="mx-auto border">
          <BankQuestionItemShow question={props.item} />
        </div>
      </div>
      {props.item.type == 'Pilihan' ? (
        <div className="border-2 border-gray-200 p-5">
          <label>Pilihan Ganda :</label>
          {props.item.answers.choices.map((choice, index) => {
            return (
              <div key={index}>
                <label>Pilihan {numberToUpperCase(index)}</label>
                <div className="mx-auto border">
                  <QuestionEditor
                    content={choice.content}
                    exerciseQuestionId={props.item.bank_question_id}
                    disableEdit
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : props.item.type == 'Kecermatan' ? (
        <div className="border-2 border-gray-200 p-5">
          <label>Pilihan: </label>
          {props.item.answers.choices.map((choice, index) => {
            return (
              <div key={index}>
                <label>Pilihan {numberToUpperCase(index)}</label>
                <div className="mx-auto border">{choice}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-2 border-gray-200 p-5">
          <label>Jawaban</label>
          <div className="mx-auto border">Essay</div>
        </div>
      )}
      <div className="border-2 border-gray-200 p-5">
        <label>Jawaban Benar</label>
        <p>pilihan {numberToUpperCase(props.item.answer)}</p>
        {props.item.type == 'Pilihan' ? (
          <>
            <label>Penjelasan Jawaban</label>
            <div className="mx-auto border">
              <QuestionEditor
                content={props.item.explanation?.content ?? null}
                exerciseQuestionId={props.item.bank_question_id}
                disableEdit
              />
            </div>
          </>
        ) : null}
      </div>
    </AdminShowLayout>
  );
}
