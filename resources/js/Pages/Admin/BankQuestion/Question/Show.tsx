import React from 'react';
import route from 'ziggy-js';
import { router } from '@inertiajs/react';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import QuestionEditor from '@/Components/QuestionEditor';
import { numberToUpperCase } from '@/Utils/Convert';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';
import { Tabs, Tab } from '@mui/material';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

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
  const item = props.item;

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    learning_packet_id,
    sub_learning_packet_id,
    learning_category_id
  } =
    useDefaultClassificationRouteParams();

  const getMostRightAnswer = () => {
    if (item.answer.type == 'WeightedChoice') {
      let max = 0;
      let maxIndex = 0;
      item.answer.answer.forEach((answer, index) => {
        if (answer.weight > max) {
          max = answer.weight;
          maxIndex = index;
        }
      });
      return maxIndex;
    } else {
      return item.answer.answer;
    }
  };
  return (
    <AdminShowLayout
      title={`Pertanyaan ${item.id}`}
      headerTitle={'Data Pertanyaan'}
      backRoute={route('packet.sub.category.bank-question.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        item.bank_question_id,
      ])}
      backRouteTitle="Kembali"
      editRoute={route('packet.sub.category.bank-question.item.edit', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        item.bank_question_id,
        item.id,
      ])}
      editRouteTitle="Edit"
      onDelete={() => {
        item.is_active
          ? router.delete(
            route('packet.sub.category.bank-question.item.destroy', [
              learning_packet_id,
              sub_learning_packet_id,
              learning_category_id,
              item.bank_question_id,
              item.id,
            ]),
          )
          : router.post(
            route('packet.sub.category.bank-question.item.restore', [
              learning_packet_id,
              sub_learning_packet_id,
              learning_category_id,
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
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
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
          <label className="text-lg">Pertanyaan</label>
          <div className="mx-auto border rounded-2xl p-5">
            <BankQuestionItemShow
              question={props.item}
              editorClassName="h-full"
            />
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          {props.item.type == 'Pilihan' ? (
            <div className="">
              <label className="text-lg">Pilihan Ganda :</label>
              {props.item.answers.choices.map((choice, index) => {
                return (
                  <div key={index} className="mt-4">
                    <label className="text-lg">
                      Pilihan {numberToUpperCase(index)}
                    </label>
                    {props.item.answer.type == 'WeightedChoice' ? (
                      <div>Bobot: {props.item.answer.answer[index].weight}</div>
                    ) : null}
                    <div className="mx-auto border rounded-2xl p-5  ">
                      <QuestionEditor
                        content={choice.content}
                        exerciseQuestionId={props.item.bank_question_id}
                        editorClassName="h-10 h-full"
                        disableEdit
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : props.item.type == 'Kecermatan' ? (
            <div className="">
              <label className="text-lg">Pilihan: </label>
              {props.item.answers.choices.map((choice, index) => {
                console.log(item.answer.answer);
                return (
                  <div key={index} className="mt-3">
                    <label className="text-lg">
                      Pilihan {numberToUpperCase(index)}
                    </label>
                    {props.item.answer.type == 'WeightedChoice' ? (
                      <div>Bobot: {props.item.answer.answer[index].weight}</div>
                    ) : null}
                    <div className="mx-auto border rounded-2xl p-5 text-xl">
                      {choice}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="">
              <label className="text-lg">Jawaban</label>
              <div className="mx-auto border rounded-2xl p-5">Essay</div>
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <div className="">
            {props.item.type == 'Pilihan' ? (
              <>
                <>
                  <label className="text-lg">Jawaban Benar</label>
                  <p className='font-bold'>Pilihan {numberToUpperCase(getMostRightAnswer())}</p>
                </>
                <label className="text-lg">Penjelasan Jawaban</label>
                <div className="mx-auto border rounded-2xl p-5">
                  <QuestionEditor
                    content={props.item.explanation?.content ?? null}
                    exerciseQuestionId={props.item.bank_question_id}
                    editorClassName="h-full"
                    disableEdit
                  />
                </div>
              </>
            ) : null}
          </div>
        </CustomTabPanel>
      </div>
    </AdminShowLayout>
  );
}
