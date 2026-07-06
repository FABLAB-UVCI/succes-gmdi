<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('intervention_drainages', function (Blueprint $table) {
            $table->id();
            $table->string('localisation', 200);
            $table->enum('type', ['curage','debouchage','reparation','construction']);
            $table->date('date_intervention');
            $table->string('equipe', 200);
            $table->enum('statut', ['planifie','en_cours','termine','suspendu'])->default('planifie');
            $table->string('observations', 400)->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('intervention_drainages'); }
};
