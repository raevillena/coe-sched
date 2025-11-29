<?php

namespace Database\Seeders;

use App\Models\MaintenanceManagement\ControlBuilding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BuildingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ControlBuilding::create([
            'building_name' => 'Main Building',
            'is_active' => '1'
        ]); 

        ControlBuilding::create([
            'building_name' => 'New Building Phase 1',
            'is_active' => '1'
        ]); 
    }
}
