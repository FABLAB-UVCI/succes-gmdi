<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('collecte_dechets', function (Blueprint $table) {
            $table->id();
            $table->string('zone', 200);
            $table->string('frequence', 50)->default('Hebdomadaire');
            $table->date('prochaine_collecte');
            $table->float('tonnage')->nullable();
            $table->enum('statut', ['planifie','effectue','manque'])->default('planifie');
            $table->timestamps();
            $table->index('prochaine_collecte');
        });
    }
    public function down(): void { Schema::dropIfExists('collecte_dechets'); }
};
