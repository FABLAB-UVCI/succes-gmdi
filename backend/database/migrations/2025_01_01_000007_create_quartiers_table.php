<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quartiers', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 150);
            $table->string('code', 20)->unique();
            $table->float('superficie');
            $table->unsignedInteger('population')->nullable();
            $table->string('chef', 200)->nullable();
            $table->decimal('lat', 10, 6)->nullable();
            $table->decimal('lng', 10, 6)->nullable();
            $table->unsignedInteger('nombre_parcelles')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('quartiers'); }
};
