<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('routes_voirie', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('quartier', 150);
            $table->float('longueur');
            $table->enum('type', ['bitumee','laterite','piste'])->default('bitumee');
            $table->enum('etat', ['bon','moyen','degrade','critique'])->default('bon');
            $table->date('date_dernier_entretien')->nullable();
            $table->timestamps();
            $table->index(['quartier','etat']);
        });
    }
    public function down(): void { Schema::dropIfExists('routes_voirie'); }
};
