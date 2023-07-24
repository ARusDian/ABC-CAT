import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { InertiaLink } from '@inertiajs/inertia-react';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import { useDefaultExerciseQuestionFormModel } from '@/Hooks/useDefaultExerciseQuestionForm';
import Form from './Form';
import {
  ExerciseQuestionFormModel,
  ExerciseQuestionModel,
} from '@/Models/ExerciseQuestion';
import FormHelperText from '@mui/material/FormHelperText';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from 'react-hook-form';

interface Props {
  bank_question: BankQuestionModel;
  exercise_questions: ExerciseQuestionModel[];
}

export default function Show(props: Props) {
  const { bank_question, exercise_questions } = props;
  const dataColumns = [
    {
      header: 'Nama',
      accessorKey: 'name',
    },
    {
      header: 'type',
      accessorKey: 'type',
    },
  ] as MRT_ColumnDef<BankQuestionItemModel>[];

  const [rowSelection, setRowSelection] = React.useState({});

  const [type, setType] = React.useState(1);
  const [exerciseId, setExerciseId] = React.useState<string | null>(
    exercise_questions?.at(0)?.id ?? null,
  );

  const form = useForm<ExerciseQuestionFormModel>({
    defaultValues: {
      name: '',
      type: bank_question.type,
      time_limit: 120,
      number_of_question: 50,
    },
  });

  function onSubmit(e: ExerciseQuestionFormModel) {
    const bank_question_items = Object.entries(rowSelection)
      .filter(([_, it]) => it)
      .map(([it, _]) => it);

    if (type == 1) {
      Inertia.post(
        route('exercise-question.store', [exerciseId!]),
        {
          ...e,
          bank_question_items,
        } as any,
        {
          onError: e => {
            console.log(e);
          },
        },
      );
    } else if (type == 2) {
      Inertia.post(
        route('exercise-question.import.update', [exerciseId!]),
        {
          _method: 'PUT',
          bank_question_items,
        } as any,
        {
          onError: e => {
            console.log(e);
          },
        },
      );
    }
  }

  return (
    <AdminFormLayout
      title="Latihan Soal"
      // headerTitle="Import Latihan Soal"
      // editRoute={route('bank-question.edit', bank_question.id)}
      backRoute={route('bank-question.index')}
    >
      {/* {exercise_questions && exercise_questions?.length > 0 ? ( */}
      <div className='flex flex-col gap-3 my-3'>
        <Select
          label="Tipe"
          value={type}
          onChange={e => setType(e.target.value as number)}
        >
          <MenuItem value={1}>Buat Baru</MenuItem>
          <MenuItem value={2}>Sudah Ada</MenuItem>
        </Select>

        {type == 1 ? (
          <Form form={form} />
        ) : (
          <>
            <Select
              label="Soal Latihan"
              value={exerciseId}
              onChange={e => setExerciseId(e.target.value as string)}
            >
              {exercise_questions?.map(it => (
                <MenuItem key={it.id} value={it.id}>
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </div>  
      <MaterialReactTable
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
        enableRowSelection
        enableSelectAll
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        getRowId={original => original.id as any}
        muiTableBodyRowProps={{ hover: false }}
        renderRowActions={({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <InertiaLink
              href={route('bank-question.item.show', [
                bank_question.id,
                row.original.id,
              ])}
              className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
            >
              Show
            </InertiaLink>
          </div>
        )}
        renderTopToolbarCustomActions={() => (
          <div className='flex gap-3 justify-around'>
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                if (Object.keys(rowSelection).length == 0) {
                  const obje = Object.fromEntries(
                    bank_question?.items?.map(it => [it.id, true]) ?? [],
                  );
                  setRowSelection(obje);
                } else {
                  setRowSelection({});
                }
              }}
            >
              Pilih Semua
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={form.handleSubmit(onSubmit)}>
              Buat
            </Button>
          </div>
        )}
      />
    </AdminFormLayout>
  );
}
