<?php

use App\Enums\QuestionTypeEnum;
use App\Models\Question;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        \DB::table('questions')->where([
            'type' => 'pilihan'
        ])->update([
            'type' => "Pilihan"
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \DB::table('questions')->where([
            'type' => "Pilihan",
        ])->update([
            'type' => 'pilihan'
        ]);
    }
};
