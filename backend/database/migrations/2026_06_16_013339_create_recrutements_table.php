<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('recrutements', function (Blueprint $table) {
            $table->id();
            $table->string('poste');
            $table->string('direction');
            $table->integer('nb_postes');
            $table->enum('type', ['concours', 'direct', 'stage']);
            $table->date('cloture');
            $table->integer('candidatures')->default(0);
            $table->enum('statut', ['en_cours', 'termine', 'annule'])->default('en_cours');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('recrutements');
    }
};
