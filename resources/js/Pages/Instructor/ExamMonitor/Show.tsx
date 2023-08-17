import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { ExamModel } from '@/Models/Exam';
import { router } from '@inertiajs/react';
import React from 'react';
import { useIdle, useInterval } from 'react-use';
import { AutoSizer, Grid, List, ScrollSync } from 'react-virtualized';
import route from 'ziggy-js';

interface Props {
  exam: ExamModel;
}

export default function Show(props: Props) {
  const { exam } = props;
  const isIdle = useIdle(5000);
  const columnCount = 4;
  const re = React.useRef(0);

  useInterval(() => {
    if (!isIdle) {
      console.log('reloading', re);
      console.log(router.reload({ only: ['exam'] }));
      re.current += 1;
    } else {
      console.log({ isIdle });
    }
  }, 1000);
  const { learning_packet, sub_learning_packet, learning_category } =
    useDefaultClassificationRouteParams();
  const rowHeight = 80;

  return (
    <AdminShowLayout
      title="Monitor Latihan"
      headerTitle="Monitoring Ujian"
      backRoute={route('packet.sub.category.exercise.exam-monitor.index', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        exam.exercise_question_id,
      ])}
    >
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <div className="flex">
          <div className=" text-lg">
            <p>{exam.user.name}</p>
            <p>{exam.user.email}</p>
            <p>Selesai : {exam.finished ? new Date(exam.finished_at).toLocaleString() : "Belum Selesai"}</p>
          </div>
        </div>

        <div>
          <AutoSizer disableHeight>
            {({ width }) => (
              <ScrollSync>
                {({ scrollLeft }) => (
                  <div className="Table">
                    <Grid
                      height={40}
                      width={width}
                      rowHeight={40}
                      columnWidth={width / columnCount}
                      cellRenderer={({ columnIndex, key, style }) => {
                        let text;
                        if (columnIndex == 0) {
                          text = 'Nomor';
                        } else if (columnIndex == columnCount - 1) {
                          text = 'Lihat Soal'
                        } else if (columnIndex == columnCount - 2) {
                          text = 'Score';
                        } else {
                          text = `Nama soal`;
                        }

                        return (
                          <div key={key} style={style}>
                            {text}
                          </div>
                        );
                      }}
                      rowCount={1}
                      columnCount={columnCount}
                      scrollLeft={scrollLeft}
                    />

                    <Grid
                      height={rowHeight * exam.answers.length + 10}
                      width={width}
                      rowHeight={80}
                      columnWidth={width / columnCount}
                      // overscanColumnCount={overscanColumnCount}
                      cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                        const it = exam.answers[rowIndex];
                        let text;
                        console.log(it)
                        if (columnIndex == 0) {
                          text = rowIndex + 1;
                        } else if (columnIndex == columnCount - 1) {
                          text = (
                            <MuiInertiaLinkButton
                              href={route('packet.sub.category.bank-question.item.show', [
                                learning_packet, sub_learning_packet, learning_category, it.question.bank_question_id, it.bank_question_item_id
                              ])}
                              color="primary"
                            >
                              Lihat Soal
                            </MuiInertiaLinkButton>
                          );
                        } else if (columnIndex == columnCount - 2) {
                          text = it.score
                          // text = `${it.answer === it.question.answer.answer}`;
                        } else {
                          text = it.question.name;
                        }

                        return (
                          <div key={key} style={style}>
                            {text}
                          </div>
                        );
                      }}
                      rowCount={exam.answers.length}
                      columnCount={columnCount}
                      scrollLeft={scrollLeft}
                    />
                  </div>
                )}
              </ScrollSync>
            )}
          </AutoSizer>
        </div>
      </div>
    </AdminShowLayout>
  );
}
