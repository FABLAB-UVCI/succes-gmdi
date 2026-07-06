<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recettes_par_service', function (Blueprint $table) {
            $table->id();
            $table->string('service');
            $table->string('type');
            $table->decimal('montant', 15, 2)->default(0);
            $table->unsignedTinyInteger('pct')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recettes_par_service');
    }
};
