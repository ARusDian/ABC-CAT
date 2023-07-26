import { QuestionModel } from '@/Models/Question';
import React from 'react';
import route from 'ziggy-js';
import parse from 'html-react-parser';
import { router } from '@inertiajs/react';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import EditorInput from '@/Components/Tiptap/EditorInput';
import QuestionEditor from '@/Components/QuestionEditor';
import { numberToUpperCase } from '@/Utils/Convert';
import { QuestionShow } from '@/Components/QuestionShow';
import { Tabs, Tab, Button } from '@mui/material';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { Link } from '@inertiajs/react';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';
import BankQuestionItemEditor from '@/Components/BankQuestionItemEditor';

interface Props {
  question: BankQuestionItemModel;
  exercise_question_id: string;
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
      {value === index && <div className="px-5">{children}</div>}
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
  const { question, exercise_question_id } = props;
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <AdminShowLayout
      title={`Pertanyaan ${question.id}`}
      headerTitle={'Data Pertanyaan'}
      backRoute={route('exercise-question.show', [exercise_question_id])}
      backRouteTitle="Kembali"
      onDelete={() => {
        question.is_active
          ? router.delete(
              route('exercise-question.question.destroy', [
                exercise_question_id,
                question.id,
              ]),
            )
          : router.post(
              route('exercise-question.question.restore', [
                exercise_question_id,
                question.id,
              ]),
            );
      }}
      deleteTitle={question.is_active ? 'Hapus' : 'Restore'}
      onDeleteMessage={
        question.is_active
          ? `Ini akan menghapus pertanyaan.`
          : `Ini akan mengembalikan pertanyaan.`
      }
      isRestore={!question.is_active}
    >
      <div className="flex justify-end">
        <Button variant="contained" color="info" size="large">
          <Link
            href={route('bank-question.item.show', [
              question.bank_question_id,
              question.id,
            ])}
          >
            Bank Soal
          </Link>
        </Button>
      </div>
      <div className="border-t pt-2">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Soal" {...a11yProps(0)} />
          <Tab label="Pilihan Jawaban" {...a11yProps(1)} />
          <Tab label="Penjelasan" {...a11yProps(2)} />
        </Tabs>
      </div>
      <CustomTabPanel value={tabValue} index={0}>
        <label className="text-lg">Pertanyaan</label>
        <div className="mx-auto border rounded-lg">
          <BankQuestionItemShow question={props.question} />
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        {props.question.type == 'Pilihan' ? (
          <div className="border-2 border-gray-200 p-5">
            <label>Pilihan Ganda :</label>
            {props.question.answers.choices.map((choice, index) => {
              return (
                <div key={index}>
                  <label className="text-lg">
                    Pilihan {numberToUpperCase(index)}
                  </label>
                  <div className="mx-auto border rounded-lg">
                    <BankQuestionItemEditor
                      content={choice.content}
                      editorClassName="h-full"
                      disableEdit
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : props.question.type == 'Kecermatan' ? (
          <div className="border-2 border-gray-200 p-5">
            <label className="text-lg">Pilihan: </label>
            {props.question.answers.choices.map((choice, index) => {
              return (
                <div key={index}>
                  <label>Pilihan {numberToUpperCase(index)}</label>
                  <div className="mx-auto border rounded-lg">{choice}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border-2 border-gray-200 p-5">
            <label className="text-lg">Jawaban</label>
            <div className="mx-auto border rounded-lg">Essay</div>
          </div>
        )}
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        <div className="border-2 border-gray-200 p-5">
          <label className="text-lg">Jawaban Benar</label>
          <p>pilihan {numberToUpperCase(props.question.answer)}</p>
          {props.question.type == 'Pilihan' ? (
            <>
              <label className="text-lg">Penjelasan Jawaban</label>
              <div className="mx-auto border rounded-lg">
                <BankQuestionItemEditor
                  content={props.question.explanation?.content ?? null}
                  editorClassName="h-full"
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
