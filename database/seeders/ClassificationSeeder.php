<?php

namespace Database\Seeders;

use App\Models\LearningPacket;
use App\Models\SubLearningPacket;
use App\Models\LearningCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */


    private $Classification = [
        [
            "name" => "Sekolah Kedinasan",
            "description" => "Sekolah Kedinasan",
            "sub_learning_packets" => [
                [
                    "name" => "SKD",
                    "learning_categories" => [
                        [
                            "name" => "Tes Wawasan Kebangsaan (TWK)",
                        ], [
                            "name" => "Tes Intelegensi Umum (TIU)",
                        ], [
                            "name" => "Tes Karakteristik Pribadi (TKP)",
                        ]
                    ]
                ], [
                    "name" => "Psikologi Kedinasan",
                    "learning_categories" => [
                        [
                            "name" => "Kecerdasan",
                        ], [
                            "name" => "Kecermatan",
                        ], [
                            "name" => "Kepribadian",
                        ]
                    ]
                ], [
                    "name" => "Bahasa Inggris",
                    "learning_categories" => [
                        [
                            "name" => "Bahasa Inggris",
                        ]
                    ]
                ]
            ]
        ], [
            "name" => "Kepolisian",
            "description" => "Kepolisian",
            "sub_learning_packets" => [
                [
                    "name" => "Akademik",
                    "learning_categories" => [
                        [
                            "name" => "Matematika",
                        ], [
                            "name" => "Bahasa Inggris",
                        ], [
                            "name" => "Bahasa Indonesia",
                        ], [
                            "name" => "Wawasan Kebangsaan",
                        ], [
                            "name" => "Pengetahuan Umum"
                        ]
                    ]
                ], [
                    "name" => "Psikologi Kepolisian",
                    "learning_categories" => [
                        [
                            "name" => "Kecerdasan"
                        ],[
                            "name" => "Kecermatan"
                        ],[
                            "name" => "Kepribadian"
                        ]
                    ],
                ],[
                    "name" => "Lain - lain",
                    "learning_categories"=> [
                        [
                            "name" => "Kesehatan Jiwa"
                        ],[
                            "name" => "Mental Ideologi"
                        ]
                    ]
                ]
            ]
        ]
    ];


    public function run(): void
    {
        //
        foreach ($this->Classification as $packet_item) {
            $packet = LearningPacket::create([
                    "name" => $packet_item["name"],
                    "description" => $packet_item["description"]
                ]);

            foreach ($packet_item["sub_learning_packets"] as $sub_packet_item) {
                $sub_packet = SubLearningPacket::create([
                    "name" => $sub_packet_item["name"],
                    "learning_packet_id" => $packet->id
                ]);

                foreach ($sub_packet_item["learning_categories"] as $category_item) {
                    LearningCategory::create([
                        "name" => $category_item["name"],
                        "sub_learning_packet_id" => $sub_packet->id
                    ]);
                }
            }
        }
        
    }
}
