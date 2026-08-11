<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeploySetupTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_rejects_a_missing_or_wrong_token(): void
    {
        putenv('DEPLOY_TOKEN=secret123');

        $this->getJson('/api/system/deploy-setup')->assertStatus(403);
        $this->getJson('/api/system/deploy-setup?token=wrong')->assertStatus(403);
    }

    public function test_it_seeds_the_database_when_the_token_matches(): void
    {
        putenv('DEPLOY_TOKEN=secret123');

        $this->getJson('/api/system/deploy-setup?token=secret123')->assertOk();

        $this->assertDatabaseHas('users', ['email' => 'maire@emairie.ci']);
        $this->assertTrue(User::where('email', 'maire@emairie.ci')->first()->hasRole('maire'));
    }
}
