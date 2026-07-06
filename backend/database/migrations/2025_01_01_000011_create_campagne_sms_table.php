<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('campagne_sms', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('type', 50);
            $table->text('message');
            $table->string('destinataires', 100);
            $table->unsignedInteger('nb_destinataires')->default(0);
            $table->date('date_envoi');
            $table->enum('statut', ['envoye', 'programme', 'echec'])->default('programme');
            $table->unsignedTinyInteger('taux_livraison')->default(0);
            $table->timestamps();
            $table->index(['statut', 'date_envoi']);
        });
    }
    public function down(): void { Schema::dropIfExists('campagne_sms'); }
};
