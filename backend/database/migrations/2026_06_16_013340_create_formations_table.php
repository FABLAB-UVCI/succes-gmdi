<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('organisme');
            $table->string('formateur')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->text('agents')->nullable();
            $table->decimal('cout', 12, 2)->default(0);
            $table->enum('statut', ['programme', 'en_cours', 'termine'])->default('programme');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('formations');
    }
};
