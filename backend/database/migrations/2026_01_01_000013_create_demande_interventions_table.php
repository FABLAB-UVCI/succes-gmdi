<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('demande_interventions', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 25)->unique();
            $table->string('type_service', 50);
            $table->string('description', 500);
            $table->string('localisation', 250);
            $table->string('demandeur', 200);
            $table->string('telephone', 20)->nullable();
            $table->date('date_depot');
            $table->enum('priorite', ['normale','haute','urgente'])->default('normale');
            $table->enum('statut', ['ouverte','assignee','en_cours','terminee','cloturee'])->default('ouverte');
            $table->string('assigne_a', 200)->nullable();
            $table->date('date_assignation')->nullable();
            $table->date('date_resolution')->nullable();
            $table->timestamps();
            $table->index(['statut','priorite']);
            $table->index('type_service');
        });
    }
    public function down(): void { Schema::dropIfExists('demande_interventions'); }
};
