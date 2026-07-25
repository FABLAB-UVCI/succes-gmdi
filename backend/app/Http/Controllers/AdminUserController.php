<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return response()->json([
            'data' => $users->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'roles' => $u->getRoleNames(),
                'allowed_modules' => \App\Support\GmdiAccess::allowedModules($u),
                'created_at' => $u->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $v = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::defaults()],
            'role' => 'required|in:gestionnaire,maire,admin',
            'module' => 'nullable|string|in:'.implode(',', \App\Support\GmdiAccess::MODULES),
        ]);

        if ($v['role'] === 'gestionnaire' && empty($v['module'])) {
            throw ValidationException::withMessages([
                'module' => ['Le module est obligatoire pour un gestionnaire.'],
            ]);
        }

        $user = User::create([
            'name' => $v['name'],
            'email' => $v['email'],
            'password' => Hash::make($v['password']),
            'role' => $v['role'],
        ]);

        $user->syncRoles([$v['role']]);
        if ($v['role'] === 'gestionnaire' && ! empty($v['module'])) {
            $user->givePermissionTo(\App\Support\GmdiAccess::permissionForModule($v['module']));
        }

        return response()->json([
            'success' => true,
            'message' => 'Compte professionnel créé.',
            'data' => ['id' => $user->id, 'email' => $user->email],
        ], 201);
    }
}
