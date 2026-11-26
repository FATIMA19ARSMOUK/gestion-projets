<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DemoAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'TeamFlow Admin Demo',
                'email' => 'demo.admin@teamflow.test',
                'password' => 'DemoAdmin2026!',
                'role' => 'Admin',
            ],
            [
                'name' => 'TeamFlow Manager Demo',
                'email' => 'demo.manager@teamflow.test',
                'password' => 'DemoManager2026!',
                'role' => 'Chef de projet',
            ],
            [
                'name' => 'TeamFlow Member Demo',
                'email' => 'demo.member@teamflow.test',
                'password' => 'DemoMember2026!',
                'role' => 'Membre',
            ],
        ];

        foreach ($accounts as $account) {
            $role = Role::firstOrCreate([
                'name' => $account['role'],
            ]);

            User::firstOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => Hash::make($account['password']),
                    'role_id' => $role->id,
                ]
            );
        }

        $this->command->info('TeamFlow demo accounts are ready.');
    }
}