<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\GmdiRolesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegisterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(GmdiRolesSeeder::class);
    }

    public function test_a_citizen_can_register_and_is_logged_in(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.com',
            'password' => 'motdepasse123',
            'password_confirmation' => 'motdepasse123',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('user.role', 'citoyen')
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']]);

        $this->assertDatabaseHas('users', ['email' => 'jean.dupont@example.com']);
        $this->assertTrue(User::where('email', 'jean.dupont@example.com')->first()->hasRole('citoyen'));
    }

    public function test_registration_rejects_a_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existe@example.com']);

        $this->postJson('/api/auth/register', [
            'name' => 'Autre',
            'email' => 'existe@example.com',
            'password' => 'motdepasse123',
            'password_confirmation' => 'motdepasse123',
        ])->assertStatus(422);
    }

    public function test_registration_rejects_a_password_under_eight_characters(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'Test',
            'email' => 'court@example.com',
            'password' => 'test123',
            'password_confirmation' => 'test123',
        ])->assertStatus(422);
    }
}
