<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conges', function (Blueprint $table) {
            $table->id();
            $table->string('matricule');
            $table->string('agent');
            $table->enum('type', ['annuel', 'maladie', 'maternite', 'paternite', 'deces', 'autre']);
            $table->date('date_debut');
            $table->integer('duree');
            $table->string('motif')->nullable();
            $table->string('piece_jointe')->nullable();
            $table->enum('statut', ['soumis', 'approuve', 'refuse', 'en_cours'])->default('soumis');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('conges');
    }
};
