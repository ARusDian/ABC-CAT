declare module 'react-to-pdf' {
  import { RefObject } from 'react';

  function ReactToPdf(
    targetRef?: RefObject,
    filename?: string,
    x?: number,
    y?: number,
    options?: object,
    onComplete?: function,
    scale: number,
  ): ReactNode<{ toPdf: () => void; targetRef: MutableRefObject }>;

  export = ReactToPdf;
}
