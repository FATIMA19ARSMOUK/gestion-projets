<?php

namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = DB::table('roles')
            ->where('name', 'Admin')
            ->first();

        if (!$adminRole) {
            $this->command->error('Le rôle Admin n’existe pas.');
            return;
        }

        User::updateOrCreate(
            ['email' => 'admin.test@example.com'],
            [
                'name' => 'Admin Test',
                'password' => Hash::make('Admin12345'),
                'role_id' => $adminRole->id,
            ]
        );

        $this->command->info('Compte Admin créé ou mis à jour avec succès.');
    }
}
