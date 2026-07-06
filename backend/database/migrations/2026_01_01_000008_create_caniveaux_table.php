<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('caniveaux', function (Blueprint $table) {
            $table->id();
            $table->string('localisation', 200);
            $table->string('quartier', 150);
            $table->float('longueur');
            $table->enum('etat', ['bon','colmate','degrade'])->default('bon');
            $table->date('date_dernier_nettoyage')->nullable();
            $table->timestamps();
            $table->index(['quartier','etat']);
        });
    }
    public function down(): void { Schema::dropIfExists('caniveaux'); }
};
