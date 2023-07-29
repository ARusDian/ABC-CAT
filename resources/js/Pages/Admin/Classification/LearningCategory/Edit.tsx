import AdminFormLayout from "@/Layouts/Admin/AdminFormLayout";
import Api from "@/Utils/Api";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import route from "ziggy-js";
import Form from "./Form";
import { LearningCategoryModel, LearningCategoryFormModel } from "@/Models/LearningCategory";
import { usePage } from "@inertiajs/react";
import useDefaultClassificationRouteParams from "@/Hooks/useDefaultClassificationRouteParams";

interface Props {
    learningCategory: LearningCategoryModel;
}

export default function Edit({ learningCategory }: Props) {

    const {
        learning_packet,
        sub_learning_packet,
        learning_category,
    } = useDefaultClassificationRouteParams();

    let form = useForm<LearningCategoryFormModel>({
        defaultValues: learningCategory,
    });

    function onSubmit(e: LearningCategoryFormModel) {
        Api.post(route('packet.sub.category.update', {
            learning_packet: learning_packet,
            sub_learning_packet: sub_learning_packet,
            learning_category: learning_category,
        }), { ...e, _method: 'PUT' }, form);
    }

    return (
        <AdminFormLayout
            title="Edit Kategori Belajar"
            backRoute={route('packet.sub.category.show', {
                learning_packet: learning_packet,
                sub_learning_packet: sub_learning_packet,
                learning_category: learning_category,
            })}
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
                        color="warning"
                        size="large"
                        disabled={form.formState.isSubmitting}
                    >
                        Update
                    </Button>
                </div>
            </form>
        </AdminFormLayout>
    );
}
