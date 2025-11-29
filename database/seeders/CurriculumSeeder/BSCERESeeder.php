<?php

namespace Database\Seeders\CurriculumSeeder;

use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BSCERESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
        //put back to 2022
        //1st year
        //1st sem
        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'ENGL 01',
            'course_code' => 'ENGL 01',
            'course_name' => 'Intensive English',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'SOCSC 01',
            'course_code' => 'SOCSC 01',
            'course_name' => 'Readings in Philippine History',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MATH 34',
            'course_code' => 'MATH 34',
            'course_name' => 'Engineering Calculus I',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Pre-Calculus for Engineers (ENGG 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 100',
            'course_code' => 'CERE 100',
            'course_name' => 'Ceramic Engineering as a Profession',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'PATHFit 1',
            'course_code' => 'PATHFit 1',
            'course_name' => 'Physical Activities Toward Health and Fitness I: Movement Competency Training',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'NSTP 01',
            'course_code' => 'NSTP 01',
            'course_name' => 'Civic Welfare Training Services I / Reserve Officers Training Corps I',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //1st Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'SOCSC 02',
            'course_code' => 'SOCSC 02',
            'course_name' => 'Understanding the Self',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'PHY 10',
            'course_code' => 'PHY 10',
            'course_name' => 'Physics for Engineering',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34), Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CHE 20',
            'course_code' => 'CHE 20',
            'course_name' => 'Analytical Chemistry for Engineering',
            'lec' => '2',
            'lab' => '2',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MATH 35',
            'course_code' => 'MATH 35',
            'course_name' => 'Engineering Calculus II',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'GS 100',
            'course_code' => 'GS 100',
            'course_name' => 'Principles of Geology',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 105',
            'course_code' => 'CERE 105',
            'course_name' => 'Computer Applications in Ceramic Engineering',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ceramic Engineering as a Profession (CERE 100)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'PATHFit 2',
            'course_code' => 'PATHFit 2',
            'course_name' => 'Physical Activities Toward Health and Fitness II: Exercise-based Fitness Activities',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Toward Health and Fitness I: Movement Competency Training (PATHFit 1)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'NSTP 02',
            'course_code' => 'NSTP 02',
            'course_name' => 'Civic Welface Training Services II / Reserve Officers Training Corps II',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Civic Welfare Training Services I / Reserve Officers Training Corps I (NSTP 01)'
        ]);

        //2nd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'COMM 01',
            'course_code' => 'COMM 01',
            'course_name' => 'Purposive Communication',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CAD 12',
            'course_code' => 'CAD 12',
            'course_name' => 'Computer-Aided Drawing and Drafting',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '2',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MSE 100',
            'course_code' => 'MSE 100',
            'course_name' => 'Fundamentals of Materials Science and Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10), Chemistry for Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MSE 100',
            'course_code' => 'MSE 100',
            'course_name' => 'Fundamentals of Materials Science and Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10), Chemistry for Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'GS 101',
            'course_code' => 'GS 101',
            'course_name' => 'Elements of Mineralogy',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Principles of Geology (GS 100)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MECH 101',
            'course_code' => 'MECH 101',
            'course_name' => 'Statics of Rigid Bodies',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10), Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MSE 101',
            'course_code' => 'MSE 101',
            'course_name' => 'Thermodynamics of Materials',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 106',
            'course_code' => 'CERE 106',
            'course_name' => 'Ceramic Measurements',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'PATHFit 3',
            'course_code' => 'PATHFit 3',
            'course_name' => 'Physical Activities Toward Health and Fitness III (Dance)',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Toward Health and Fitness II: Exercise-based Fitness Activities (PATHFit 2)'
        ]);

        //2nd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'PHILO 01',
            'course_code' => 'PHILO 01',
            'course_name' => 'Ethics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'HUM 11',
            'course_code' => 'HUM 11',
            'course_name' => 'Philippine Popular Culture',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MATH 50',
            'course_code' => 'MATH 50',
            'course_name' => 'Engineering Data Analysis',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MECH 102',
            'course_code' => 'MECH 102',
            'course_name' => 'Dynamics of Rigid Bodies',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Statics of Rigid Bodies (MECH 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 111',
            'course_code' => 'CERE 111',
            'course_name' => 'Phase Equilibria in Ceramic Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Thermodynamics of Materials (MSE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 112',
            'course_code' => 'CERE 112',
            'course_name' => 'Crystal Chemistry',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers (CHE 10), Fundamentals of Materials Science and Engineering (MSE 100)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 114',
            'course_code' => 'CERE 114',
            'course_name' => 'Microscopy and X-ray Characterization',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Elements of Mineralogy (GS 101),'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 122',
            'course_code' => 'CERE 122',
            'course_name' => 'Ceramic Raw Materials and Processes',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Analytical Chemistry for Engineering (CHE 20), Fundamentals of Materials Science and Engineering (MSE 100)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'PATHFit 4',
            'course_code' => 'PATHFit 4',
            'course_name' => 'Physical Activities Toward Health and Fitness IV (Sports)',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Toward Health and Fitness III (Dance) (PATHFit 3)'
        ]);

        //3rd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'HUM 01',
            'course_code' => 'HUM 01',
            'course_name' => 'Art Appreciation',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'SOCSC 03',
            'course_code' => 'SOCSC 03',
            'course_name' => 'The Contemporary World',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'SOCSC 12',
            'course_code' => 'SOCSC 12',
            'course_name' => 'Entrepreneurial Mind',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'NATSC 14',
            'course_code' => 'NATSC 14',
            'course_name' => 'People and the Earth\'s Ecosystem',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'IE 111',
            'course_code' => 'IE 111',
            'course_name' => 'Engineering Economics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 115',
            'course_code' => 'CERE 115',
            'course_name' => 'Rheometry and Rheology',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Dynamics of Rigid Bodies (MECH 102)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 126',
            'course_code' => 'CERE 126',
            'course_name' => 'Thermo-mechanical Properties',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fundamentals of Materials Science and Engineering (MSE 100)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 131',
            'course_code' => 'CERE 131',
            'course_name' => 'Glazes and Enamels',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Phase Equilibria in Ceramic Engineering (CERE 111), Thermo-mechanical Properties (CERE 126)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 136',
            'course_code' => 'CERE 136',
            'course_name' => 'Refactories and Kiln Design',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ceramic Raw Materials and Processes (CERE 122)'
        ]);

        //3rd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'PI 01',
            'course_code' => 'PI 01',
            'course_name' => 'Life and Works of Rizal',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'STS 01',
            'course_code' => 'STS 01',
            'course_name' => 'Science, Technology and Society',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'EE 10',
            'course_code' => 'EE 10',
            'course_name' => 'Basic Electrical Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'ENGG 101',
            'course_code' => 'ENGG 101',
            'course_name' => 'Technopreneurship 101',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Entrepreneurial Mind (SOCSC 12)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 107',
            'course_code' => 'CERE 107',
            'course_name' => 'Design and Analysis of Experiments in Ceramic Engineering',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Data Analysis (MATH 50)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 132',
            'course_code' => 'CERE 132',
            'course_name' => 'Cement Manufacturing Technology',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ceramic Raw Materials and Processes (CERE 122)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 133',
            'course_code' => 'CERE 133',
            'course_name' => 'Ceramic Whitewaves (Production of Ceramic Wares)',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ceramic Raw Materials and Processes (CERE 122)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 134',
            'course_code' => 'CERE 134',
            'course_name' => 'Structural Clay Products (Production of Ceramic Wares)',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ceramic Raw Materials and Processes (CERE 122)'
        ]);

        //3rd Year
        //Midyear

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 194',
            'course_code' => 'CERE 194',
            'course_name' => 'Structural Clay Products (Production of Ceramic Wares)',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'ES 101',
            'course_code' => 'ES 101',
            'course_name' => 'Environmental Science',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MSE 102',
            'course_code' => 'MSE 102',
            'course_name' => 'Kinetics of Materials and Processes',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MECH 103',
            'course_code' => 'MECH 103',
            'course_name' => 'Mechanics of Deformable Bodies',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Statics of Rigid Bodies (MECH 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 128',
            'course_code' => 'CERE 128',
            'course_name' => 'Quality Assurance',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Data Analysis (MATH 50), Ceramic Measurements (CERE 106)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 130',
            'course_code' => 'CERE 130',
            'course_name' => 'Glass Manufacturing Technology',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ceramic Raw Materials and Processes (CERE 122)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 197',
            'course_code' => 'CERE 197',
            'course_name' => 'Ceramic Engineering Plant Design',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 198',
            'course_code' => 'CERE 198',
            'course_name' => 'Ceramic Engineering Research Project (Proposal Writing)',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Design and Analysis of Experiments in Ceramic Engineering (CERE 107)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 199',
            'course_code' => 'CERE 199',
            'course_name' => 'Law, Ethics, Seminars and Plant Visits',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        //4th Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'MECH 105B',
            'course_code' => 'MECH 105B',
            'course_name' => 'Fluid Mechanics',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Dynamics of Rigid Bodies (MECH 102)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'IE 113',
            'course_code' => 'IE 113',
            'course_name' => 'Engineering Management',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Economics (IE 111), 4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 116',
            'course_code' => 'CERE 116',
            'course_name' => 'Spectroscopy',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Analytical Chemistry for Engineering (CHE 20)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 142',
            'course_code' => 'CERE 142',
            'course_name' => 'Electrical, Magnetic and Optical Properties of Ceramics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fundamentals of Materials Science and Engineering (MSE 100)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 143',
            'course_code' => 'CERE 143',
            'course_name' => 'Advanced Ceramics',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ceramic Raw Materials and Processes (CERE 122), Thermo-mechanical Properties (CERE 126)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 191',
            'course_code' => 'CERE 191',
            'course_name' => 'Special Topics in Ceramic Engineering',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCERE',
            'program_name' => 'Bachelor of Science in Ceramic Engineering',
            'control_code' => 'CERE 200',
            'course_code' => 'CERE 200',
            'course_name' => 'Undergraduate Thesis',
            'lec' => '0',
            'lab' => '3',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Design and Analysis of Experiments in Ceramic Engineering (CERE 107), Ceramic Engineering Research Project (CERE 198)'
        ]);
    }
}
