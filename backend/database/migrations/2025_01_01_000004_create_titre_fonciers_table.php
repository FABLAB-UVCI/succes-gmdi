<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('titre_fonciers', function (Blueprint $table) {
            $table->id();
            $table->string('numero', 60)->unique();
            $table->enum('type', ['TF','ACD','CU','autre']);
            $table->string('proprietaire', 200);
            $table->float('superficie');
            $table->string('localisation', 250);
            $table->date('date_delivrance')->nullable();
            $table->date('date_expiration')->nullable();
            $table->enum('statut', ['valide','expire','litige','en_cours'])->default('valide');
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('titre_fonciers'); }
};
