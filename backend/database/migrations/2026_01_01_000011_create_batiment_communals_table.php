<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('batiment_communals', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->enum('type', ['mairie','ecole','centre_social','marche','autre']);
            $table->string('adresse', 250);
            $table->float('superficie');
            $table->unsignedSmallInteger('annee_construction')->nullable();
            $table->enum('etat', ['bon','moyen','degrade'])->default('bon');
            $table->string('responsable', 200)->nullable();
            $table->date('date_derniere_inspection')->nullable();
            $table->timestamps();
            $table->index('type');
        });
    }
    public function down(): void { Schema::dropIfExists('batiment_communals'); }
};
