import React, { PropsWithChildren } from 'react';

interface Props {
  value?: string;
  htmlFor?: string;
}

export default function InputLabel({
  value,
  htmlFor,
  children,
}: PropsWithChildren<Props>) {
  return (
    <label
      className="block font-medium text-md text-black mt-3"
      htmlFor={htmlFor}
    >
      {value || children}
    </label>
  );
}
