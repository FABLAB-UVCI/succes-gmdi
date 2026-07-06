<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('partenaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('type', 100);
            $table->string('domaine', 150);
            $table->string('contact', 200);
            $table->date('date_debut');
            $table->enum('statut', ['actif', 'inactif', 'suspendu'])->default('actif');
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('partenaires'); }
};
