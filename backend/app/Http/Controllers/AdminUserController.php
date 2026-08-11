<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\GmdiAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    private const ROLE_LABELS = [
        'admin' => 'Administrateur',
        'maire' => 'Maire',
        'gestionnaire' => 'Gestionnaire de module',
    ];

    private const MODULE_LABELS = [
        'communication' => 'Communication',
        'etat-civil' => 'État civil',
        'finances' => 'Finances',
        'patrimoine' => 'Patrimoine',
        'rh' => 'Ressources humaines',
        'services-techniques' => 'Services techniques',
        'urbanisme' => 'Urbanisme / SIG',
    ];

    public function index(Request $request): JsonResponse
    {
        $this->denyIfNotAdmin($request);

        $users = User::whereIn('role', ['admin', 'maire', 'gestionnaire'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return response()->json([
            'data' => $users->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'roleLabel' => self::ROLE_LABELS[$u->role] ?? $u->role,
                'modules' => GmdiAccess::allowedModules($u),
                'created_at' => $u->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->denyIfNotAdmin($request);

        $v = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:gestionnaire,maire,admin',
            'module' => ['nullable', 'string', 'in:' . implode(',', GmdiAccess::MODULES)],
        ]);

        if ($v['role'] === 'gestionnaire' && empty($v['module'])) {
            throw ValidationException::withMessages([
                'module' => ['Le module est obligatoire pour un gestionnaire.'],
            ]);
        }

        // Mot de passe généré côté serveur : l'administrateur qui crée le
        // compte ne le voit jamais, seul le titulaire le reçoit par e-mail.
        $plainPassword = Str::password(14);

        $user = User::create([
            'name' => $v['name'],
            'email' => $v['email'],
            'password' => Hash::make($plainPassword),
            'role' => $v['role'],
        ]);

        $user->assignRole($v['role']);
        if ($v['role'] === 'gestionnaire' && ! empty($v['module'])) {
            $user->givePermissionTo(GmdiAccess::permissionForModule($v['module']));
        }

        try {
            Mail::send('emails.new-account', [
                'user' => $user,
                'password' => $plainPassword,
                'roleLabel' => self::ROLE_LABELS[$v['role']] ?? $v['role'],
                'moduleLabel' => self::MODULE_LABELS[$v['module'] ?? ''] ?? null,
                'loginUrl' => config('app.frontend_url', 'http://localhost:4200') . '/login',
            ], function ($message) use ($user) {
                $message->to($user->email)->subject('🔐 Votre compte E-Mairie a été créé');
            });
        } catch (\Exception $e) {
            Log::error("Erreur envoi email création de compte: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => "Compte créé. Les identifiants ont été envoyés à {$user->email}.",
            'data' => ['id' => $user->id, 'email' => $user->email],
        ], 201);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->denyIfNotAdmin($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Compte supprimé.']);
    }

    private function denyIfNotAdmin(Request $request): void
    {
        $user = $request->user();
        if (! $user->hasRole('admin') && $user->role !== 'admin') {
            abort(403, 'Réservé aux administrateurs.');
        }
    }
}
