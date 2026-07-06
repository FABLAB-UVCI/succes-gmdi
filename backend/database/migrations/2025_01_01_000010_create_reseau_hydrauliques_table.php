<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reseau_hydrauliques', function (Blueprint $table) {
            $table->id();
            $table->string('zone', 150);
            $table->enum('type', ['adduction','assainissement','irrigation']);
            $table->float('longueur');
            $table->unsignedTinyInteger('taux_couverture');
            $table->enum('statut', ['operationnel','en_travaux','hors_service'])->default('operationnel');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('reseau_hydrauliques'); }
};
