<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('entretien_voiries', function (Blueprint $table) {
            $table->id();
            $table->string('route', 200);
            $table->string('type_entretien', 150);
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->string('equipe', 200);
            $table->decimal('cout_estime', 12, 2)->default(0);
            $table->decimal('cout_reel', 12, 2)->nullable();
            $table->enum('statut', ['planifie','en_cours','termine','suspendu'])->default('planifie');
            $table->timestamps();
            $table->index(['statut','date_debut']);
        });
    }
    public function down(): void { Schema::dropIfExists('entretien_voiries'); }
};
