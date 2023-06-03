import InputError from "@/Components/Jetstream/InputError";
import InputLabel from "@/Components/Jetstream/InputLabel";
import TextEditorInput from "@/Components/TextEditorInput";
import { BaseQuestionModel } from "@/Models/Question";
import { InertiaFormProps } from "@inertiajs/inertia-react";
import React, { useEffect, useRef, useState } from "react";

interface Props {
    form: InertiaFormProps<BaseQuestionModel>,
    className?: string,
}

export default function Form(props: Props) {
    const form = props.form;
    const [images, setImages] = useState<string[]>([]);
    const editorRef = useRef();

    useEffect(() => {
        form.setData('images', images)
    }, [images])

    return (
        <div className={`flex-col gap-5 ${props.className}`}>
            <div className="form-control w-full mt-4">
                <InputLabel htmlFor="name">Content</InputLabel>
                <TextEditorInput
                    contentValue={form.data.content}
                    contentValueHandler={(value: unknown) => form.setData('content', value as string)}
                    imageValue={form.data.images ?? []}
                    imageValueHandler={setImages}
                    editorRef={editorRef}
                />
                <InputError className="mt-2" message={form.errors.content} />
            </div>
        </div>
    )
}
