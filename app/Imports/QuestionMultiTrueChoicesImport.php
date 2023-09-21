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

class QuestionMultiTrueChoicesImport implements
    WithStartRow,
    OnEachRow,
    WithHeadingRow,
    WithValidation
{
    private $bank_question;
    private $choice_count;

    public function __construct(BankQuestion $bank_question, int $choice_count)
    {
        $this->bank_question = $bank_question;
        $this->choice_count = $choice_count;
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

        $row_choices = [];
        $row_weight = [];

        for ($i = 1; $i <= $this->choice_count; $i++) {
            $row_choices[] = $row['pilihan_' . $i];
            $row_weight[] = $row['bobot_' . $i];
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
            'type' => 'WeightedChoice',
            'answer' => array_map(function ($choice) {
                return [
                    'weight' => floatval($choice),
                ];
            }, $row_weight),
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
            }, $row_choices),
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
        $item = (new BankQuestionItemController())->store(
            $request,
            $bank_question->learningCategory->SubLearningPacket->learningPacket
                ->id,
            $bank_question->learningCategory->sub_learning_packet_id,
            $bank_question->learning_category_id,
            $bank_question->id,
        );
    }

    public function rules(): array
    {
        $choices = array_map(function ($i) {
            return 'pilihan_' . $i;
        }, range(1, $this->choice_count));

        $weights = array_map(function ($i) {
            return 'bobot_' . $i;
        }, range(1, $this->choice_count));

        $default_rules = [
            'nama' => 'required',
            'pertanyaan' => 'required',
            'pembahasan' => 'required',
        ];

        return array_merge(
            $default_rules,
            array_combine(
                $choices,
                array_fill(0, $this->choice_count, 'required'),
            ),
            array_combine(
                $weights,
                array_fill(0, $this->choice_count, 'required'),
            ),
        );
    }
}
