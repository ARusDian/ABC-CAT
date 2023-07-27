import AdminTableLayout from "@/Layouts/Admin/AdminTableLayout";
import { LearningPacketModel } from "@/Models/LearningPacket";
import { Link } from "@inertiajs/react";
import { Button } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React from "react";
import route from "ziggy-js";

interface Props {
	learningPackets: LearningPacketModel[]
}

export default function Index({ learningPackets }: Props) {
	const dataColumns = [
		{
			Header: 'Nama',
			accessorKey: 'name',
		}, {
			Header: 'Deskripsi',
			accessorKey: 'description',
		},
	] as MRT_ColumnDef<LearningPacketModel>[];

	return (
		<AdminTableLayout
			title="Paket Belajar"
			addRoute={route('learning-packet.create')}
			addRouteTitle="Tambah Paket Belajar"
		>
			<MaterialReactTable
				columns={dataColumns}
				data={learningPackets}
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
				renderRowActions={({ row }) => (
					<div className="flex items-center justify-center gap-2">
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="large"
						>
							<Link href={route('learning-packet.show', row.original.id)}>
								Show
							</Link>
						</Button>
					</div>
				)}
			/>
		</AdminTableLayout>
	);
}
