<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('equipes', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('chef', 200);
            $table->unsignedTinyInteger('membres')->default(1);
            $table->string('bon_en_cours', 25)->nullable();
            $table->string('localisation', 200)->nullable();
            $table->enum('statut', ['disponible','en_intervention','repos'])->default('disponible');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('equipes'); }
};
