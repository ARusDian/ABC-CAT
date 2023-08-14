import React from 'react';
import route, { RouteParams } from 'ziggy-js';

import { User } from '@/types';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import Api from '@/Utils/Api';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { UserLearningPacketFormModel } from '@/Models/UserLearningPacket';
import { usePage } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';

interface Props {
	users: Array<User>;
	learningPackets: Array<LearningPacketModel>;
}

export default function Create({ users, learningPackets }: Props) {
	const route = useRoute();

	const params: RouteParams & {
		user?: string;
		learning_packet?: string;
	} = route().params;

	let form = useForm<UserLearningPacketFormModel>({
		defaultValues: {
			user: params.user
				? users.find(it => it.id.toString() === params.user)
				: {},
			learning_packet: params.learning_packet
				? learningPackets.find(
					it => it.id.toString() === params.learning_packet,
				)
				: {},
			subscription_date: new Date().toDateString(),

		},
	});

	function onSubmit(e: UserLearningPacketFormModel) {
		Api.post(route('user-learning-packet.store'), e, form);
	}

	return (
		<AdminFormLayout
			title="Tambah Paket Belajar Pengguna"
			backRoute={route('user-learning-packet.index')}
			backRouteTitle="Kembali"
		>
			<form
				className="flex-col gap-5 py-5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Form
					form={form}
					users={users}
					learningPackets={learningPackets}
					className="my-5 mx-2"
				/>
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
