import AdminFormLayout from "@/Layouts/Admin/AdminFormLayout";
import Api from "@/Utils/Api";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import route from "ziggy-js";
import Form from "./Form";
import { SubLearningPacketFormModel } from "@/Models/SubLearningPacket";

interface Props {
	learning_packet_id: number;
}

export default function Create({ learning_packet_id }: Props) {
	let form = useForm<SubLearningPacketFormModel>({
		defaultValues: {
			name: '',
			learning_packet_id: learning_packet_id,
		},
	});

	function onSubmit(e: SubLearningPacketFormModel) {
		Api.post(route('packet.sub.store',
			[learning_packet_id]
		), e, form);
	}

	return (
		<AdminFormLayout
			title="Tambah Sub Paket Belajar"
			backRoute={route('packet.show',
				[learning_packet_id])}
			backRouteTitle="Kembali"
		>
			<form
				className="flex-col gap-5 py-5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Form form={form} className="my-5 mx-2" />
				<div className="flex justify-end">
					<Button
						type="submit"
						variant="contained"
						color="primary"
						size="large"
						disabled={form.formState.isSubmitting}
					>
						Submit
					</Button>
				</div>
			</form>
		</AdminFormLayout>
	);
}
