<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user for testing Task 4 Admin privileges
        User::firstOrCreate(
            ['email' => 'admin@mavi.az'],
            [
                'name' => 'Admin Menecer',
                'password' => Hash::make('admin123456'),
                'phone' => '+994 50 111 22 33',
                'role' => 'admin',
                'city' => 'Bakı',
                'address' => 'Nizami küç. 100, Mavi Boutique HQ',
            ]
        );

        // Regular customer
        User::firstOrCreate(
            ['email' => 'aydan@example.com'],
            [
                'name' => 'Aydan Şərifova',
                'password' => Hash::make('password123'),
                'phone' => '+994 50 123 45 67',
                'role' => 'customer',
                'city' => 'Bakı',
                'address' => 'Nizami küç. 45, mənzil 12',
            ]
        );
    }
}
