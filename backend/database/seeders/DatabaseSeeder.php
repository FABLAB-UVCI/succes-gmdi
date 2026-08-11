<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Ne PAS utiliser WithoutModelEvents ici : DemoDataSeeder crée des Depense
     * dont la référence (DEP-2026-0001...) est générée par un événement
     * `creating()` du modèle — désactiver les événements la laisse vide et
     * viole la contrainte NOT NULL.
     */
    public function run(): void
    {
        // Rôles & permissions d'abord : assignRole() plante sur une base neuve
        // sans ça (aucune migration ne crée les rôles, seul ce seeder le fait).
        $this->call(GmdiRolesSeeder::class);

        // Admin
        User::updateOrCreate(
            ['email' => 'admin@emairie.ci'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        )->assignRole('admin');

        // Maire
        User::updateOrCreate(
            ['email' => 'maire@emairie.ci'],
            [
                'name' => 'Monsieur le Maire',
                'password' => Hash::make('password'),
                'role' => 'maire',
            ]
        )->assignRole('maire');

        // Citoyen
        User::updateOrCreate(
            ['email' => 'citoyen@emairie.ci'],
            [
                'name' => 'Jean Citoyen',
                'password' => Hash::make('password'),
                'role' => 'citoyen',
            ]
        )->assignRole('citoyen');

        // Gestionnaire Etat Civil
        $gec = User::updateOrCreate(
            ['email' => 'etatcivil@emairie.ci'],
            [
                'name' => 'Agent Etat Civil',
                'password' => Hash::make('password'),
                'role' => 'gestionnaire',
            ]
        );
        $gec->assignRole('gestionnaire');
        $gec->givePermissionTo('access.etat-civil');

        // Gestionnaire Finances
        $gfi = User::updateOrCreate(
            ['email' => 'finances@emairie.ci'],
            [
                'name' => 'Agent Finances',
                'password' => Hash::make('password'),
                'role' => 'gestionnaire',
            ]
        );
        $gfi->assignRole('gestionnaire');
        $gfi->givePermissionTo('access.finances');

        // Gestionnaire Communication
        $gcom = User::updateOrCreate(
            ['email' => 'communication@emairie.ci'],
            [
                'name' => 'Agent Communication',
                'password' => Hash::make('password'),
                'role' => 'gestionnaire',
            ]
        );
        $gcom->assignRole('gestionnaire');
        $gcom->givePermissionTo('access.communication');

        // Gestionnaire Patrimoine
        $gpat = User::updateOrCreate(
            ['email' => 'patrimoine@emairie.ci'],
            [
                'name' => 'Agent Patrimoine',
                'password' => Hash::make('password'),
                'role' => 'gestionnaire',
            ]
        );
        $gpat->assignRole('gestionnaire');
        $gpat->givePermissionTo('access.patrimoine');

        // Gestionnaire RH
        $grh = User::updateOrCreate(
            ['email' => 'rh@emairie.ci'],
            [
                'name' => 'Agent RH',
                'password' => Hash::make('password'),
                'role' => 'gestionnaire',
            ]
        );
        $grh->assignRole('gestionnaire');
        $grh->givePermissionTo('access.rh');

        // Gestionnaire Services Techniques
        $gst = User::updateOrCreate(
            ['email' => 'servicestechniques@emairie.ci'],
            [
                'name' => 'Agent Services Techniques',
                'password' => Hash::make('password'),
                'role' => 'gestionnaire',
            ]
        );
        $gst->assignRole('gestionnaire');
        $gst->givePermissionTo('access.services-techniques');

        // Gestionnaire Urbanisme
        $gurb = User::updateOrCreate(
            ['email' => 'urbanisme@emairie.ci'],
            [
                'name' => 'Agent Urbanisme',
                'password' => Hash::make('password'),
                'role' => 'gestionnaire',
            ]
        );
        $gurb->assignRole('gestionnaire');
        $gurb->givePermissionTo('access.urbanisme');

        // Données de démo pour les modules (Patrimoine, RH, Mariages, Dépenses)
        $this->call(DemoDataSeeder::class);
    }
}
