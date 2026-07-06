<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('depenses', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('objet');
            $table->string('fournisseur');
            $table->decimal('montant', 15, 2);
            $table->enum('chapitre', ['recettes', 'personnel', 'fonctionnement', 'investissement']);
            $table->string('article');
            $table->date('date_engagement');
            $table->text('description')->nullable();
            $table->enum('statut', ['en_attente', 'valide', 'engage', 'paye'])->default('en_attente');
            $table->date('date_paiement')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('depenses');
    }
};
