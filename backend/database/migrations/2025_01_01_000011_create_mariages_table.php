<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('mariages', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->string('epoux_nom');
            $table->string('epoux_prenom');
            $table->date('epoux_date_naissance')->nullable();
            $table->string('epoux_nationalite')->nullable();
            $table->string('epoux_profession')->nullable();
            $table->string('epouse_nom');
            $table->string('epouse_prenom');
            $table->date('epouse_date_naissance')->nullable();
            $table->string('epouse_nationalite')->nullable();
            $table->string('epouse_profession')->nullable();
            $table->date('date_mariage');
            $table->string('lieu_mariage')->nullable();
            $table->string('commune')->nullable();
            $table->enum('regime_matrimonial', ['Communauté de biens', 'Séparation de biens', 'Polygamie'])->default('Séparation de biens');
            $table->string('temoin1_nom')->nullable();
            $table->string('temoin2_nom')->nullable();
            $table->enum('statut', ['Validé', 'En attente', 'Rejeté'])->default('Validé');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mariages');
    }
};
