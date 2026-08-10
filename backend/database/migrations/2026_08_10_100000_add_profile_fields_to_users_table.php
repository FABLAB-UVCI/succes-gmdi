<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('telephone', 30)->nullable()->after('email');
            $table->string('commune', 100)->nullable()->after('telephone');
            $table->string('numero_cni', 30)->nullable()->after('commune');
            $table->date('date_naissance')->nullable()->after('numero_cni');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['telephone', 'commune', 'numero_cni', 'date_naissance']);
        });
    }
};
