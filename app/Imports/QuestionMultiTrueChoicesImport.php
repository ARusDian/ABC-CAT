<?php

namespace App\Imports;

use App\Models\BankQuestion;
use App\Models\BankQuestionItem;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class QuestionMultiTrueChoicesImport implements WithStartRow, OnEachRow, WithHeadingRow
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
        return 2;
    }

    /**
     * @return int
     */
    public function startRow(): int
    {
        return 3;
    }

    /**
     * @param array $row
     */
    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();
        $row      = $row->toArray();

        $row_choices = [
            $row["pilihan_1"],
            $row["pilihan_2"],
            $row["pilihan_3"],
            $row["pilihan_4"],
            $row["pilihan_5"],
        ];
        $row_weight = [
            $row["bobot_1"],
            $row["bobot_2"],
            $row["bobot_3"],
            $row["bobot_4"],
            $row["bobot_5"],
        ];

        $formatted_question = [
            "type" => "tiptap",
            "content" => [
                "type" => "doc",
                "content" => [
                    [
                        "type" => "paragraph",
                        "attrs" => [
                            "textAlign" => "left"
                        ],
                        "content" => [
                            [
                                "type" => "text",
                                "text" => $row["pertanyaan"]
                            ]
                        ]
                    ]
                ]
            ]
        ];
        
        $formatted_answer = [
            "type" => "WeightedChoice",
            "answer" => array_map(function ($choice) {
                return [
                    "weight" => floatval($choice)
                ];
            }, $row_weight)
        ];

        $formatted_explanation = [
            "type" => "tiptap",
            "content" => [
                "type" => "doc",
                "content" => [
                    [
                        "type" => "paragraph",
                        "attrs" => [
                            "textAlign" => "left"
                        ],
                        "content" => [
                            [
                                "type" => "text",
                                "text" => $row["pembahasan"]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $choices_formatted = [
            "choices" =>  array_map(function ($choice) {
                return [
                    "type" => "tiptap",
                    "content" => [
                        "type" => "doc",
                        "content" => [
                            [
                                "type" => "paragraph",
                                "attrs" => [
                                    "textAlign" => "left"
                                ],
                                "content" => [
                                    [
                                        "type" => "text",
                                        "text" => $choice
                                    ]
                                ]
                            ]
                        ]
                    ]
                ];
            }, $row_choices)
        ];

        $bank_question = BankQuestionItem::create([
            'bank_question_id' => $this->bank_question->id,
            'name' => $row["nama"],
            'weight' => $row["bobot"],

            'type' => 'Pilihan',
            'question' => $formatted_question,
            'explanation' => $formatted_explanation,

            'answer' => $formatted_answer,
            'answers' => $choices_formatted,
        ]);
    }
}
