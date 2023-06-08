import { Button } from '@mui/material';
import React, { MouseEventHandler, ReactNode } from 'react';

interface Props {
  title: ReactNode;
  onClick: MouseEventHandler;
  id: string;
  newIcon?: ReactNode;
  titleIcon?: ReactNode;
}
export default function AddNewHeader(props: Props) {
  return (
    <div className="flex justify-end gap-4">
      <label htmlFor={props.id}>
        {props.titleIcon || null} {props.title}
      </label>
      <div className="flex ">
        <Button
          id={props.id}
          type="button"
          onClick={props.onClick}
          variant="contained"
          color="primary"
          size="large"
        >
          {props.newIcon || null} Tambah
        </Button>
      </div>
    </div>
  );
}
