<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('departs', function (Blueprint $table) {
            $table->id();
            $table->string('matricule');
            $table->string('nom');
            $table->string('cause');
            $table->date('date');
            $table->date('derniere_presence')->nullable();
            $table->decimal('dernier_salaire', 12, 2)->nullable();
            $table->text('observations')->nullable();
            $table->enum('statut', ['valide', 'attente'])->default('attente');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('departs');
    }
};
