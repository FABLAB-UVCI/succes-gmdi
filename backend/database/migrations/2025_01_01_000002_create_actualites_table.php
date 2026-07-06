<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['communique', 'annonce', 'evenement']);
            $table->string('titre', 250);
            $table->text('contenu');
            $table->string('auteur', 150)->default('Service Communication');
            $table->date('date');
            $table->enum('statut', ['publie', 'brouillon'])->default('brouillon');
            $table->string('categorie', 100)->nullable();
            $table->timestamps();
            $table->index(['type', 'statut']);
            $table->index('date');
        });
    }
    public function down(): void { Schema::dropIfExists('actualites'); }
};
