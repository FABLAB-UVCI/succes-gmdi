<?php

namespace Database\Seeders;

use App\Support\GmdiAccess;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class GmdiRolesSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (GmdiAccess::MODULES as $module) {
            Permission::findOrCreate(GmdiAccess::permissionForModule($module), 'web');
        }

        $citoyen = Role::findOrCreate('citoyen', 'web');
        $gestionnaire = Role::findOrCreate('gestionnaire', 'web');
        $maire = Role::findOrCreate('maire', 'web');
        Role::findOrCreate('admin', 'web');

        $gestionnaire->syncPermissions([]);
        $citoyen->syncPermissions([]);
        $maire->syncPermissions([]);
    }
}
