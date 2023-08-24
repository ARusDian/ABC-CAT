<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('learning_material_description_images', function (
            Blueprint $table,
        ) {
            $table->id();
            $table
                ->foreignId('learning_material_id')
                ->constrained(null, 'id', 'learning_material_id_fk')
                ->onDelete('cascade');
            $table
                ->foreignId('document_file_id')
                ->constrained()
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_material_description_images');
    }
};
