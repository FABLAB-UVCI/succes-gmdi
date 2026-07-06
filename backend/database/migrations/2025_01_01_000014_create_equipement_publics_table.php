<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('equipement_publics', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->enum('type', ['ecole','sante','marche','espace_vert','sport','culte','securite','autre']);
            $table->string('adresse', 250);
            $table->string('quartier', 150);
            $table->decimal('lat', 10, 6);
            $table->decimal('lng', 10, 6);
            $table->unsignedInteger('capacite')->nullable();
            $table->enum('etat', ['bon','moyen','degrade'])->default('bon');
            $table->string('responsable', 200)->nullable();
            $table->unsignedSmallInteger('annee_construction')->nullable();
            $table->timestamps();
            $table->index(['type','quartier']);
            $table->index(['lat','lng']);
        });
    }
    public function down(): void { Schema::dropIfExists('equipement_publics'); }
};
