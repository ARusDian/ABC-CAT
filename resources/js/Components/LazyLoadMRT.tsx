import MaterialReactTable, {
  MaterialReactTableProps,
} from 'material-react-table';
import React, { Suspense } from 'react';
import ReactLoading from 'react-loading';

interface Props<T extends Record<string, T>>
  extends MaterialReactTableProps<T extends Record<string, T> ? T : T> {}

export default function LazyLoadMRT<T>(
  props: Props<T extends Record<string, any> ? T : any>,
) {
  return (
    <Suspense fallback={<ReactLoading color="#1964AD" type="spin" />}>
      <MaterialReactTable positionActionsColumn="last" {...props} />
    </Suspense>
  );
}
