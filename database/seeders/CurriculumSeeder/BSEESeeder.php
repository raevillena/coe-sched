<?php

namespace Database\Seeders\CurriculumSeeder;

use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BSEESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //BSEE
        //1st year
        //1st sem
        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ENGG 10',
            'course_code' => 'ENGG 10',
            'course_name' => 'Pre-Calculus for Engineers',
            'lec' => '1',
            'lab' => '2',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MATH 34',
            'course_code' => 'MATH 34',
            'course_name' => 'Engineering Calculus I',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'CHE 10',
            'course_code' => 'CHE 10',
            'course_name' => 'Chemistry for Engineers',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'CAD 11',
            'course_code' => 'CAD 11',
            'course_name' => 'Computer Aided Draft',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MATH 01',
            'course_code' => 'MATH 01',
            'course_name' => 'Mathematics in the Modern World',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'SOCSC 02',
            'course_code' => 'SOCSC 02',
            'course_name' => 'Understanding the Self',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'STS 01',
            'course_code' => 'STS 01',
            'course_name' => 'Science, Technology and Society',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'PATHFit 1',
            'course_code' => 'PATHFit 1',
            'course_name' => 'Movement Competency Training',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'NSTP 01',
            'course_code' => 'NSTP 01',
            'course_name' => 'CWTS 1/ ROTC 1',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //1st year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MATH 35',
            'course_code' => 'MATH 35',
            'course_name' => 'Engineering Calculus II',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Pre-Calculus for Engineers (ENGG 10), Engineering Calculus I (MATH 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'COMP 01',
            'course_code' => 'COMP 01',
            'course_name' => 'Computer Fundamentals and Programming',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'PHY 10',
            'course_code' => 'PHY 10',
            'course_name' => 'Physics for Engineers',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34), Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ENGL 01',
            'course_code' => 'ENGL 01',
            'course_name' => 'Intensive English',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'IT 11',
            'course_code' => 'IT 11',
            'course_name' => 'Living in the IT Era',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'COMM 01',
            'course_code' => 'COMM 01',
            'course_name' => 'Purposive Communication',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'PHILO 01',
            'course_code' => 'PHILO 01',
            'course_name' => 'Ethics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'PATHFit 2',
            'course_code' => 'PATHFit 2',
            'course_name' => 'Exercise-based Fitness Activity',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Movement Competency Training (PATHFit 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'NSTP 02',
            'course_code' => 'NSTP 02',
            'course_name' => 'CWTS 2 / ROTC 2',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'CWTS 1 /ROTC 1 (NSTP 01)'
        ]);

        //2nd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MATH 40',
            'course_code' => 'MATH 40',
            'course_name' => 'Differential Equations',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 121',
            'course_code' => 'EE 121',
            'course_name' => 'Electrical Circuits I',
            'lec' => '4',
            'lab' => '1',
            'units' => '5',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10),Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MECH 100',
            'course_code' => 'MECH 100',
            'course_name' => 'Engineering Mechanics',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ME 100',
            'course_code' => 'ME 100',
            'course_name' => 'Basic Thermodynamics',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'HUM 11',
            'course_code' => 'HUM 11',
            'course_name' => 'Philippine Popular Culture',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MATH 50',
            'course_code' => 'MATH 50',
            'course_name' => 'Engineering Data Analysis',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Mathematics in the Modern World (MATH 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'PATHFit 3',
            'course_code' => 'PATHFit 3',
            'course_name' => 'Physical Activities Toward Health and Fitness 3 (Dance)',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Exercise-based Fitness Activity (PATHFit 2)'
        ]);

        //2nd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 101',
            'course_code' => 'EE 101',
            'course_name' => 'Engineering Math for EE',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equations (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MECH 106',
            'course_code' => 'MECH 106',
            'course_name' => 'Fundamentals of Deformable Bodies',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Mechanics (MECH 100)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 124',
            'course_code' => 'EE 124',
            'course_name' => 'Electrical Circuits II',
            'lec' => '4',
            'lab' => '1',
            'units' => '5',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Circuits I (EE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'SOCSC 12',
            'course_code' => 'SOCSC 12',
            'course_name' => 'The Entrepreneurial Mind',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'HUM 01',
            'course_code' => 'HUM 01',
            'course_name' => 'Art Appreciation',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ECE 121',
            'course_code' => 'ECE 121',
            'course_name' => 'Electronic Circuits: Devices and Analysis',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Circuits I (EE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 126',
            'course_code' => 'EE 126',
            'course_name' => 'Electromagnetics for EE',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10), Differential Equations (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'PATHFit 4',
            'course_code' => 'PATHFit 4',
            'course_name' => 'Physical Activities Toward Health and Fitness 4 (Sports)',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Exercise-based Fitness Activity (PATHFit 2)'
        ]);

        //3rd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 131',
            'course_code' => 'EE 131',
            'course_name' => 'Numerical Methods and Analysis',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Math for EE (EE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ECE 126',
            'course_code' => 'ECE 126',
            'course_name' => 'Logic Circuits and Switching Theory',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronic Circuits: Devices and Analysis (ECE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 111',
            'course_code' => 'EE 111',
            'course_name' => 'Engineering Economics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Data Analysis (MATH 50)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ECE 124',
            'course_code' => 'ECE 124',
            'course_name' => 'Industrial Electronics',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronic Circuits: Devices and Analysis (ECE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ECE 152',
            'course_code' => 'ECE 152',
            'course_name' => 'Fundamentals of Electronic Communications',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronic Circuits: Devices and Analysis (ECE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 133',
            'course_code' => 'EE 133',
            'course_name' => 'Electrical Machines I',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Circuits II (EE 124), Electromagnetics for EE (EE 126)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'SOCSC 03',
            'course_code' => 'SOCSC 03',
            'course_name' => 'Contemporary World',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ENGG 101',
            'course_code' => 'ENGG 101',
            'course_name' => 'Technopreneurship',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'The Entrepreneurial Mind (SOCSC 12)'
        ]);

        //3rd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'CPE 135',
            'course_code' => 'CPE 135',
            'course_name' => 'Microprocessor Systems for EE',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Logic Circuits and Switching Theory (ECE 126)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 130',
            'course_code' => 'EE 130',
            'course_name' => 'Feedback Control Systems',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Math for EE (EE 101), Electronic Circuits: Devices and Analysis (ECE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 132',
            'course_code' => 'EE 132',
            'course_name' => 'Electrical Apparatus and Devices',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Circuits II (EE 124)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 134',
            'course_code' => 'EE 134',
            'course_name' => 'Electrical Machines II',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Machines I (EE 133)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 190',
            'course_code' => 'EE 190',
            'course_name' => 'Research Methods',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Data Analysis (MATH 50)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MECH 105A',
            'course_code' => 'MECH 105A',
            'course_name' => 'Fluid Mechanics for EE',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'ESE 101',
            'course_code' => 'ESE 101',
            'course_name' => 'Environmental Science and Engineering',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 192',
            'course_code' => 'EE 192',
            'course_name' => 'EE Laws, Codes, and Professional Ethics',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ethics (PHILO 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'SOCSC 01',
            'course_code' => 'SOCSC 01',
            'course_name' => 'Readings in the Philippine History',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //MID Year
        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 198',
            'course_code' => 'EE 198',
            'course_name' => 'On-the-Job Training (240 Hours)',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '3rd Year',
            'period' => 'Mid Year',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        //4th Year
        //1st Semester
        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'MSE 100',
            'course_code' => 'MSE 100',
            'course_name' => 'Fundamentals of Material Science and Engineering',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers (CHE 10), Fundamentals of Deformable Bodies (MECH 106)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 141',
            'course_code' => 'EE 141',
            'course_name' => 'Electrical Standards and Practices',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'EE Laws, Codes, and Professional Ethics (EE 192)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 143',
            'course_code' => 'EE 143',
            'course_name' => 'Electrical Systems and Illumination Engineering Design',
            'lec' => '3',
            'lab' => '2',
            'units' => '5',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Machines II (EE 134)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 145',
            'course_code' => 'EE 145',
            'course_name' => 'Power System Protection I',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 147',
            'course_code' => 'EE 147',
            'course_name' => 'Instrumentation and Control',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Feedback Control Systems (EE 130)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'TCEP 197A',
            'course_code' => 'TCEP 197A',
            'course_name' => 'Technical Competency Enhancement Program I',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 136',
            'course_code' => 'EE 136',
            'course_name' => 'Basic Occupational Safety and Health',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'EE Laws, Codes, and Professional Ethics (EE 192)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 200A',
            'course_code' => 'EE 200A',
            'course_name' => 'Undergraduate Thesis or Capstone and Design Project I',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Research Methods (EE 190)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'PI 01',
            'course_code' => 'PI 01',
            'course_name' => 'Life and Works of Rizal',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //4th Year
        //2nd Semester
        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 114',
            'course_code' => 'EE 114',
            'course_name' => 'Management of Engineering Projects',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Economics (EE 111)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 142',
            'course_code' => 'EE 142',
            'course_name' => 'Power System Analysis',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Standards and Practices (EE 141)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 144',
            'course_code' => 'EE 144',
            'course_name' => 'Fundamentals of Power Plant Engienering Design',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Power System Analysis (EE 142)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 146',
            'course_code' => 'EE 146',
            'course_name' => 'Distribution Systems and Substation Design',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Power System Analysis (EE 142)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 148',
            'course_code' => 'EE 148',
            'course_name' => 'Power System Protection II',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Power System Protection I (EE 145)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 149',
            'course_code' => 'EE 149',
            'course_name' => 'Renewable Energy Sources and Technologies',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'TCEP 197B',
            'course_code' => 'TCEP 197B',
            'course_name' => 'Technical Competency Enhancement Program II',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Technical Competency Enhancement Program I (TCEP 197A)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSEE',
            'program_name' => 'Bachelor of Science in Electrical Engineering',
            'control_code' => 'EE 200B',
            'course_code' => 'EE 200B',
            'course_name' => 'Undergraduate Thesis or Capstone Design Project II',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Undergraduate Thesis or Capstone and Design Project I (EE 200A)'
        ]);
    }
}
