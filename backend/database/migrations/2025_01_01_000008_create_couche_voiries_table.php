<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('couche_voiries', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->enum('type', ['principale','secondaire','piste']);
            $table->float('longueur');
            $table->enum('etat', ['bon','moyen','degrade'])->default('bon');
            $table->string('quartier', 150);
            $table->timestamps();
            $table->index(['type','etat']);
        });
    }
    public function down(): void { Schema::dropIfExists('couche_voiries'); }
};
