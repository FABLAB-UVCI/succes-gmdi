<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Le formulaire "Ouverture de poste" collecte le diplôme requis et le
        // salaire proposé mais ces champs n'étaient jamais envoyés au backend
        // (RhService.ouvrirPoste ne les transmettait pas) ni stockés.
        Schema::table('recrutements', function (Blueprint $table) {
            $table->string('diplome_requis')->nullable()->after('type');
            $table->decimal('salaire_propose', 12, 2)->nullable()->after('diplome_requis');
        });
    }

    public function down(): void
    {
        Schema::table('recrutements', function (Blueprint $table) {
            $table->dropColumn(['diplome_requis', 'salaire_propose']);
        });
    }
};
