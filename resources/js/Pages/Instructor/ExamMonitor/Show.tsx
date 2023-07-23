import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { ExamModel } from '@/Models/Exam';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Button } from '@mui/material';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import { useIdle, useInterval } from 'react-use';
import { AutoSizer, Grid, List, ScrollSync } from 'react-virtualized';
import route from 'ziggy-js';
import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url"

interface Props {
  exam: ExamModel;
}

export default function Show(props: Props) {
  const { exam } = props;
  console.log(workerUrl);

  const isIdle = useIdle(5000);
  const columnCount = 3;
  const re = React.useRef(0);

  useInterval(() => {
    if (!isIdle) {
      console.log('reloading', re);
      console.log(Inertia.reload({ only: ['exam'] }));
      re.current += 1;
    } else {
      console.log({isIdle});
    }
  }, 1000);

  return (
    <AdminShowLayout
      title="Bank Soal"
      headerTitle="Data Bank Soal"
      editRoute={route('bank-question.edit', exam.id)}
      backRoute={route('bank-question.index')}
    >
      <div className="flex">
        <div className=" text-lg">
          <p>{exam.user.name}</p>
          <p>{exam.user.email}</p>
          <p>Finished: {exam.finished}</p>
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
                        text = 'Benar';
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
                    height={500}
                    width={width}
                    rowHeight={40}
                    columnWidth={width / columnCount}
                    // overscanColumnCount={overscanColumnCount}
                    cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                      const it = exam.answers[rowIndex];

                      let text;
                      if (columnIndex == 0) {
                        text = rowIndex + 1;
                      } else if (columnIndex == columnCount - 1) {
                        text = `${it.answer == it.question.answer}`;
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
    </AdminShowLayout>
  );
}
