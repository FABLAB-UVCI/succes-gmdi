<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('compte_reseaux', function (Blueprint $table) {
            $table->id();
            $table->enum('plateforme', ['facebook', 'twitter', 'instagram', 'whatsapp'])->unique();
            $table->string('nom', 150);
            $table->string('handle', 100);
            $table->unsignedInteger('abonnes')->default(0);
            $table->unsignedSmallInteger('publications')->default(0);
            $table->decimal('taux_engagement', 4, 1)->default(0);
            $table->unsignedInteger('porte_mois')->default(0);
            $table->string('dernier_post', 250)->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('compte_reseaux'); }
};
