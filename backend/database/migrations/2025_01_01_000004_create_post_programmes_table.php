<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('post_programmes', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->text('contenu');
            $table->string('plateformes', 100);
            $table->string('responsable', 150)->default('Service Communication');
            $table->enum('statut', ['programme', 'publie', 'a_rediger', 'a_confirmer'])->default('programme');
            $table->timestamps();
            $table->index('date');
        });
    }
    public function down(): void { Schema::dropIfExists('post_programmes'); }
};
