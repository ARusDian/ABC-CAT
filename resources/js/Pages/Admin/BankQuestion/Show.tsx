import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';
import InputError from '@/Components/Jetstream/InputError';
import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { ImportFileModel } from '@/Models/FileModel';
import Api from '@/Utils/Api';
import { Button, Modal } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import route from 'ziggy-js';

interface Props {
  bank_question: BankQuestionModel;
  import_failures?: any[];
}

interface QuestionImportForm extends ImportFileModel {
  type: string;
}

export default function Show(props: Props) {
  const { bank_question } = props;

  const import_failures = props.import_failures ?? [];

  const [openImportFailModal, setOpenImportFailModal] = React.useState(
    import_failures.length > 0,
  );

  useEffect(() => {
    setOpenImportFailModal(import_failures.length > 0);
  }, [JSON.stringify(import_failures)]);

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  const form = useForm<QuestionImportForm>({
    defaultValues: {
      type: 'Single',
    },
  });

  const [openImportModal, setOpenImportModal] = React.useState(false);

  async function onSubmit(value: any) {
    await Api.postAsync({
      route: route('packet.sub.category.bank-question.import', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        bank_question.id,
      ]),
      value,
      form,
    }).then(() => setOpenImportModal(false));
  }

  const [typeSelected, setTypeSelected] = React.useState('Single');

  const dataColumns = [
    {
      header: 'Nama',
      accessorKey: 'name',
    },
    {
      header: 'Tipe Jawaban',
      accessorFn(originalRow) {
        return originalRow.answer.type === 'Single'
          ? "Tunggal"
          : 'Ganda';
      },
    },
    {
      header: 'Status',
      accessorFn(originalRow) {
        return (<p
          className={`${originalRow.is_active ? 'text-green-500' : 'text-red-500' 
            } font-semibold`}
        >
          {originalRow.is_active ? "Aktif" : "Nonaktif"}
        </p>
        );
      },
    }
  ] as MRT_ColumnDef<BankQuestionItemModel>[];

  return (
    <AdminShowLayout
      title="Bank Soal"
      headerTitle="Data Bank Soal"
      editRoute={route('packet.sub.category.bank-question.edit', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        bank_question.id,
      ])}
      backRoute={route('packet.sub.category.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
      ])}
    >
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <div className=" text-lg">
          <p>{bank_question.name}</p>
          <p>Type: {bank_question.type}</p>
        </div>
        <div className="flex my-3">
          {bank_question.type === 'Pilihan' ? (
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={() => setOpenImportModal(true)}
            >
              Import Soal
            </Button>
          ) : (
            <div></div>
          )}
          <div className="flex place-content-end grow gap-2">
            <MuiInertiaLinkButton
              href={route('packet.sub.category.bank-question.item.create', [
                learning_packet_id,
                sub_learning_packet_id,
                learning_category_id,
                bank_question.id,
              ])}
              color="success"
            >
              Tambah Soal
            </MuiInertiaLinkButton>

            <MuiInertiaLinkButton
              href={route('packet.sub.category.exercise.import', [
                learning_packet_id,
                sub_learning_packet_id,
                learning_category_id,
                bank_question.id,
              ])}
              color="primary"
            >
              Buat Paket Soal
            </MuiInertiaLinkButton>
          </div>
        </div>
        <LazyLoadMRT
          columns={dataColumns}
          data={bank_question.items ?? []}
          enableColumnActions
          enableColumnFilters
          enablePagination
          enableSorting
          enableBottomToolbar
          enableTopToolbar
          enableRowActions
          enableRowNumbers
          muiTableBodyRowProps={{ hover: false }}
          renderRowActions={({ row }) => (
            <div className="flex items-center justify-center gap-2">
              <MuiInertiaLinkButton
                href={route('packet.sub.category.bank-question.item.show', [
                  learning_packet_id,
                  sub_learning_packet_id,
                  learning_category_id,
                  bank_question.id,
                  row.original.id,
                ])}
                color="primary"
              >
                Show
              </MuiInertiaLinkButton>
            </div>
          )}
          renderDetailPanel={({ row }) => {
            return (
              <div className="flex flex-col gap-1">
                <label className="text-lg">Pertanyaan</label>
                <div className="w-full border rounded-2xl p-5">
                  <BankQuestionItemShow
                    question={row.original}
                    editorClassName="h-full"
                  />
                </div>
              </div>
            );
          }}
        />
      </div>
      <Modal open={openImportModal} onClose={() => setOpenImportModal(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 bg-white shadow-2xl p-7 rounded-3xl">
          <form
            className="flex flex-col gap-5 py-5 justify-between h-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="">
              <Controller
                name="import_file"
                control={form.control}
                render={({ field }) => (
                  <input
                    type="file"
                    ref={field.ref}
                    className=""
                    required
                    onChange={e => {
                      field.onChange({
                        file: e.target.files![0],
                        path: '',
                        disk: 'public',
                      });
                    }}
                  />
                )}
              />
              <InputError
                message={form.formState.errors.import_file?.message}
                className="mt-2"
              />
            </div>
            <div className="">
              <label htmlFor="type">Tipe Soal Pilihan</label>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full"
                    required
                    onChange={e => {
                      field.onChange(e.target.value);
                      setTypeSelected(e.target.value);
                    }}
                  >
                    <option value="Single">Pembobotan Tunggal</option>
                    <option value="WeightedChoice">Pembobotan Ganda</option>
                  </select>
                )}
              />
              <InputError
                message={form.formState.errors.type?.message}
                className="mt-2"
              />
            </div>
            <div className="flex justify-between my-auto gap-3">
              {form.formState.isSubmitting ? (
                <ReactLoading color="#1964AD" type="spin" />
              ) : (
                <div className="my-auto">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="success"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? 'Importing...'
                      : 'Import Soal'}
                  </Button>
                </div>
              )}
              <MuiInertiaLinkButton
                href={route(
                  `packet.sub.category.bank-question.template-${typeSelected === 'Single' ? 'single' : 'multiple'
                  }`,
                  [
                    learning_packet_id,
                    sub_learning_packet_id,
                    learning_category_id,
                    bank_question.id,
                  ],
                )}
                color="secondary"
                isNextPage
              >
                Template
              </MuiInertiaLinkButton>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        open={openImportFailModal}
        onClose={() => setOpenImportFailModal(false)}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-5xl w-full bg-white shadow-2xl p-7 rounded-3xl">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-red-500">
              Import Data Pertanyaan Gagal
            </h1>
            <p className="text-gray-500">
              Berikut adalah daftar error yang terjadi saat melakukan import
              data pertanyaan, Pastikan data yang anda masukkan benar dan
              silahkan coba lagi!
            </p>
            <div className="flex flex-col gap-3">
              {import_failures.map((failure, index) => (
                <div className="flex flex-col gap-3" key={index}>
                  <p className="font-semibold">
                    {index + 1}. Error di{' '}
                    <span className="text-red-500">baris {failure.row}</span>{' '}
                    pada{' '}
                    <span className="text-red-500">
                      kolom {failure.attribute}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </AdminShowLayout>
  );
}
