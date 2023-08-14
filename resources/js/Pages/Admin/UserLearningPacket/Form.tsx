import InputError from '@/Components/Jetstream/InputError';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { UserLearningPacketFormModel } from '@/Models/UserLearningPacket';
import { User } from '@/types';
import { InputLabel } from '@mui/material';
import Select from 'react-select';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<UserLearningPacketFormModel>;
  users: Array<User>;
  learningPackets: Array<LearningPacketModel>;
  className?: string;
}

export default function Form({
	form,
	users,
	learningPackets,
	className,
}: Props) {

	return (
		<div className={`flex-col gap-5 ${className}`}>
			<div className="form-control w-full mt-4">
				<Controller
					control={form.control}
					name="user"
					render={({ field }) => {
						return (
							<>
								<InputLabel htmlFor="user">Pengguna</InputLabel>
								<Select
									ref={field.ref}
									options={users}
									getOptionValue={it => it.id + ''}
									getOptionLabel={it => it.name}
									value={field.value}
									onChange={value => {
										field.onChange(value!);
									}}
								/>
								<InputError
									message={form.formState.errors.user?.message}
									className="mt-2"
								/>
							</>
						);
					}}
				/>
			</div>
			<div className="form-control w-full mt-4">
				<Controller
					control={form.control}
					name="learning_packet"
					render={({ field }) => {
						return (
							<>
								<InputLabel htmlFor="roles">Paket Belajar</InputLabel>
								<Select
									ref={field.ref}
									options={learningPackets}
									getOptionValue={it => it.id + ''}
									getOptionLabel={it => it.name}
									value={field.value}
									onChange={value => {
										field.onChange(value!);
									}}
								/>
								<InputError
									message={form.formState.errors.learning_packet?.message}
									className="mt-2"
								/>
							</>
						);
					}}
				/>
			</div>
			<div className="form-control w-full mt-4">
				<Controller
					control={form.control}
					name="subscription_date"
					render={({ field }) => {
						return (
							<>
								<InputLabel htmlFor="subscription_date">Tanggal Berlangganan</InputLabel>
								<input
									type="date"
									className="mt-1 block w-full"
									{...field}
								/>
								<InputError
									message={form.formState.errors.subscription_date?.message}
									className="mt-2"
								/>
							</>
						);
					}}
				/>
			</div>
		</div>
	)
}
