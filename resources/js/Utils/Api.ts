import { router } from '@inertiajs/react';
import _ from 'lodash';
import { FieldValues, UseFormReturn } from 'react-hook-form';

type ApiValue<T> = T & {
  _method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

interface ApiProps<T extends FieldValues> {
  route: string;
  value: ApiValue<T>;
  form: UseFormReturn<T>;
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
  router.post(route, value as any, {
    onError: onError(form),
  });
}

function postAsync<T extends FieldValues>({ route, value, form }: ApiProps<T>) {
  return new Promise((resolve, reject) => {
    router.post(route, value as any, {
      onFinish: resolve,
      onError: e => {
        onError(form);
        reject(e);
      },
    });
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
  postAsync,
  put,
};
