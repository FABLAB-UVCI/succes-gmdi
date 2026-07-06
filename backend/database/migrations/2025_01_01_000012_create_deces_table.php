<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('deces', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance')->nullable();
            $table->date('date_deces');
            $table->time('heure_deces')->nullable();
            $table->string('lieu_deces')->nullable();
            $table->string('commune')->nullable();
            $table->string('cause_deces')->nullable();
            $table->string('declarant_nom')->nullable();
            $table->string('declarant_lien')->nullable();
            $table->enum('statut', ['Validé', 'En attente', 'Rejeté'])->default('Validé');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deces');
    }
};
