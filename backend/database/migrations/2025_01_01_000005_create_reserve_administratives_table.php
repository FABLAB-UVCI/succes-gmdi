<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reserve_administratives', function (Blueprint $table) {
            $table->id();
            $table->string('denomination', 200);
            $table->string('usage', 200);
            $table->float('superficie');
            $table->string('localisation', 250);
            $table->enum('statut', ['reserve','affecte','libere'])->default('reserve');
            $table->string('administration', 150)->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('reserve_administratives'); }
};
