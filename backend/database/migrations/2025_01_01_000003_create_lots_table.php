<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lots', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 30);
            $table->string('lotissement', 200);
            $table->float('superficie');
            $table->string('attributaire', 200)->nullable();
            $table->date('date_attribution')->nullable();
            $table->enum('statut', ['disponible','attribue','construit'])->default('disponible');
            $table->timestamps();
            $table->index(['lotissement','statut']);
        });
    }
    public function down(): void { Schema::dropIfExists('lots'); }
};
