import { router } from '@inertiajs/react';
import _ from 'lodash';
import { FieldValues, UseFormReturn } from 'react-hook-form';

type ApiValue<T> = T & {
  _method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

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
  router.post(route, value as any, {
    onError: onError(form),
  });
}

function put<T extends FieldValues>(
  route: string,
  value: ApiValue<T>,
  form: UseFormReturn<T>,
) {
  router.put(route, value as any, { onError: onError(form) });
}

export default {
  post,
};
