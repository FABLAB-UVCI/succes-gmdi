<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('travaux_batiments', function (Blueprint $table) {
            $table->id();
            $table->string('batiment', 200);
            $table->string('description', 500);
            $table->enum('type', ['reparation','renovation','construction','entretien']);
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->decimal('cout_estime', 12, 2)->default(0);
            $table->string('prestataire', 200)->nullable();
            $table->enum('statut', ['planifie','en_cours','termine','suspendu'])->default('planifie');
            $table->timestamps();
            $table->index(['batiment','statut']);
        });
    }
    public function down(): void { Schema::dropIfExists('travaux_batiments'); }
};
