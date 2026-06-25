<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gmdi.ci'],
            [
                'name' => 'Administrateur GMDI',
                'password' => Hash::make('Admin@2025'),
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'agent@gmdi.ci'],
            [
                'name' => 'Agent État Civil',
                'password' => Hash::make('Agent@2025'),
                'role' => 'agent',
            ]
        );
    }
}
