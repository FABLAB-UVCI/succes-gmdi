<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ajoute le statut 'parti' : un départ validé (CarriereComponent > Départ)
        // ne mettait jamais à jour l'agent lié, qui restait "actif" indéfiniment
        // et continuait à être compté dans tous les KPIs RH.
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE agents MODIFY COLUMN statut ENUM('actif','conge','suspendu','parti') NOT NULL DEFAULT 'actif'");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE agents DROP CONSTRAINT IF EXISTS agents_statut_check");
            DB::statement("ALTER TABLE agents ADD CONSTRAINT agents_statut_check CHECK (statut IN ('actif','conge','suspendu','parti'))");
        }
        // SQLite : pas de contrainte ENUM native, aucune migration de schéma nécessaire.
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        DB::table('agents')->where('statut', 'parti')->update(['statut' => 'actif']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE agents MODIFY COLUMN statut ENUM('actif','conge','suspendu') NOT NULL DEFAULT 'actif'");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE agents DROP CONSTRAINT IF EXISTS agents_statut_check");
            DB::statement("ALTER TABLE agents ADD CONSTRAINT agents_statut_check CHECK (statut IN ('actif','conge','suspendu'))");
        }
    }
};
