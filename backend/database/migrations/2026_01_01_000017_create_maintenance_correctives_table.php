<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('maintenance_correctives', function (Blueprint $table) {
            $table->id();
            $table->string('equipement', 200);
            $table->string('service', 100);
            $table->string('panne', 400);
            $table->enum('priorite', ['normale','haute','urgente'])->default('normale');
            $table->string('technicien', 200)->nullable();
            $table->date('date_signalement');
            $table->date('date_resolution')->nullable();
            $table->decimal('cout_reel', 12, 2)->nullable();
            $table->enum('statut', ['signale','en_cours','resolu'])->default('signale');
            $table->timestamps();
            $table->index(['statut','priorite']);
        });
    }
    public function down(): void { Schema::dropIfExists('maintenance_correctives'); }
};
