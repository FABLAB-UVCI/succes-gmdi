<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lotissements', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 20)->unique();
            $table->string('denomination', 200);
            $table->string('promoteur', 200);
            $table->string('localisation', 250);
            $table->float('superficie');
            $table->unsignedSmallInteger('nombre_lots');
            $table->unsignedSmallInteger('lots_disponibles')->nullable();
            $table->date('date_approb')->nullable();
            $table->enum('statut', ['etude','approuve','en_cours','termine','suspendu'])->default('etude');
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('lotissements'); }
};
