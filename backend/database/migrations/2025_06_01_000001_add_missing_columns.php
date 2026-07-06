<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Permis : colonnes spécifiques construire
        Schema::table('permis', function (Blueprint $table) {
            if (!Schema::hasColumn('permis', 'nombre_etages'))
                $table->unsignedTinyInteger('nombre_etages')->nullable()->after('quartier');
            if (!Schema::hasColumn('permis', 'cout_estime'))
                $table->decimal('cout_estime', 15, 2)->nullable()->after('nombre_etages');
            if (!Schema::hasColumn('permis', 'motif_refus'))
                $table->string('motif_refus', 500)->nullable()->after('statut');
            if (!Schema::hasColumn('permis', 'instructeur'))
                $table->string('instructeur', 200)->nullable()->after('agent');
        });

        // Lots : colonnes manquantes
        Schema::table('lots', function (Blueprint $table) {
            if (!Schema::hasColumn('lots', 'usage'))
                $table->string('usage', 100)->nullable()->after('superficie');
            if (!Schema::hasColumn('lots', 'prix'))
                $table->decimal('prix', 15, 2)->nullable()->after('usage');
            if (!Schema::hasColumn('lots', 'attribue_a'))
                $table->string('attribue_a', 200)->nullable()->after('attributaire');
            if (!Schema::hasColumn('lots', 'numero'))
                $table->unsignedSmallInteger('numero')->nullable()->after('lotissement');
        });

        // Suivi chantiers : colonnes manquantes
        Schema::table('suivi_chantiers', function (Blueprint $table) {
            if (!Schema::hasColumn('suivi_chantiers', 'recommandations'))
                $table->text('recommandations')->nullable()->after('observations');
            if (!Schema::hasColumn('suivi_chantiers', 'controleur'))
                $table->string('controleur', 200)->nullable()->after('recommandations');
            if (!Schema::hasColumn('suivi_chantiers', 'date_visite'))
                $table->date('date_visite')->nullable()->after('derniere_visite');
        });

        // Titre fonciers : observation
        Schema::table('titre_fonciers', function (Blueprint $table) {
            if (!Schema::hasColumn('titre_fonciers', 'observation'))
                $table->text('observation')->nullable()->after('statut');
        });
    }

    public function down(): void {}
};
