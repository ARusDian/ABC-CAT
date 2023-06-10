import React from 'react';
import ExamLayout from '@/Layouts/Student/ExamLayout';
import Countdown from 'react-countdown';
import { Button } from '@mui/material';

interface Props {}

const questions = [
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
  },
];

export default function TemplateExam({}: Props) {
}
