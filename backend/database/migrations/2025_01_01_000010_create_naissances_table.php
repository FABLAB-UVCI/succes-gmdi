<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('naissances', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance');
            $table->time('heure_naissance')->nullable();
            $table->enum('sexe', ['Masculin', 'Féminin'])->nullable();
            $table->string('lieu_naissance')->nullable();
            $table->string('commune')->nullable();
            $table->string('pere_nom')->nullable();
            $table->string('pere_profession')->nullable();
            $table->string('pere_nationalite')->nullable();
            $table->string('mere_nom')->nullable();
            $table->string('mere_profession')->nullable();
            $table->string('mere_nationalite')->nullable();
            $table->enum('type', ['Déclaration', 'Jugement', 'Adoption'])->default('Déclaration');
            $table->string('tribunal')->nullable();
            $table->date('date_jugement')->nullable();
            $table->enum('statut', ['Validé', 'En attente', 'Rejeté'])->default('Validé');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('naissances');
    }
};
