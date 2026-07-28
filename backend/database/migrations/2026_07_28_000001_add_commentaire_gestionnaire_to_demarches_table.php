<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('demarches', function (Blueprint $table) {
            $table->text('commentaire_gestionnaire')->nullable()->after('donnees');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('demarches', function (Blueprint $table) {
            $table->dropColumn('commentaire_gestionnaire');
        });
    }
};
