<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('parcelles', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 25)->unique();
            $table->string('proprietaire', 200);
            $table->string('localisation', 250);
            $table->string('quartier', 150);
            $table->float('superficie');
            $table->string('usage', 100)->nullable();
            $table->string('titre_foncier', 60)->nullable();
            $table->enum('statut', ['libre','occupe','litige','reserve'])->default('libre');
            $table->decimal('lat', 10, 6)->nullable();
            $table->decimal('lng', 10, 6)->nullable();
            $table->timestamps();
            $table->index(['quartier','statut']);
        });
    }
    public function down(): void { Schema::dropIfExists('parcelles'); }
};
