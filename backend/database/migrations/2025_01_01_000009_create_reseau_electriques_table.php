<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reseau_electriques', function (Blueprint $table) {
            $table->id();
            $table->string('zone', 150);
            $table->enum('type', ['HT','MT','BT']);
            $table->float('longueur');
            $table->unsignedTinyInteger('taux_couverture');
            $table->string('operateur', 100);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('reseau_electriques'); }
};
