<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recettes', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('contribuable');
            $table->string('adresse')->nullable();
            $table->string('service_emetteur')->nullable();
            $table->string('operateur')->nullable();
            $table->string('numero_transaction')->nullable();
            $table->string('type_taxe');
            $table->decimal('montant', 15, 2);
            $table->date('date_echeance');
            $table->enum('mode_paiement', ['especes', 'virement', 'mobile_money', 'cheque']);
            $table->enum('statut', ['en_attente', 'valide', 'paye', 'retard'])->default('en_attente');
            $table->date('date_paiement')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recettes');
    }
};
