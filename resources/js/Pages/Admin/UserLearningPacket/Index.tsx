import MuiInertiaLinkButton from "@/Components/MuiInertiaLinkButton";
import AdminTableLayout from "@/Layouts/Admin/AdminTableLayout";
import { LearningPacketModel } from "@/Models/LearningPacket";
import { UserLearningPacketModel } from "@/Models/UserLearningPacket";
import { User } from "@/types";
import { router } from "@inertiajs/react";
import { Api } from "@mui/icons-material";
import { Button } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { useConfirm } from "material-ui-confirm";
import React from "react";
import route from "ziggy-js";

interface Props {
	learningPackets: Array<LearningPacketModel>;
}

export default function Index({ learningPackets }: Props) {

	const confirm = useConfirm();

	const columns = [
		{
			header: 'Nama',
			accessorKey: 'user.name',
		},
		{
			header: 'Email',
			accessorKey: 'user.email',
		},
		{
			header: 'Tanggal Berlangganan',
			accessorFn: ({ created_at }: UserLearningPacketModel) => new Date(created_at).toLocaleDateString(),
		}
	] as MRT_ColumnDef<UserLearningPacketModel>[];

	return (
		<AdminTableLayout
			title="Langganan Paket Belajar Pengguna"
			addRoute={route('user-learning-packet.create')}
			addRouteTitle="Tambah Paket Belajar Pengguna"
		>
			<div className="flex flex-col gap-3">
				{learningPackets.length > 0 ? (
					learningPackets.map(learningPacket => (
						<div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 w-full flex flex-col gap-3">
							<div className="flex justify-between">
								<h1 className="text-2xl font-bold">Paket Belajar {learningPacket.name}</h1>
								<MuiInertiaLinkButton
									href={route('user-learning-packet.create', {
										learning_packet: learningPacket.id,
									})}
								>
									Tambah Pengguna
								</MuiInertiaLinkButton>
							</div>
							<MaterialReactTable
								data={learningPacket.user_learning_packets ?? []}
								columns={columns}
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
									<div className="m-auto flex justify-center">
										<Button
											variant="contained"
											color="error"
											size="large"
											onClick={() => {
												confirm({
													title: 'Hentikan Berlangganan',
													description: 'Apakah anda yakin ingin menghentikan berlangganan?',
													cancellationText: 'Batal',
													confirmationText: 'Hentikan',
												}).then(() => {
													router.post(route('user-learning-packet.destroy', row.original.id), {
														_method: 'DELETE',
													});
												});
											}}
										>
											Hentikan Berlangganan
										</Button>
									</div>
								)}
							/>
						</div>
					))
				) : (
					<div className='flex justify-center'>
						<p className="text-3xl font-bold my-auto">
							Belum ada paket belajar yang dibuat
						</p>
					</div>
				)}
			</div>

		</AdminTableLayout>
	);
}
