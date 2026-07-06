<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('consultation_publiques', function (Blueprint $table) {
            $table->id();
            $table->string('titre', 250);
            $table->string('theme', 100);
            $table->date('date_ouverture');
            $table->date('date_cloture');
            $table->unsignedInteger('participants')->default(0);
            $table->enum('statut', ['programme', 'actif', 'cloture'])->default('programme');
            $table->string('canaux', 100)->nullable();
            $table->timestamps();
            $table->index('statut');
        });
    }
    public function down(): void { Schema::dropIfExists('consultation_publiques'); }
};
