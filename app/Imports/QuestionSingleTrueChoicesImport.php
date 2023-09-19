<?php

namespace App\Imports;

use App\Http\Controllers\BankQuestionItemController;
use App\Models\BankQuestion;
use App\Models\BankQuestionItem;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Request;

class QuestionSingleTrueChoicesImport implements
    OnEachRow,
    WithStartRow,
    WithHeadingRow,
    WithValidation
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
        return 5;
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

        $row_pilihan = [];

        for ($i = 1; $i <= 5; $i++) {
            $row_pilihan[] = $row['pilihan_' . $i];
        }

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

        $request = new \Illuminate\Http\Request([
            'bank_question_id' => $this->bank_question->id,
            'name' => $row['nama'],

            'type' => 'Pilihan',
            'question' => $formatted_question,
            'explanation' => $formatted_explanation,

            'answer' => $formatted_answer,
            'answers' => $choices_formatted,
        ]);


        $bank_question = $this->bank_question;
        $item = (new BankQuestionItemController)->store(
            $request,
            $bank_question->learningCategory->SubLearningPacket->learningPacket->id,
            $bank_question->learningCategory->sub_learning_packet_id,
            $bank_question->learning_category_id,
            $bank_question->id
        );
    }

    public function rules(): array
    {
        $choices
            = array_map(function ($i) {
                return 'pilihan_' . $i;
            }, range(1, 5));

        $default_rules = [
            'nama' => 'required',
            'pertanyaan' => 'required',
            'jawaban' => 'required|numeric|min:1|max:5',
            'pembahasan' => 'required',
        ];
        
        return array_merge($default_rules, array_combine($choices, array_fill(0, count($choices), 'required')));
    }
}
