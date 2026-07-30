<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Demandes internes adressées au service RH par les gestionnaires des
     * autres modules (demande d'augmentation, de formation, de matériel...).
     * Distinct des `demarches` (réservées au portail citoyen).
     */
    public function up(): void
    {
        Schema::create('demandes_rh', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('demandeur_nom');
            $table->string('module_origine', 40);
            $table->string('type_demande', 40);
            $table->string('titre', 200);
            $table->text('description');
            $table->decimal('montant_demande', 12, 2)->nullable();
            $table->string('statut', 20)->default('en_attente'); // en_attente | validee | refusee
            $table->text('commentaire_rh')->nullable();
            $table->timestamps();
            $table->index(['module_origine', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes_rh');
    }
};
