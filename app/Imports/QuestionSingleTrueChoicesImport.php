<?php

namespace App\Imports;

use App\Models\BankQuestion;
use App\Models\BankQuestionItem;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class QuestionSingleTrueChoicesImport implements
    WithStartRow,
    OnEachRow,
    WithHeadingRow
{
    private $bank_question;

    public function __construct(BankQuestion $bank_question)
    {
        $this->bank_question = $bank_question;
    }

    /**
     * @return int
     */
    public function headingRow(): int
    {
        return 4;
    }

    /**
     * @return int
     */
    public function startRow(): int
    {
        return 6;
    }

    /**
     * @param array $row
     */
    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();
        $row = $row->toArray();

        $row_pilihan = [
            $row['pilihan_1'],
            $row['pilihan_2'],
            $row['pilihan_3'],
            $row['pilihan_4'],
            $row['pilihan_5'],
        ];

        $formatted_question = [
            'type' => 'tiptap',
            'content' => [
                'type' => 'doc',
                'content' => [
                    [
                        'type' => 'paragraph',
                        'attrs' => [
                            'textAlign' => 'left',
                        ],
                        'content' => [
                            [
                                'type' => 'text',
                                'marks' => [
                                    [
                                        'type' => 'textStyle',
                                        'attrs' => [
                                            'fontFamily' => null,
                                            'fontSize' => '16pt',
                                        ],
                                    ],
                                ],
                                'text' => $row['pertanyaan'],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $formatted_answer = [
            'type' => 'Single',
            'answer' => intval($row['jawaban']) - 1,
        ];

        $formatted_explanation = [
            'type' => 'tiptap',
            'content' => [
                'type' => 'doc',
                'content' => [
                    [
                        'type' => 'paragraph',
                        'attrs' => [
                            'textAlign' => 'left',
                        ],
                        'content' => [
                            [
                                'type' => 'text',
                                'marks' => [
                                    [
                                        'type' => 'textStyle',
                                        'attrs' => [
                                            'fontFamily' => null,
                                            'fontSize' => '16pt',
                                        ],
                                    ],
                                ],
                                'text' => $row['pembahasan'],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $choices_formatted = [
            'choices' => array_map(function ($choice) {
                return [
                    'type' => 'tiptap',
                    'content' => [
                        'type' => 'doc',
                        'content' => [
                            [
                                'type' => 'paragraph',
                                'attrs' => [
                                    'textAlign' => 'left',
                                ],
                                'content' => [
                                    [
                                        'type' => 'text',
                                        'marks' => [
                                            [
                                                'type' => 'textStyle',
                                                'attrs' => [
                                                    'fontFamily' => null,
                                                    'fontSize' => '16pt',
                                                ],
                                            ],
                                        ],
                                        'text' => $choice,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ];
            }, $row_pilihan),
        ];

        $bank_question = BankQuestionItem::create([
            'bank_question_id' => $this->bank_question->id,
            'name' => $row['nama'],

            'type' => 'Pilihan',
            'question' => $formatted_question,
            'explanation' => $formatted_explanation,

            'answer' => $formatted_answer,
            'answers' => $choices_formatted,
        ]);
    }
}
