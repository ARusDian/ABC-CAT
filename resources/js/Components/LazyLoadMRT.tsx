import React, { Suspense, useMemo } from 'react';
import ReactLoading from 'react-loading';
import MaterialReactTable, {
  MaterialReactTableProps,
} from 'material-react-table';
import type { Row, FilterFn } from '@tanstack/react-table';

interface Props<T extends Record<string, any>>
  extends MaterialReactTableProps<T> {
  enableDetailPanelSearch?: boolean;
  detailPanelSearchFields?: (keyof T | string)[];
}

export default function LazyLoadMRT<T extends Record<string, any>>(
  props: Props<T>,
) {
  const {
    enableDetailPanelSearch = false,
    detailPanelSearchFields = [],
    globalFilterFn,
    ...restProps
  } = props;

  // Helper untuk ekstrak teks dari HTML
  const extractTextFromHtml = (html: any): string => {
    if (!html) return '';
    if (typeof html !== 'string') return String(html);
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Helper untuk ambil nilai nested dari object
  const getNestedValue = (obj: any, path: string): any =>
    path.split('.').reduce((current, key) => current?.[key], obj);

  // Fungsi search rekursif
  const searchInObject = (obj: any, searchValue: string): boolean => {
    if (!obj) return false;
    if (typeof obj === 'string') {
      return extractTextFromHtml(obj).toLowerCase().includes(searchValue);
    }
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return String(obj).toLowerCase().includes(searchValue);
    }
    if (Array.isArray(obj)) {
      return obj.some(item => searchInObject(item, searchValue));
    }
    if (typeof obj === 'object') {
      return Object.values(obj).some(value =>
        searchInObject(value, searchValue),
      );
    }
    return false;
  };

  // Custom global filter function
  const enhancedGlobalFilterFn = useMemo<FilterFn<T> | undefined>(() => {
    if (!enableDetailPanelSearch) return undefined;

    const fn: FilterFn<T> = (row: Row<T>, _columnId, filterValue, _addMeta) => {
      const searchValue = String(filterValue ?? '').toLowerCase();

      if (typeof globalFilterFn === 'function') {
        const fn = globalFilterFn as unknown as FilterFn<T>;
        const customResult = fn(row as any, _columnId, filterValue, _addMeta);
        if (customResult) return true;
      }

      // Cek nilai kolom visible
      const visibleValues = Object.values(row.original ?? {}).some(value =>
        searchInObject(value, searchValue),
      );
      if (visibleValues) return true;

      // Cek nilai di detail panel fields
      if (detailPanelSearchFields.length > 0) {
        return detailPanelSearchFields.some(field => {
          const fieldValue = getNestedValue(row.original, field as string);
          return searchInObject(fieldValue, searchValue);
        });
      }

      // Fallback: search di seluruh objek
      return searchInObject(row.original, searchValue);
    };

    return fn;
  }, [enableDetailPanelSearch, detailPanelSearchFields, globalFilterFn]);

  return (
    <Suspense fallback={<ReactLoading color="#1964AD" type="spin" />}>
      <MaterialReactTable
        positionActionsColumn="last"
        enableGlobalFilter={
          enableDetailPanelSearch || restProps.enableGlobalFilter
        }
        filterFns={{
          enhancedGlobalFilter: enhancedGlobalFilterFn!,
        }}
        globalFilterFn={
          enableDetailPanelSearch ? 'enhancedGlobalFilter' : globalFilterFn
        }
        initialState={{
          ...restProps.initialState,
          ...(enableDetailPanelSearch && { showGlobalFilter: true }),
        }}
        {...restProps}
      />
    </Suspense>
  );
}
