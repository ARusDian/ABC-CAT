import React from 'react';
import route from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import QuestionEditor from '@/Components/QuestionEditor';
import { numberToUpperCase } from '@/Utils/Convert';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';
import { Tabs, Tab } from '@mui/material';

interface Props {
  item: BankQuestionItemModel;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className='px-5'>
          {children}
        </div>

      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Index(props: Props) {
  const item = props.item;
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
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
      <div className="">
        <div className="border-t pt-2">
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Soal" {...a11yProps(0)} />
            <Tab label="Pilihan Jawaban" {...a11yProps(1)} />
            <Tab label="Penjelasan" {...a11yProps(2)} />
          </Tabs>
        </div>
      </div>
      <CustomTabPanel value={tabValue} index={0}>
        <label className='text-lg'>Pertanyaan</label>
        <div className="mx-auto border rounded-2xl">
          <BankQuestionItemShow question={props.item} />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        {props.item.type == 'Pilihan' ? (
          <div className="">
            <label className='text-lg'>Pilihan Ganda :</label>
            {props.item.answers.choices.map((choice, index) => {
              return (
                <div key={index} className='mt-4'>
                  <label className='text-lg'>Pilihan {numberToUpperCase(index)}</label>
                  <div className="mx-auto border rounded-2xl">
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
          <div className="">
            <label className='text-lg'>Pilihan: </label>
            {props.item.answers.choices.map((choice, index) => {
              return (
                <div key={index} className='mt-3'>
                  <label className='text-lg'>Pilihan {numberToUpperCase(index)}</label>
                  <div className="mx-auto border rounded-2xl">{choice}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="">
            <label className='text-lg'>Jawaban</label>
            <div className="mx-auto border rounded-2xl">Essay</div>
          </div>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
      <div className="">
          <label  className='text-lg'>Jawaban Benar</label>
        <p>pilihan {numberToUpperCase(props.item.answer)}</p>
        {props.item.type == 'Pilihan' ? (
          <>
            <label className='text-lg'>Penjelasan Jawaban</label>
            <div className="mx-auto border rounded-2xl">
              <QuestionEditor
                content={props.item.explanation?.content ?? null}
                exerciseQuestionId={props.item.bank_question_id}
                disableEdit
              />
            </div>
          </>
        ) : null}
        </div>
      </CustomTabPanel>
    </AdminShowLayout>
  );
}