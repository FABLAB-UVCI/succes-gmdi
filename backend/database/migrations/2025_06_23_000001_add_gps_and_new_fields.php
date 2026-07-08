<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── titre_fonciers : coordonnées GPS ──────────────────────────────────
        Schema::table('titre_fonciers', function (Blueprint $table) {
            if (!Schema::hasColumn('titre_fonciers', 'lat'))
                $table->decimal('lat', 10, 6)->nullable()->after('localisation')->comment('Latitude GPS');
            if (!Schema::hasColumn('titre_fonciers', 'lng'))
                $table->decimal('lng', 10, 6)->nullable()->after('lat')->comment('Longitude GPS');
        });

        // ── reserve_administratives : coordonnées GPS ─────────────────────────
        Schema::table('reserve_administratives', function (Blueprint $table) {
            if (!Schema::hasColumn('reserve_administratives', 'lat'))
                $table->decimal('lat', 10, 6)->nullable()->after('localisation')->comment('Latitude GPS');
            if (!Schema::hasColumn('reserve_administratives', 'lng'))
                $table->decimal('lng', 10, 6)->nullable()->after('lat')->comment('Longitude GPS');
        });

        // ── permis : ilot, lot, section, pièce identité, GPS ─────────────────
        Schema::table('permis', function (Blueprint $table) {
            if (!Schema::hasColumn('permis', 'ilot'))
                $table->string('ilot', 50)->nullable()->after('quartier')->comment('Numéro îlot');
            if (!Schema::hasColumn('permis', 'lot'))
                $table->string('lot', 50)->nullable()->after('ilot')->comment('Numéro lot');
            if (!Schema::hasColumn('permis', 'section'))
                $table->string('section', 50)->nullable()->after('lot')->comment('Section cadastrale');
            if (!Schema::hasColumn('permis', 'numero_piece'))
                $table->string('numero_piece', 100)->nullable()->after('telephone')->comment('N° pièce identité (permis démolir)');
            if (!Schema::hasColumn('permis', 'type_piece'))
                $table->enum('type_piece', ['cni','passeport','sejour','autre'])->nullable()->after('numero_piece');
            if (!Schema::hasColumn('permis', 'lat'))
                $table->decimal('lat', 10, 6)->nullable()->after('type_piece')->comment('Latitude GPS du projet');
            if (!Schema::hasColumn('permis', 'lng'))
                $table->decimal('lng', 10, 6)->nullable()->after('lat')->comment('Longitude GPS du projet');
        });

        // ── equipement_publics : nouveaux types (commissariat, gendarmerie…) ──
        // MySQL/MariaDB ne supporte pas directement ALTER COLUMN sur un ENUM.
        // On modifie la colonne type pour ajouter les nouvelles valeurs.
        // Sur PostgreSQL, ->change() sur un enum génère un ALTER COLUMN ... TYPE
        // avec un "check" inline que Postgres refuse : on le fait en 3 étapes.
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE equipement_publics DROP CONSTRAINT IF EXISTS equipement_publics_type_check');
            DB::statement('ALTER TABLE equipement_publics ALTER COLUMN type TYPE varchar(255)');
            DB::statement("ALTER TABLE equipement_publics ALTER COLUMN type SET DEFAULT 'autre'");
            DB::statement("ALTER TABLE equipement_publics ADD CONSTRAINT equipement_publics_type_check CHECK (type IN ('ecole','sante','marche','espace_vert','sport','culte','securite','commissariat','gendarmerie','eaux_forets','autre'))");
        } else {
            Schema::table('equipement_publics', function (Blueprint $table) {
                $table->enum('type', [
                    'ecole','sante','marche','espace_vert','sport','culte','securite',
                    'commissariat','gendarmerie','eaux_forets','autre'
                ])->default('autre')->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('titre_fonciers', function (Blueprint $table) {
            $table->dropColumn(['lat','lng']);
        });
        Schema::table('reserve_administratives', function (Blueprint $table) {
            $table->dropColumn(['lat','lng']);
        });
        Schema::table('permis', function (Blueprint $table) {
            $table->dropColumn(['ilot','lot','section','numero_piece','type_piece','lat','lng']);
        });
        Schema::table('equipement_publics', function (Blueprint $table) {
            $table->enum('type', ['ecole','sante','marche','espace_vert','sport','culte','securite','autre'])->change();
        });
    }
};
