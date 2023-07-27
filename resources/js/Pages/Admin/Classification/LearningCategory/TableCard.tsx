import { Link } from "@inertiajs/react";
import { Button } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React from "react";
import route from "ziggy-js";

interface Props<T extends Record<string, any>> {
    title: string | JSX.Element;

    createRoute?: string;
    createRouteTitle?: string;

    columns: MRT_ColumnDef<T>[];
    data: T[];

    showRoute?: string;
    showRouteTitle?: string;

    isExpandable?: boolean;
    detailPanel?: (row: T) => JSX.Element;

    learningPacketId: number;
    subLearningPacketId: number;
    learningCategoryId: number;
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
                    enableExpanding={props.isExpandable}
                    enableExpandAll={props.isExpandable}
                    muiTableBodyRowProps={{ hover: false }}
                    muiTableHeadCellProps={{
                        sx: {
                            fontWeight: 'bold',
                            fontSize: '16px',
                        },
                    }}
                    renderDetailPanel={({ row }) => {
                        return props.detailPanel ? props.detailPanel(row.original) : null;
                    }}
                    renderTopToolbarCustomActions={() => (
                        <div className="flex items-center justify-center gap-2">
                            {props.createRoute ? (
                                <Link href={route(props.createRoute, [
                                    props.learningPacketId,
                                    props.subLearningPacketId,
                                    props.learningCategoryId,
                                ])}>
                                    <Button variant="contained" color="success" size="large">
                                        {props.createRouteTitle ?? 'Tambah'}
                                    </Button>
                                </Link>
                            ) : null}
                        </div>
                    )}
                    renderRowActions={({ row }) => (
                        <div className="flex items-center justify-center gap-2">
                            {
                                props.showRoute ? (
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                    >
                                        <Link href={route(props.showRoute, [
                                            props.learningPacketId,
                                            props.subLearningPacketId,
                                            props.learningCategoryId,
                                            row.original.id
                                        ])}>
                                            {props.showRouteTitle ?? 'Show'}
                                        </Link>
                                    </Button>
                                ) : null
                            }
                        </div>
                    )}
                />
            </div>
        </div>
    )
}
