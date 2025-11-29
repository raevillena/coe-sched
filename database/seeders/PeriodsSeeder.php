<?php

namespace Database\Seeders;

use App\Models\MaintenanceManagement\ControlPeriod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PeriodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ControlPeriod::create([
            'period_name' => '1st Semester',
            'is_active' => '1'
        ]); 

        ControlPeriod::create([
            'period_name' => '2nd Semester',
            'is_active' => '1'
        ]); 
        
        ControlPeriod::create([
            'period_name' => 'Mid Year',
            'is_active' => '1'
        ]); 
    }
}
