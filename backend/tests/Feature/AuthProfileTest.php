<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_update_their_profile_information(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->putJson('/api/auth/profile', [
            'telephone' => '0707010203',
            'commune' => 'Cocody',
            'numero_cni' => 'CI1234567890',
            'date_naissance' => '1995-06-15',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.telephone', '0707010203')
            ->assertJsonPath('user.commune', 'Cocody');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'telephone' => '0707010203',
            'commune' => 'Cocody',
            'numero_cni' => 'CI1234567890',
        ]);
    }

    public function test_updating_the_profile_requires_authentication(): void
    {
        $this->putJson('/api/auth/profile', ['telephone' => '0707010203'])
            ->assertStatus(401);
    }
}
