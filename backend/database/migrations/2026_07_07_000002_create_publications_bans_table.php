<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('publications_bans', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->string('epoux_nom');
            $table->string('epouse_nom');
            $table->date('date_publication');
            $table->date('date_mariage_prevue')->nullable();
            $table->enum('statut', ['Publié', 'Célébré', 'Annulé'])->default('Publié');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publications_bans');
    }
};
