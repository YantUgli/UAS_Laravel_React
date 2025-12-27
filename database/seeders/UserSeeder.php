<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin UAS',
            'email' => 'admin@uas.com',
            'password' => Hash::make('password123'),
            'role' => 'admin'
        ]);

        // User biasa
        User::create([
            'name' => 'User Biasa',
            'email' => 'user@uas.com',
            'password' => Hash::make('password123'),
            'role' => 'user'
        ]);
    }
}