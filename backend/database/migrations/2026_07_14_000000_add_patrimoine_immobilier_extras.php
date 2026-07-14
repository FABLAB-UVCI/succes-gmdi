<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── État d'un bien (neuf / bon / usagé / hors service) ──────────────────
        if (!Schema::hasColumn('biens', 'etat')) {
            Schema::table('biens', function (Blueprint $table) {
                $table->string('etat', 20)->nullable()->after('statut');
            });
        }

        // ── Bâtiments communaux ───────────────────────────────────────────────
        Schema::create('batiments', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->decimal('superficie', 15, 2)->nullable();
            $table->decimal('valeur_actuelle', 15, 2)->default(0);
            $table->string('affectation', 200)->nullable();
            $table->string('etat', 20)->default('bon'); // bon | moyen | degrade
            $table->date('derniere_inspection')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // ── Marchés municipaux ────────────────────────────────────────────────
        Schema::create('marches', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->decimal('superficie', 15, 2)->nullable();
            $table->integer('nombre_boutiques')->default(0);
            $table->decimal('loyer_moyen_boutique', 15, 2)->default(0);
            $table->string('statut', 20)->default('actif'); // actif | rehabilitation | ferme
            $table->timestamps();
            $table->softDeletes();
        });

        // ── Centres communautaires ────────────────────────────────────────────
        Schema::create('centres_communautaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('quartier', 150)->nullable();
            $table->integer('capacite')->default(0);
            $table->string('services', 300)->nullable();
            $table->string('statut', 20)->default('operationnel'); // operationnel | travaux
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('centres_communautaires');
        Schema::dropIfExists('marches');
        Schema::dropIfExists('batiments');

        if (Schema::hasColumn('biens', 'etat')) {
            Schema::table('biens', function (Blueprint $table) {
                $table->dropColumn('etat');
            });
        }
    }
};
