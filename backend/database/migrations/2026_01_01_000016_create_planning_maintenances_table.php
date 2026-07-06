<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('planning_maintenances', function (Blueprint $table) {
            $table->id();
            $table->string('equipement', 200);
            $table->string('service', 100);
            $table->string('type_maintenance', 150);
            $table->date('date_prevue');
            $table->string('periodicite', 50)->default('Trimestrielle');
            $table->string('responsable', 200);
            $table->decimal('cout_estime', 12, 2)->nullable();
            $table->enum('statut', ['programme','en_cours','effectue','en_retard'])->default('programme');
            $table->date('date_realisation')->nullable();
            $table->timestamps();
            $table->index(['statut','date_prevue']);
        });
    }
    public function down(): void { Schema::dropIfExists('planning_maintenances'); }
};
