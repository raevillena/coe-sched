<?php

namespace Database\Seeders;

use App\Models\MaintenanceManagement\ControlLevel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class YearLevelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ControlLevel::create([
            'level_name' => '1st Year',
            'is_active' => '1'
        ]); 

        ControlLevel::create([
            'level_name' => '2nd Year',
            'is_active' => '1'
        ]); 

        ControlLevel::create([
            'level_name' => '3rd Year',
            'is_active' => '1'
        ]); 

        ControlLevel::create([
            'level_name' => '4th Year',
            'is_active' => '1'
        ]); 
    }
}
