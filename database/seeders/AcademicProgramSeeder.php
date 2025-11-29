<?php

namespace Database\Seeders;

use App\Models\Curriculum\AcademicPrograms;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Faculty\Department;

class AcademicProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = Department::all();

        foreach ($departments as $department) {

            $programName = $department->name;   
            $programCode = $department->program_code;  
                   
            AcademicPrograms::create([
                'academic_type' => 'College',
                'department_id' => $department->id,
                'program_code' => $programCode,
                'program_name' => "Bachelor of Science in " . $programName,
            ]);
        }
    }
}
