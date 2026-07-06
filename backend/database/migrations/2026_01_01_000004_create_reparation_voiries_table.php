<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reparation_voiries', function (Blueprint $table) {
            $table->id();
            $table->string('route', 200);
            $table->string('description', 500);
            $table->enum('priorite', ['normale','haute','urgente'])->default('normale');
            $table->string('signale_par', 200);
            $table->date('date_signalement');
            $table->date('date_intervention')->nullable();
            $table->enum('statut', ['signalee','en_intervention','resolue'])->default('signalee');
            $table->timestamps();
            $table->index(['statut','priorite']);
        });
    }
    public function down(): void { Schema::dropIfExists('reparation_voiries'); }
};
