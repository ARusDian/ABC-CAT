
import DashboardLayout from "@/Layouts/Student/DashboardLayout";
import React from "react";

interface Props {

}

const exams = [
    {
        id: 1,
        question:
            'Apa yang anda lakukan ketika ada kesalahan dalam proses pengoperasian tambang?',
        answers: [
            {
                id: 1,
                answer: 'Mengabaikannya',
                weight: 0,
            },
            {
                id: 2,
                answer: 'Mencari solusi sendiri',
                weight: 0,
            },
            {
                id: 3,
                answer: 'Meminta bantuan rekan kerja',
                weight: 0,
            },
            {
                id: 4,
                answer: 'Melaporkan kesalahan ke supervisor',
                weight: 1,
            },
        ],
        answer: 1,
        explanation: 'Karena bla bla bla',
    },
    {
        id: 2,
        question:
            'Apa yang anda lakukan ketika ada kesalahan dalam proses pengoperasian minyak?',
        answers: [
            {
                id: 1,
                answer: 'Mengabaikannya',
                weight: 0,
            },
            {
                id: 2,
                answer: 'Mencari solusi sendiri',
                weight: 0,
            },
            {
                id: 3,
                answer: 'Melaporkan kesalahan ke supervisor',
                weight: 1,
            },
            {
                id: 4,
                answer: 'Meminta bantuan rekan kerja',
                weight: 0,
            },
        ],
        answer: 3,
        explanation: 'Karena bla bla bla',
    },
    {
        id: 3,
        question:
            'Apa yang anda lakukan ketika ada kesalahan dalam proses pengoperasian Laptop?',
        answers: [
            {
                id: 1,
                answer: 'Mengabaikannya',
                weight: 0,
            },
            {
                id: 2,
                answer: 'Melaporkan kesalahan ke supervisor',
                weight: 1,
            },
            {
                id: 3,
                answer: 'Mencari solusi sendiri',
                weight: 0,
            },
            {
                id: 4,
                answer: 'Meminta bantuan rekan kerja',
                weight: 0,
            },
        ],
        answer: 2,
        explanation: 'Karena bla bla bla',
    },
];

export default function Evaluation(props: Props) {
    return (
        <DashboardLayout
            title="Evaluasi"
        >
            <div className="flex flex-col">
                <div className="flex justify-between p-3">
                    <div className="text-4xl">
                        <span className="font-bold">Evaluasi </span>
                    </div>
                    <div className="text-lg">
                    </div>
                </div>
                <div className="border-t border-gray-500 w-auto h-auto p-3 flex flex-col gap-6">
                    {exams.map((exam, index) => (
                        <div className="flex flex-col gap-2" >
                            <div className="text-lg">
                                {index + 1}. {exam.question}
                            </div>
                            <div className="flex flex-col gap-3">
                                {exam.answers.map((answer, index) => {
                                    const isCorrect = answer.id === exam.answers.find((answer) => answer.weight > 0)?.id;
                                    return (
                                        (
                                            <div
                                                className={`rounded ${answer.id === exam.answer ? (
                                                    isCorrect ? "bg-green-200" : "bg-red-200"
                                                ) : isCorrect ? "bg-green-200" : ""}`}
                                                key={index}
                                            >
                                                <div className="flex gap-3 p-1">
                                                    <input
                                                        type="radio"
                                                        className="my-auto"
                                                        name={`answer-${exam.id}`}
                                                        value={answer.id}
                                                        checked={
                                                            answer.id === exam.answer
                                                        }
                                                    />
                                                    <div className="text-lg">{answer.answer}</div>
                                                </div>
                                            </div>
                                        )
                                    )
                                })}
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-md">
                                <div className="text-lg font-bold">
                                    Pembahasan :
                                </div>
                                <div className="text-lg">
                                    {exam.explanation}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
