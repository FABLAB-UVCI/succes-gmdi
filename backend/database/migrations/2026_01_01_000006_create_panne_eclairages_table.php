<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('panne_eclairages', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 25)->unique();
            $table->string('localisation', 200);
            $table->string('description', 300);
            $table->date('date_signalement');
            $table->string('technicien', 200)->nullable();
            $table->date('date_resolution')->nullable();
            $table->enum('statut', ['signalee','en_intervention','resolue'])->default('signalee');
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('panne_eclairages'); }
};
