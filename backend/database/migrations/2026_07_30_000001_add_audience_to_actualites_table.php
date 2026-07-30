<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Destinataire d'une publication : 'public' (citoyens + tous les services),
     * 'tous_services' (tous les gestionnaires, hors portail citoyen), ou le slug
     * d'un module précis (etat-civil, finances, ...) pour ne cibler qu'un service.
     * Défaut 'public' pour rester compatible avec les publications existantes.
     */
    public function up(): void
    {
        Schema::table('actualites', function (Blueprint $table) {
            $table->string('audience', 40)->default('public')->after('categorie');
        });
    }

    public function down(): void
    {
        Schema::table('actualites', function (Blueprint $table) {
            $table->dropColumn('audience');
        });
    }
};
