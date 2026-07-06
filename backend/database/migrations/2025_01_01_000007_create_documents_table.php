<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('titre', 250);
            $table->enum('type', ['photo', 'video', 'pdf', 'arrete', 'deliberation']);
            $table->string('categorie', 100);
            $table->date('date');
            $table->string('auteur', 150)->nullable();
            $table->string('url', 500)->nullable();
            $table->string('droits', 100)->nullable();
            $table->timestamps();
            $table->index(['type', 'date']);
        });
    }
    public function down(): void { Schema::dropIfExists('documents'); }
};
