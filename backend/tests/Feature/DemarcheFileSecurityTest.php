<?php

namespace Tests\Feature;

use App\Models\Demarche;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DemarcheFileSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_uploaded_piece_is_stored_privately_and_not_publicly_reachable(): void
    {
        Storage::fake('local');
        Storage::fake('public');

        $citoyen = User::factory()->create(['role' => 'citoyen']);

        $response = $this->actingAs($citoyen)->postJson('/api/demarches', [
            'module' => 'etat-civil',
            'type_demarche' => 'Certificat de résidence',
            'files' => [UploadedFile::fake()->create('piece.pdf', 10, 'application/pdf')],
        ]);

        $response->assertStatus(201);

        $demarche = Demarche::first();
        $path = $demarche->donnees['pieces_jointes'][0]['path'];

        Storage::disk('local')->assertExists($path);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_only_the_owner_or_staff_can_download_a_piece(): void
    {
        Storage::fake('local');

        $owner = User::factory()->create(['role' => 'citoyen']);
        $other = User::factory()->create(['role' => 'citoyen']);

        $this->actingAs($owner)->postJson('/api/demarches', [
            'module' => 'etat-civil',
            'files' => [UploadedFile::fake()->create('piece.pdf', 10, 'application/pdf')],
        ])->assertStatus(201);

        $demarche = Demarche::first();

        $this->actingAs($owner)->get("/api/demarches/{$demarche->id}/pieces/0")->assertOk();
        $this->actingAs($other)->get("/api/demarches/{$demarche->id}/pieces/0")->assertStatus(403);
        // Requête non authentifiée : refusée (401 ou 403 selon le pipeline d'exceptions), jamais servie.
        $this->getJson("/api/demarches/{$demarche->id}/pieces/0")->assertStatus(403);
    }

    public function test_login_is_rate_limited_after_repeated_failures(): void
    {
        $user = User::factory()->create(['role' => 'citoyen']);

        for ($i = 0; $i < 8; $i++) {
            $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'wrong']);
        }

        $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertStatus(429);
    }
}
