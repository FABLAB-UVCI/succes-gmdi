<?php

namespace App\Support;

use App\Models\User;

final class GmdiAccess
{
    /** @var list<string> */
    public const MODULES = [
        'communication',
        'etat-civil',
        'finances',
        'patrimoine',
        'rh',
        'services-techniques',
        'urbanisme',
    ];

    /**
     * Modules pour lesquels un citoyen peut soumettre une démarche depuis le
     * portail citoyen. Communication, RH et patrimoine sont des modules
     * internes qui ne concernent pas les citoyens et n'y sont pas exposés
     * (pour le moment).
     *
     * @var list<string>
     */
    public const MODULES_CITOYEN = [
        'etat-civil',
        'finances',
        'services-techniques',
        'urbanisme',
    ];

    public static function permissionForModule(string $module): string
    {
        return 'access.'.$module;
    }

    /** @return list<string> */
    public static function permissionsForUser(User $user): array
    {
        if ($user->hasRole('maire')) {
            return array_map(fn (string $m) => self::permissionForModule($m), self::MODULES);
        }

        return $user->getAllPermissions()
            ->pluck('name')
            ->filter(fn (string $p) => str_starts_with($p, 'access.'))
            ->values()
            ->all();
    }

    /** @return list<string> */
    public static function allowedModules(User $user): array
    {
        if ($user->hasRole('maire')) {
            return self::MODULES;
        }

        return collect(self::permissionsForUser($user))
            ->map(fn (string $p) => substr($p, strlen('access.')))
            ->values()
            ->all();
    }

    public static function canAccessModule(User $user, string $module): bool
    {
        if ($user->hasRole('maire')) {
            return true;
        }

        if ($user->hasRole('admin') || $user->hasRole('citoyen')) {
            return false;
        }

        return $user->can(self::permissionForModule($module));
    }

    public static function resolveModuleFromPath(string $path): ?string
    {
        $parts = explode('/', trim($path, '/'));
        $seg = $parts[1] ?? null;

        if ($seg === null) {
            return null;
        }

        return match ($seg) {
            'com' => 'communication',
            'etat-civil' => 'etat-civil',
            'rh' => 'rh',
            'patrimoine' => 'patrimoine',
            'st' => 'services-techniques',
            'urb' => 'urbanisme',
            'recettes', 'depenses', 'budget', 'comptabilite', 'tresorerie', 'rapports' => 'finances',
            'dashboard' => 'finances',
            default => null,
        };
    }

    public static function dashboardPath(User $user): string
    {
        $role = $user->role ?? 'gestionnaire';

        return match ($role) {
            'citoyen' => '/citoyen',
            'maire' => '/maire',
            'admin' => '/admin',
            default => '/accueil',
        };
    }
}
