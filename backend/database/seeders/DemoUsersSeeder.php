<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed demo accounts used by the platform.
     */
    public function run(): void
    {
        $this->call(GmdiRolesSeeder::class);

        // Admin
        User::updateOrCreate(
            ['email' => 'admin@emairie.ci'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
            ]
        )->assignRole('admin');

        // Maire
        User::updateOrCreate(
            ['email' => 'maire@emairie.ci'],
            [
                'name' => 'Monsieur le Maire',
                'password' => Hash::make('12345678'),
                'role' => 'maire',
            ]
        )->assignRole('maire');

        // Citoyen
        User::updateOrCreate(
            ['email' => 'citoyen@emairie.ci'],
            [
                'name' => 'Jean Citoyen',
                'password' => Hash::make('12345678'),
                'role' => 'citoyen',
            ]
        )->assignRole('citoyen');

        // Gestionnaire Etat Civil
        $gec = User::updateOrCreate(
            ['email' => 'etatcivil@emairie.ci'],
            [
                'name' => 'Agent Etat Civil',
                'password' => Hash::make('12345678'),
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
                'password' => Hash::make('12345678'),
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
                'password' => Hash::make('12345678'),
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
                'password' => Hash::make('12345678'),
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
                'password' => Hash::make('12345678'),
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
                'password' => Hash::make('12345678'),
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
                'password' => Hash::make('12345678'),
                'role' => 'gestionnaire',
            ]
        );
        $gurb->assignRole('gestionnaire');
        $gurb->givePermissionTo('access.urbanisme');
    }
}
