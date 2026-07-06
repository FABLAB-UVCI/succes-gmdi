<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lampadaires', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 20)->unique();
            $table->string('localisation', 200);
            $table->string('quartier', 150);
            $table->string('type_lampe', 100);
            $table->unsignedSmallInteger('puissance')->nullable();
            $table->enum('statut', ['fonctionnel','en_panne','en_maintenance'])->default('fonctionnel');
            $table->date('date_posee')->nullable();
            $table->date('date_dernier_controle')->nullable();
            $table->timestamps();
            $table->index(['quartier','statut']);
        });
    }
    public function down(): void { Schema::dropIfExists('lampadaires'); }
};
