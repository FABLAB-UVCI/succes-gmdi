<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mouvements_caisse', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('libelle');
            $table->enum('type', ['encaissement', 'decaissement']);
            $table->decimal('montant', 15, 2);
            $table->decimal('solde_apres', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mouvements_caisse');
    }
};
