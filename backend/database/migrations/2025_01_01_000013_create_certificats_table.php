<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('certificats', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->enum('type', ['Naissance', 'Mariage', 'Décès', 'Résidence', 'Vie', 'Célibat'])->default('Naissance');
            $table->string('beneficiaire_nom');
            $table->string('beneficiaire_prenom')->nullable();
            $table->string('acte_reference')->nullable();
            $table->string('demandeur_nom')->nullable();
            $table->string('motif')->nullable();
            $table->date('date_delivrance');
            $table->enum('statut', ['Délivré', 'En attente', 'Annulé'])->default('Délivré');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificats');
    }
};
