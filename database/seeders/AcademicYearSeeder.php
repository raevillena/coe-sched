<?php

namespace Database\Seeders;

use App\Models\MaintenanceManagement\ControlAcademicYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ControlAcademicYear::create([ //2024-2025
            'academic_year' => '2024',
            'is_active' => '1'
        ]); 

        ControlAcademicYear::create([ //2023-2024
            'academic_year' => '2023',
            'is_active' => '1'
        ]); 

        ControlAcademicYear::create([ //2022-2023
            'academic_year' => '2022',
            'is_active' => '1'
        ]); 
    }
}
