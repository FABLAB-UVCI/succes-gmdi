<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // updateAvancementLotissement() recevait un pourcentage d'avancement
        // mais ne le persistait jamais (aucune colonne dediee) -> la valeur
        // etait silencieusement jetee sauf a exactement 100% (passage a "termine").
        Schema::table('lotissements', function (Blueprint $table) {
            $table->unsignedTinyInteger('avancement')->default(0)->after('statut');
        });
    }

    public function down(): void
    {
        Schema::table('lotissements', function (Blueprint $table) {
            $table->dropColumn('avancement');
        });
    }
};
