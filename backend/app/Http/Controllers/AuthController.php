<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $v = $request->validate([
            'name'                  => 'required|string|max:150',
            'email'                 => 'required|email|unique:users,email',
            'password'              => ['required', 'confirmed', Password::defaults()],
            'password_confirmation' => 'required',
        ]);

        $user = User::create([
            'name'     => $v['name'],
            'email'    => $v['email'],
            'password' => Hash::make($v['password']),
            'role'     => 'citoyen',
        ]);
        $user->assignRole('citoyen');

        $token = $user->createToken('gmdi-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken('gmdi-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function refresh(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        $token = $user->createToken('gmdi-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->userPayload($user),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($this->userPayload($request->user()));
    }

    /**
     * Envoyer un email de réinitialisation de mot de passe.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        // Réponse générique pour ne pas révéler si l'email existe (sécurité)
        if (!$user) {
            return response()->json([
                'message' => 'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.'
            ]);
        }

        $token = Str::random(64);

        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'email'      => $user->email,
                'token'      => Hash::make($token),
                'created_at' => now(),
            ]
        );

        $resetUrl = config('app.frontend_url', 'http://localhost:4200')
            . '/reset-password?token=' . $token
            . '&email=' . urlencode($user->email);

        try {
            Mail::send('emails.reset-password', [
                'user'     => $user,
                'resetUrl' => $resetUrl,
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('🔐 Réinitialisation de votre mot de passe — E-Mairie');
            });
        } catch (\Exception $e) {
            Log::error('Mail reset failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.'
        ]);
    }

    /**
     * Réinitialiser le mot de passe avec le token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'token'                 => 'required|string',
            'password'              => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        $record = \DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 422);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            \DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Le lien a expiré. Veuillez en demander un nouveau.'], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);
        \DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        $user->tokens()->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.']);
    }

    /**
     * Changer le mot de passe depuis le profil citoyen.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password'      => 'required',
            'password'              => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);
        $user->tokens()->delete();

        return response()->json(['message' => 'Mot de passe modifié avec succès. Veuillez vous reconnecter.']);
    }

    private function userPayload(User $user): array
    {
        return [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'role'        => $user->role ?? 'agent',
            'roles'       => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];
    }
}
