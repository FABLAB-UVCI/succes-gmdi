<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\GmdiRolesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(GmdiRolesSeeder::class);
    }

    public function test_a_non_admin_cannot_create_accounts(): void
    {
        $gestionnaire = User::factory()->create(['role' => 'gestionnaire']);
        $gestionnaire->assignRole('gestionnaire');

        $this->actingAs($gestionnaire)->postJson('/api/admin/users', [
            'name' => 'Nouvel Agent',
            'email' => 'nouvel.agent@example.com',
            'role' => 'gestionnaire',
            'module' => 'etat-civil',
        ])->assertStatus(403);
    }

    public function test_an_admin_can_create_a_gestionnaire_account_without_seeing_the_password(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->postJson('/api/admin/users', [
            'name' => 'Nouvel Agent',
            'email' => 'nouvel.agent@example.com',
            'role' => 'gestionnaire',
            'module' => 'etat-civil',
        ]);

        $response->assertStatus(201);
        $response->assertJsonMissingPath('data.password');
        $this->assertStringNotContainsString('password', strtolower(json_encode($response->json())));

        $created = User::where('email', 'nouvel.agent@example.com')->first();
        $this->assertNotNull($created);
        $this->assertTrue($created->hasRole('gestionnaire'));
        $this->assertTrue($created->can('access.etat-civil'));
    }

    public function test_creating_a_gestionnaire_without_a_module_fails(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $this->actingAs($admin)->postJson('/api/admin/users', [
            'name' => 'Nouvel Agent',
            'email' => 'nouvel.agent@example.com',
            'role' => 'gestionnaire',
        ])->assertStatus(422);
    }

    public function test_admin_can_list_and_delete_accounts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');
        $gestionnaire = User::factory()->create(['role' => 'gestionnaire']);
        $gestionnaire->assignRole('gestionnaire');

        $this->actingAs($admin)->getJson('/api/admin/users')->assertOk();

        $this->actingAs($admin)->deleteJson("/api/admin/users/{$gestionnaire->id}")->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $gestionnaire->id]);
    }
}
