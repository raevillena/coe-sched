<?php

namespace Database\Seeders;

use App\Models\MaintenanceManagement\ControlFloor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FloorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ControlFloor::create([
            'floor_name' => 'Ground Floor',
            'is_active' => '1'
        ]); 

        ControlFloor::create([
            'floor_name' => '2nd Floor',
            'is_active' => '1'
        ]); 
    }
}
