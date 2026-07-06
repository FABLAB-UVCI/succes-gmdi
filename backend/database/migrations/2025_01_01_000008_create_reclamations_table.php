<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 20)->unique();
            $table->string('objet', 250);
            $table->string('demandeur', 200);
            $table->string('service', 100);
            $table->string('canal', 50);
            $table->date('date');
            $table->enum('statut', ['en_traitement', 'repondu', 'cloture'])->default('en_traitement');
            $table->timestamps();
            $table->index(['statut', 'date']);
        });
    }
    public function down(): void { Schema::dropIfExists('reclamations'); }
};
