import { Link } from "@inertiajs/react";
import { Button } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React from "react";

interface Props<T extends Record<string, any>> {
    title: string;
    
    createRoute?: string;
    createRouteTitle?: string;

    columns: MRT_ColumnDef<T>[];
    data: T[];
}
    

export default function TableCard<T extends Record<string, any>>(props: Props<T>) { 
    return (
        <div className="flex flex-col gap-3 m-8 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
            <div className="flex justify-between">
                <div className="text-2xl">{props.title}</div>
            </div>
            <div className="">
                <MaterialReactTable
                    columns={props.columns}
                    data={props.data}
                    enableColumnActions
                    enableColumnFilters
                    enablePagination
                    enableSorting
                    enableBottomToolbar
                    enableTopToolbar
                    enableRowActions
                    enableRowNumbers
                    muiTableBodyRowProps={{ hover: false }}
                    muiTableHeadCellProps={{
                        sx: {
                            fontWeight: 'bold',
                            fontSize: '16px',
                        },
                    }}
                    renderTopToolbarCustomActions={() => (
                        <div className="flex items-center justify-center gap-2">
                            {props.createRoute ? (
                                <Link href={props.createRoute}>
                                    <Button variant="contained" color="primary" size="large">
                                        {props.createRouteTitle ?? 'Tambah'}
                                    </Button>
                                </Link>
                            ) : null}
                        </div>
                    )}
                />
            </div>
        </div>
    )
}
