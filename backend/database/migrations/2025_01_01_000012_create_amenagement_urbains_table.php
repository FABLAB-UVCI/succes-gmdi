<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('amenagement_urbains', function (Blueprint $table) {
            $table->id();
            $table->string('intitule', 200);
            $table->string('type', 100);
            $table->string('localisation', 250);
            $table->float('superficie')->nullable();
            $table->decimal('budget', 15, 2)->default(0);
            $table->string('financeur', 150)->nullable();
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->unsignedTinyInteger('taux_avancement')->default(0);
            $table->enum('statut', ['etude','approuve','en_cours','termine','suspendu'])->default('etude');
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('amenagement_urbains'); }
};
