<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::updateOrCreate([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('rahasia45'),
            'phone_number' => '081234567890',
            'active_year' => 2023,
            'gender' => 'L',
            'address' => 'Earth',
            'email_verified_at' => now(),
            'remember_token' => '1234567890',
        ])->assignRole('super-admin');
    }
}
