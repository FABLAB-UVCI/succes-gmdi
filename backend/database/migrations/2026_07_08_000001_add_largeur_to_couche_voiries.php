<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('couche_voiries', function (Blueprint $table) {
            if (!Schema::hasColumn('couche_voiries', 'largeur')) {
                $table->decimal('largeur', 8, 2)->nullable()->after('longueur');
            }
        });
    }

    public function down(): void
    {
        Schema::table('couche_voiries', function (Blueprint $table) {
            $table->dropColumn('largeur');
        });
    }
};
