import { useMemo } from 'react';
import {
  useSearchParam as useSearchParamOriginal,
  useLocation,
} from 'react-use';

export function useSearchParam(param: string) {
  const {} = useLocation();

  return useSearchParamOriginal(param);
}
