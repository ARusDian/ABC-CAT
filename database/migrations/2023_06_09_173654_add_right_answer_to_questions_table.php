<?php
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
        Schema::table('questions', function (Blueprint $table) {
            $table->string('type');
            $table->integer("time_limit");
            $table->decimal("weight");
            $table->json("answers");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn("type");
            $table->dropColumn("weight");
            $table->dropColumn("time_limit");
            $table->dropColumn("answers");
        });
    }
};
