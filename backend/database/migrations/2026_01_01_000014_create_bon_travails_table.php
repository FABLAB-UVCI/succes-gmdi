<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bon_travails', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 25)->unique();
            $table->string('demande_ref', 25)->nullable();
            $table->string('description', 500);
            $table->string('service', 100);
            $table->string('equipe', 200);
            $table->string('chef', 200);
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->string('materiaux', 400)->nullable();
            $table->enum('statut', ['planifie','en_cours','termine','suspendu'])->default('planifie');
            $table->timestamps();
            $table->index(['statut','service']);
        });
    }
    public function down(): void { Schema::dropIfExists('bon_travails'); }
};
