<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mariages', function (Blueprint $table) {
            $table->string('temoin1_profession')->nullable()->after('temoin1_nom');
            $table->string('temoin2_profession')->nullable()->after('temoin2_nom');
        });
    }

    public function down(): void
    {
        Schema::table('mariages', function (Blueprint $table) {
            $table->dropColumn(['temoin1_profession', 'temoin2_profession']);
        });
    }
};
