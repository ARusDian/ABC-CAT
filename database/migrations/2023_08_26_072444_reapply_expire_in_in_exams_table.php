<?php

use App\Models\Exam;
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
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn('expire_in');
        });

        Schema::table('exams', function (Blueprint $table) {
            $table->timestampTz('expire_in');
        });

        Exam::query()->update([
            'expire_in' => \Carbon\Carbon::now()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
