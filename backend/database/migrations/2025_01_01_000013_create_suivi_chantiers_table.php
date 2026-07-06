<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('suivi_chantiers', function (Blueprint $table) {
            $table->id();
            $table->string('projet', 200);
            $table->string('entrepreneur', 200);
            $table->date('date_ouverture');
            $table->date('date_prevue_fin');
            $table->unsignedTinyInteger('taux_avancement')->default(0);
            $table->date('derniere_visite')->nullable();
            $table->enum('statut', ['actif','arrete','termine','retard'])->default('actif');
            $table->string('observations', 500)->nullable();
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('suivi_chantiers'); }
};
