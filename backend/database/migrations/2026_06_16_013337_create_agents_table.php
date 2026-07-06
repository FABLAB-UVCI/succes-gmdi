<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->string('matricule')->unique();
            $table->string('nom_complet');
            $table->string('nom')->nullable();
            $table->string('prenom')->nullable();
            $table->string('poste');
            $table->string('direction');
            $table->enum('type_contrat', ['fonctionnaire', 'contractuel', 'stage']);
            $table->enum('categorie', ['A', 'B', 'C', 'Stagiaire']);
            $table->string('specialite')->nullable();
            $table->string('grade');
            $table->date('date_embauche');
            $table->date('date_naissance');
            $table->enum('genre', ['M', 'F']);
            $table->string('telephone');
            $table->string('email')->unique();
            $table->enum('statut', ['actif', 'conge', 'suspendu'])->default('actif');
            $table->decimal('salaire_brut', 12, 2)->default(0);
            $table->integer('conges_restants')->default(30);
            $table->string('situation_familiale')->nullable();
            $table->string('diplome')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('agents');
    }
};
