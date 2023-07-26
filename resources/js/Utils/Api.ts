import { Inertia } from '@inertiajs/inertia';
import _ from 'lodash';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface ApiValue<T extends {}> extends T {
  _method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

function onError<T extends FieldValues>(form: UseFormReturn<T>) {
  return (errors: Record<string, string>) => {
    _.each(errors, (val, key) => {
      form.setError(key as any, { message: val, type: 'server' });
    });
  };
}

function post<T extends FieldValues>(
  route: string,
  value: ApiValue<T>,
  form: UseFormReturn<T>,
) {
  Inertia.post(route, value as any, {
    onError: onError(form),
  });
}

function put<T extends FieldValues>(
  route: string,
  value: ApiValue<T>,
  form: UseFormReturn<T>,
) {
  Inertia.put(route, value as any, { onError: onError(form) });
}

export default {
  post,
};
