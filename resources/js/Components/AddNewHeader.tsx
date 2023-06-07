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
                <button
                    id={props.id}
                    type="button"
                    className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
                    onClick={props.onClick}
                >
                    {props.newIcon || null} Tambah
                </button>
            </div>
        </div>
    );
}
