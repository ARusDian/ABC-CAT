import LazyLoadMRT from "@/Components/LazyLoadMRT";
import AdminTableLayout from "@/Layouts/Admin/AdminTableLayout";
import { User } from "@/types";
import { MRT_ColumnDef } from "material-react-table";
import React from "react";

interface UserActivity {
    id: number;
    description: string;
    causer: User;
    subject_type: string;
    created_at: string;
}

interface Props {
    activities: UserActivity[];
}

export default function UserActivityIndex({ activities }: Props) {

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
