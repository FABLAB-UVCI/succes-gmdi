<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Colonne rôle sur users ────────────────────────────────────────────
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 30)->default('gestionnaire')->after('email');
            });
        }

        // ── Inventaire général ────────────────────────────────────────────────
        Schema::create('biens', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 30)->unique();
            $table->string('designation', 200);
            $table->string('categorie', 50);
            $table->string('localisation', 200);
            $table->decimal('superficie', 15, 2)->nullable();
            $table->decimal('valeur_acquisition', 15, 2)->default(0);
            $table->decimal('valeur_actuelle', 15, 2)->default(0);
            $table->date('date_acquisition');
            $table->string('affectation', 200)->nullable();
            $table->string('statut', 30)->default('disponible');
            $table->integer('taux_amortissement')->default(0);
            $table->string('qr_code', 80)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // ── Véhicules ─────────────────────────────────────────────────────────
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('modele', 200);
            $table->string('immatriculation', 30)->unique();
            $table->integer('kilometrage')->default(0)->nullable();
            $table->string('affectation', 200)->nullable();
            $table->decimal('valeur', 15, 2)->nullable();
            $table->date('fin_assurance')->nullable();
            $table->date('fin_visite_technique')->nullable();
            $table->string('statut', 30)->default('occupe');
            $table->timestamps();
            $table->softDeletes();
        });

        // ── Terrains ──────────────────────────────────────────────────────────
        Schema::create('terrains', function (Blueprint $table) {
            $table->id();
            $table->string('localisation', 200);
            $table->decimal('superficie', 15, 2)->nullable();
            $table->decimal('valeur', 15, 2)->nullable();
            $table->string('usage', 100)->nullable();
            $table->string('titre_foncier', 50)->nullable();
            $table->date('date_acquisition')->nullable();
            $table->string('statut', 30)->default('Reserve');
            $table->timestamps();
        });

        // ── Mouvements d'affectation ──────────────────────────────────────────
        Schema::create('mouvements_affectations', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('reference', 30)->index();
            $table->string('bien', 200);
            $table->string('origine', 200)->nullable();
            $table->string('destination', 200);
            $table->string('responsable', 200)->nullable();
            $table->string('motif', 255)->nullable();
            $table->timestamps();
        });

        // ── Entretiens ────────────────────────────────────────────────────────
        Schema::create('entretiens', function (Blueprint $table) {
            $table->id();
            $table->string('bien', 200)->index();
            $table->string('type_entretien', 150);
            $table->date('date_prevue');
            $table->date('date_realise')->nullable();
            $table->string('periodicite', 30)->nullable();
            $table->decimal('cout_estime', 15, 2)->nullable();
            $table->string('statut', 30)->default('programme');
            $table->timestamps();
        });

        // ── Réparations ───────────────────────────────────────────────────────
        Schema::create('reparations', function (Blueprint $table) {
            $table->id();
            $table->string('bien', 200)->index();
            $table->string('description', 500);
            $table->string('priorite', 20)->default('normale');
            $table->string('prestataire', 200)->nullable();
            $table->decimal('cout_estime', 15, 2)->nullable();
            $table->decimal('cout_reel', 15, 2)->nullable();
            $table->string('statut', 30)->default('en_cours');
            $table->date('date_declaration')->nullable();
            $table->date('date_resolue')->nullable();
            $table->timestamps();
        });

        // ── Amortissements ────────────────────────────────────────────────────
        Schema::create('amortissements', function (Blueprint $table) {
            $table->id();
            $table->string('bien', 200)->index();
            $table->decimal('valeur_acquisition', 15, 2)->default(0);
            $table->integer('taux_annuel')->default(0);
            $table->integer('annee_debut');
            $table->decimal('amortissement_cumule', 15, 2)->default(0);
            $table->decimal('valeur_nette_comptable', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amortissements');
        Schema::dropIfExists('reparations');
        Schema::dropIfExists('entretiens');
        Schema::dropIfExists('mouvements_affectations');
        Schema::dropIfExists('terrains');
        Schema::dropIfExists('vehicules');
        Schema::dropIfExists('biens');

        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }
};
