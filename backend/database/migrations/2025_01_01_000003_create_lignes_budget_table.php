<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lignes_budget', function (Blueprint $table) {
            $table->id();
            $table->enum('chapitre', ['recettes', 'personnel', 'fonctionnement', 'investissement']);
            $table->string('article');
            $table->string('designation');
            $table->decimal('montant_previsionnel', 15, 2)->default(0);
            $table->decimal('montant_consomme', 15, 2)->default(0);
            $table->enum('statut', ['provisoire', 'approuve', 'rejete'])->default('provisoire');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lignes_budget');
    }
};
