<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('maintenance_eclairages', function (Blueprint $table) {
            $table->id();
            $table->string('zone', 200);
            $table->unsignedSmallInteger('nb_lampadaires');
            $table->string('type_intervention', 150);
            $table->date('date_prevue');
            $table->string('technicien', 200);
            $table->enum('statut', ['programme','en_cours','effectue','en_retard'])->default('programme');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('maintenance_eclairages'); }
};
