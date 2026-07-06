<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('permis', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 25)->unique();
            $table->enum('type', ['construire','demolir','certificat','occupation']);
            $table->string('demandeur', 200);
            $table->string('telephone', 20)->nullable();
            $table->string('localisation', 250);
            $table->string('quartier', 150);
            $table->decimal('surface_plancher', 10, 2)->nullable();
            $table->date('date_depot');
            $table->date('date_instruction')->nullable();
            $table->date('date_decision')->nullable();
            $table->date('date_expiration')->nullable();
            $table->enum('statut', ['depose','instruction','accorde','refuse','expire'])->default('depose');
            $table->string('agent', 200)->nullable();
            $table->string('observations', 500)->nullable();
            $table->timestamps();
            $table->index(['type','statut']);
            $table->index('date_depot');
        });
    }
    public function down(): void { Schema::dropIfExists('permis'); }
};
