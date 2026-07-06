<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 20)->unique();
            $table->string('objet', 250);
            $table->string('citoyen', 150)->default('Anonyme');
            $table->string('description', 500)->nullable();
            $table->date('date');
            $table->enum('statut', ['recu', 'en_etude', 'transmis', 'rejete'])->default('recu');
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('suggestions'); }
};
