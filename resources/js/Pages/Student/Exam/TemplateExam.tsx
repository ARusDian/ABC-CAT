import React from "react";
import ExamLayout from "@/Layouts/Student/ExamLayout";
import Countdown from 'react-countdown';
import { Button } from "@mui/material";

interface Props {
}

const questions = [
    {
        id: 1,
        question: "Apa yang anda lakukan ketika ada kesalahan dalam proses pengoperasian tambang?",
        answers: [
            {
                id: 1,
                answer: "Mengabaikannya",
                weight: 0
            }, {
                id: 2,
                answer: "Mencari solusi sendiri",
                weight: 0
            }, {
                id: 3,
                answer: "Meminta bantuan rekan kerja",
                weight: 0
            }, {
                id: 4,
                answer: "Melaporkan kesalahan ke supervisor",
                weight: 1
            }
        ]
    }, {
        id: 2,
        question: "Apa yang anda lakukan ketika ada kesalahan dalam proses pengoperasian minyak?",
        answers: [
            {
                id: 1,
                answer: "Mengabaikannya",
                weight: 0
            }, {
                id: 2,
                answer: "Mencari solusi sendiri",
                weight: 0
            }, {
                id: 3,
                answer: "Melaporkan kesalahan ke supervisor",
                weight: 1
            }, {
                id: 4,
                answer: "Meminta bantuan rekan kerja",
                weight: 0
            }
        ]
    }, {
        id: 3,
        question: "Apa yang anda lakukan ketika ada kesalahan dalam proses pengoperasian Laptop?",
        answers: [
            {
                id: 1,
                answer: "Mengabaikannya",
                weight: 0
            }, {
                id: 2,
                answer: "Melaporkan kesalahan ke supervisor",
                weight: 1
            }, {
                id: 3,
                answer: "Mencari solusi sendiri",
                weight: 0
            }, {
                id: 4,
                answer: "Meminta bantuan rekan kerja",
                weight: 0
            }
        ]
    }
];

export default function TemplateExam({ }: Props) {

    const time = Date.now() + 50000;

    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [answers, setAnswers] = React.useState<{
        questionId: number;
        flag: boolean;
        answerId: number;
    }[]>([]);


    const renderer = ({ hours, minutes, seconds, completed }: {
        hours: number;
        minutes: number;
        seconds: number;
        completed: boolean;
    }) => {
        if (completed) {
            // Render a completed state
            return <span>Waktu Selesai</span>;
        } else {
            // Render a countdown
            return <span>Sisa Waktu {hours}:{minutes}:{seconds}</span>;
        }
    };

    return (
        <ExamLayout title="Template Exam">
            <div className="flex justify-center mx-5 my-10">
                <div className="w-full h-auto border-2 border-black">
                    <div className="flex flex-col gap-5">
                        <div className="text-xl lg:text-xl font-bold flex justify-between p-3">
                            <div>Nama Ujian</div>
                            <div className="border border-gray-900 px-3">
                                <Countdown
                                    date={time}
                                    renderer={renderer}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col-reverse md:flex-row  border-t-2 border-gray-800">
                            <div className="w-full md:w-1/3 border-b-2 md:border-r-2 border-gray-800">
                                <div className="flex flex-col ">
                                    <div className="p-3  ">
                                        <span className="font-bold text-lg">Petunjuk Soal :</span>
                                        <p>
                                            1. Baca soal dengan teliti
                                        </p>
                                        <p>
                                            2. Pilih jawaban yang menurut anda benar
                                        </p>
                                        <p>
                                            3. Klik tombol "Kumpulkan Jawaban" untuk mengakhiri ujian
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-center p-3">
                                        <p className="font-bold text-lg">Navigasi Soal</p>
                                        <div className="p-2 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-10 gap-2">
                                            {Array.from(Array(questions.length).keys()).map((_, index) => (
                                                <Button
                                                    className="text-center border-2 border-gray-800 rounded-md p-2"
                                                    variant="contained"
                                                    color={answers[index]?.flag ? "warning" : answers[index]?.answerId ? "primary" : currentQuestion === index ? "success" : "inherit"}
                                                    onClick={() => setCurrentQuestion(index)}
                                                    key={index}
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="w-1/2"
                                            >
                                                Selesai Ujian
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-2/3 border-b-2 border-gray-800">
                                <div className="flex flex-col gap-5">
                                    <div className="flex justify-between p-3">
                                        <div className="font-bold text-lg">Soal {currentQuestion + 1}</div>
                                        <div className="font-bold text-lg">{`${currentQuestion + 1}/${questions.length}`}</div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-500 w-auto h-auto p-3 flex flex-col gap-3">
                                    <div className="text-md">
                                        {questions[currentQuestion].question}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {questions[currentQuestion].answers.map((answer, index) => (
                                            <div className="flex justify-between" key={index}>
                                                <div className="flex gap-3">
                                                    <input
                                                        type="radio"
                                                        name="answer"
                                                        onChange={() => {
                                                            const newAnswers = [...answers];
                                                            newAnswers[currentQuestion] = {
                                                                questionId: questions[currentQuestion].id,
                                                                flag: false,
                                                                answerId: answer.id
                                                            };
                                                            setAnswers(newAnswers);
                                                        }}
                                                        value={answer.id}
                                                        checked={answers[currentQuestion]?.answerId === answer.id}
                                                    />
                                                    <div className="text-md">
                                                        {answer.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            className="w-1/2"
                                            onClick={() => {
                                                const newAnswers = [...answers];
                                                newAnswers[currentQuestion] = {
                                                    answerId: newAnswers[currentQuestion]?.answerId,
                                                    questionId: questions[currentQuestion].id,
                                                    flag: !newAnswers[currentQuestion]?.flag,
                                                };
                                                setAnswers(newAnswers);
                                            }}
                                        >
                                            {answers[currentQuestion]?.flag ? "Batal Tandai" : "Tandai"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ExamLayout>
    )

}

