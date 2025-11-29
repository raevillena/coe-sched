<?php

namespace Database\Seeders;

use App\Models\MaintenanceManagement\ControlSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //BSCPE 
        //1st year
        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCPE 1-A',
            'is_active' => '1'
        ]); 

        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCPE 1-B',
            'is_active' => '1'
        ]); 
        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCPE 1-C',
            'is_active' => '1'
        ]);

        //2nd year
        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCPE 2-A',
            'is_active' => '1'
        ]); 

        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCPE 2-B',
            'is_active' => '1'
        ]); 

        //3rd year
        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCPE 3-A',
            'is_active' => '1'
        ]); 

        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCPE 3-B',
            'is_active' => '1'
        ]); 

        //4th Year
        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCPE 4-A',
            'is_active' => '1'
        ]); 

        ControlSection::create([
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCPE 4-B',
            'is_active' => '1'
        ]); 

        //BSECE
        //1st Year
        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '1st Year',
            'section_name' => 'BSECE 1-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '1st Year',
            'section_name' => 'BSECE 1-B',
            'is_active' => '1'
        ]);

        //2nd Year
        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSECE 2-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSECE 2-B',
            'is_active' => '1'
        ]);

        //3rd year
        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSECE 3-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSECE 3-B',
            'is_active' => '1'
        ]);

        //4th Year
        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '4th Year',
            'section_name' => 'BSECE 4-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'level' => '4th Year',
            'section_name' => 'BSECE 4-B',
            'is_active' => '1'
        ]);

        //BSEE
        //1st Year
        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '1st Year',
            'section_name' => 'BSEE 1-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '1st Year',
            'section_name' => 'BSEE 1-B',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '1st Year',
            'section_name' => 'BSEE 1-C',
            'is_active' => '1'
        ]);

        //2nd Year
        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSEE 2-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSEE 2-B',
            'is_active' => '1'
        ]);
        //3rd Year
        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSEE 3-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSEE 3-B',
            'is_active' => '1'
        ]);
        //4th Year
        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '4th Year',
            'section_name' => 'BSEE 4-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'level' => '4th Year',
            'section_name' => 'BSEE 4-B',
            'is_active' => '1'
        ]);

        //BSCE
        //1st Year
        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCE 1-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCE 1-B',
            'is_active' => '1'
        ]);

        //2nd Year
        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCE 2-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCE 2-B',
            'is_active' => '1'
        ]);

        //3rd Year
        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCE 3-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCE 3-B',
            'is_active' => '1'
        ]);
        //4th Year
        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCE 4-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCE 4-B',
            'is_active' => '1'
        ]);

        //BSCHE
        //1st Year
        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCHE 1-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCHE 1-B',
            'is_active' => '1'
        ]);
        //2nd Year
        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCHE 2-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCHE 2-B',
            'is_active' => '1'
        ]);
        //3rd Year
        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCHE 3-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCHE 3-B',
            'is_active' => '1'
        ]);
        //4th Year
        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCHE 4-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCHE 4-B',
            'is_active' => '1'
        ]);

        
        //BSME
        //1st Year
        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '1st Year',
            'section_name' => 'BSME 1-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '1st Year',
            'section_name' => 'BSME 1-B',
            'is_active' => '1'
        ]);

        //2nd Year
        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSME 2-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSME 2-B',
            'is_active' => '1'
        ]);
        //3rd Year
        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSME 3-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSME 3-B',
            'is_active' => '1'
        ]);
        //4th Year
        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '4th Year',
            'section_name' => 'BSME 4-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'level' => '4th Year',
            'section_name' => 'BSME 4-B',
            'is_active' => '1'
        ]);

        
        //BSABE
        //1st Year
        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '1st Year',
            'section_name' => 'BSABE 1-A',
            'is_active' => '1'
        ]);
        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '1st Year',
            'section_name' => 'BSABE 1-B',
            'is_active' => '1'
        ]);

        //2nd Year
        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSABE 2-A',
            'is_active' => '1'
        ]);
        
        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSABE 2-B',
            'is_active' => '1'
        ]);

        //3rd Year
        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSABE 3-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSABE 3-B',
            'is_active' => '1'
        ]);

        //4th Year
        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '4th Year',
            'section_name' => 'BSABE 4-A',
            'is_active' => '1'
        ]);

        ControlSection::create([
            'program_code' => 'BSABE',
            'program_name' => 'Bachelor of Science in Agricultural and Biosystems Engineering',
            'level' => '4th Year',
            'section_name' => 'BSABE 4-B',
            'is_active' => '1'
        ]);


        //BSCERE
        //1st Year
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCERE 1-A',
            'is_active' => '1'
        ]);
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '1st Year',
            'section_name' => 'BSCERE 1-B',
            'is_active' => '1'
        ]);

        //2nd Year
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCERE 2-A',
            'is_active' => '1'
        ]);
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '2nd Year',
            'section_name' => 'BSCERE 2-B',
            'is_active' => '1'
        ]);

        //3rd Year
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCERE 3-A',
            'is_active' => '1'
        ]);
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '3rd Year',
            'section_name' => 'BSCERE 3-B',
            'is_active' => '1'
        ]);

        //4th Year
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCERE 4-A',
            'is_active' => '1'
        ]);
        
        ControlSection::create([
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'level' => '4th Year',
            'section_name' => 'BSCERE 4-B',
            'is_active' => '1'
        ]);

    }
}
