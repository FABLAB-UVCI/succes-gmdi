<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('articles_presse', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('media', 100);
            $table->string('titre', 300);
            $table->enum('type', ['TV', 'Radio', 'Presse écrite', 'Web']);
            $table->enum('tonalite', ['Positive', 'Neutre', 'Mitigée', 'Négative']);
            $table->timestamps();
            $table->index('date');
        });
    }
    public function down(): void { Schema::dropIfExists('articles_presse'); }
};
