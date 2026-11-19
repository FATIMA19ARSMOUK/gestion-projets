<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ChefProjetSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'Chef de projet')->firstOrFail();

        User::updateOrCreate(
            ['email' => 'chef.projet@example.com'],
            [
                'name' => 'Chef Projet Test',
                'password' => Hash::make('Chef12345!'),
                'role_id' => $role->id,
            ]
        );
    }
}
