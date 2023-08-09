import LazyLoadMRT from "@/Components/LazyLoadMRT";
import AdminTableLayout from "@/Layouts/Admin/AdminTableLayout";
import { User } from "@/types";
import { MRT_ColumnDef } from "material-react-table";
import React from "react";

interface UserActivity {
    id: number;
    description: string;
    causer: User;
    properties: {
        method : "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "FORCE_DELETE";
    };
    subject_type: string;
    created_at: string;
}

interface Props {
    activities: UserActivity[];
}

const color = {
    CREATE: 'text-green-500',
    UPDATE: 'text-yellow-500',
    DELETE: 'text-red-400',
    RESTORE: 'text-blue-500',
    FORCE_DELETE: 'text-red-600',
}
export default function UserActivityIndex({ activities }: Props) {

    console.log(activities);

    const columns = [
        {
            header: 'Akun',
            accessorKey: 'causer.name',
        }, {
            header: 'Subjek',
            accessorFn: (originalRow: UserActivity) => {
                return originalRow.subject_type.replace('App\\Models\\', '')
            },
        }, {
            header: 'Method',
            accessorFn: (originalRow: UserActivity) => {
                return (
                    <p className={color[originalRow.properties.method]}>
                        {originalRow.properties.method}
                    </p>
                )
            }
        }, {
            header: 'Waktu',
            accessorFn: (originalRow: UserActivity) => {
                return new Date(originalRow.created_at).toLocaleDateString("id") + '-' + new Date(originalRow.created_at).toLocaleTimeString("id");
            }
        }

    ] as MRT_ColumnDef<UserActivity>[];
    return (
        <AdminTableLayout
            title="User Activity"
        >
            <div className="mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 w-full flex flex-col gap-3">
                <LazyLoadMRT
                    data={activities}
                    columns={columns}
                    enableColumnActions
                    enableColumnFilters
                    enablePagination
                    enableSorting
                    enableBottomToolbar
                    enableTopToolbar
                    enableRowNumbers
                    enableExpanding
                    enableExpandAll
                    muiTableBodyRowProps={{ hover: false }}
                    muiTableHeadCellProps={{
                        sx: {
                            fontWeight: 'bold',
                            fontSize: '16px',
                        },
                    }}
                    renderDetailPanel={(row) => {
                        return (
                            <p className="flex justify-center">
                                {row.row.original.description}
                            </p>
                        )
                    }}
                />
            </div>
        </AdminTableLayout>
    )
}
