<?php

namespace Database\Seeders\CurriculumSeeder;

use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BSCHESeeder extends Seeder
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'HUM 01',
            'course_code' => 'HUM 01',
            'course_name' => 'Art Appreciation',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'SOCSC 01',
            'course_code' => 'SOCSC 01',
            'course_name' => 'Readings in the Philippine History',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'PATHFit 01',
            'course_code' => 'PATHFit 01',
            'course_name' => 'Physical Activities Towards Health and Fitness 1: Movement and Competency Training',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'NSTP 01',
            'course_code' => 'NSTP 01',
            'course_name' => 'ROTC 1/CWTS 1',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 20',
            'course_code' => 'CHE 20',
            'course_name' => 'Analytical Chemistry',
            'lec' => '4',
            'lab' => '1',
            'units' => '5',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry fort Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'COMP 01',
            'course_code' => 'COMP 01',
            'course_name' => 'Computer Fundamentals and Programing',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'MATH 34',
            'course_code' => 'MATH 34',
            'course_name' => 'Engineering Calculus I',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Pre-Calculus for Engineers (ENGG 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'PHY 10',
            'course_code' => 'PHY 10',
            'course_name' => 'Physics for Engineers',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'STS 01',
            'course_code' => 'STS 01',
            'course_name' => 'Science, Technology, and Society',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'PATHFit 2',
            'course_code' => 'PATHFit 2',
            'course_name' => 'Physical Activities Towards Health and Fitness II: Exercise-based Fitness Activities',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Towards Health and Fitness I: Movement and Competency Training (PATHFit 1)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'NSTP 02',
            'course_code' => 'NSTP 02',
            'course_name' => 'ROTC 2/CWTS 2',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'ROTC 1/CWTS 1 (NSTP 1)'
        ]);

        //2nd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 30',
            'course_code' => 'CHE 30',
            'course_name' => 'Organic Chemistry',
            'lec' => '4',
            'lab' => '1',
            'units' => '5',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Analytical Chemistry (CHE 20)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 100',
            'course_code' => 'CHE 100',
            'course_name' => 'Introduction to Chemical Engineering',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers (CHE 10), Analytical Chemistry (CHE 20)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 125',
            'course_code' => 'CHE 125',
            'course_name' => 'Chemical Engineering Calculations',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Analytical Chemistry (CHE 20)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'MATH 35',
            'course_code' => 'MATH 35',
            'course_name' => 'Engineering Calculus II',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'IT 11',
            'course_code' => 'IT 11',
            'course_name' => 'Living in the IT ERA',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'PATHFit 3',
            'course_code' => 'PATHFit 3',
            'course_name' => 'Physical Activities Towards Health and Fitness III: Dance',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Towards Health and Fitness II: Exercise-based Fitness Activities (PATHFit 2)'
        ]);

        //2nd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 126',
            'course_code' => 'CHE 126',
            'course_name' => 'Physical Chemistry for Engineers 1',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Analytical Chemistry (CHE 20), Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 153',
            'course_code' => 'CHE 153',
            'course_name' => 'Momentum Transfer',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemical Engineering Calculations (CHE 125), Differential Equation (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'MATH 40',
            'course_code' => 'MATH 40',
            'course_name' => 'Differential Equation',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CAD 11',
            'course_code' => 'CAD 11',
            'course_name' => 'Computer Aided Design',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Computer Fundamentals and Programing (COMP 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'HUM 11',
            'course_code' => 'HUM 11',
            'course_name' => 'Pop Culture',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'PI 01',
            'course_code' => 'PI 01',
            'course_name' => 'Life and Works of Rizal',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'SOCSC 02',
            'course_code' => 'SOCSC 02',
            'course_name' => 'Understanding the Self',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'PATHFit 4',
            'course_code' => 'PATHFit 4',
            'course_name' => 'Physical Activities Towards Health and Fitness IV: Sports',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Towards Health and Fitness II: Exercise-based Fitness Activities (PATHFit 2)'
        ]);

        //3rd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 101',
            'course_code' => 'CHE 101',
            'course_name' => 'Advance Engineering Mathematics in CHE',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equation (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 127',
            'course_code' => 'CHE 127',
            'course_name' => 'Physical Chemistry for Engineers 2',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Chemistry for Engineers 1 (CHE 126)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 128',
            'course_code' => 'CHE 128',
            'course_name' => 'Chemical Engineering Thermodynamics',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemical Engineering Calculations (CHE 125), Physical Chemistry for Engineers 1 (CHE 126)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 154',
            'course_code' => 'CHE 154',
            'course_name' => 'Heat and Mass Transfer',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Momentum Transfer (CHE 153)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 193',
            'course_code' => 'CHE 193',
            'course_name' => 'Computer Applications in CHE',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Computer Fundamentals and Programing (COMP 01), Computer Aided Design (CAD 11)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'EE 100',
            'course_code' => 'EE 100',
            'course_name' => 'Basic Electrical and Electronics Engineering',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'MATH 50',
            'course_code' => 'MATH 50',
            'course_name' => 'Engineering Data Analysis',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'MSE 100',
            'course_code' => 'MSE 100',
            'course_name' => 'Fundamentals in Material Science and Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers(CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
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

        //3rd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 129',
            'course_code' => 'CHE 129',
            'course_name' => 'Solution Thermodynamics',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemical Engineering Thermodynamics (CHE 128), Computer Applications in CHE (CHE 193), Advance Engineering Mathematics in CHE (CHE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 132',
            'course_code' => 'CHE 132',
            'course_name' => 'Chemical Process Industries',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Momentum Transfer (CHE 153), Organic Chemistry (CHE 30)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 145',
            'course_code' => 'CHE 145',
            'course_name' => 'Chemical Engineering Laboratory 1',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Momentum Transfer (CHE 153), Heat and Mass Transfer (CHE 154)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 155',
            'course_code' => 'CHE 155',
            'course_name' => 'Separation Process',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Heat and Mass Transfer (CHE 154), Chemical Engineering Thermodynamics (CHE 128), Solution Thermodynamics (CHE 129)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 156',
            'course_code' => 'CHE 156',
            'course_name' => 'Chemical Reaction Engineering',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Heat and Mass Transfer (CHE 154), Advance Engineering Mathematics in CHE (CHE 101), Physical Chemistry for Engineers 2 (CHE 127)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 185',
            'course_code' => 'CHE 185',
            'course_name' => 'Process Safety',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Momentum Transfer (CHE 153)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 190',
            'course_code' => 'CHE 190',
            'course_name' => 'Methods of Research',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Data Analysis (Math 50), Momentum Transfer (CHE 127), Chemical Engineering Calculations (CHE 125), Physical Chemistry for Engineers 1  (CHE 126), Purposive Communication (COMM 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHEE 101',
            'course_code' => 'CHEE 101',
            'course_name' => 'Introduction to Petrochemical Engineering',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'IE 111',
            'course_code' => 'IE 111',
            'course_name' => 'Engineering Economics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ' Engineering Data Analysis (Math 50), 3rd Year Standing'
        ]);

        //3rd Year
        //Mid Year


        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 194',
            'course_code' => 'CHE 194',
            'course_name' => 'Chemical Engineering Immersion (320 hours)',
            'lec' => '0',
            'lab' => '3',
            'units' => '3',
            'level' => '3rd Year',
            'period' => 'Mid Year',
            'is_complab' => '0',
            'pre_reqs' => 'Separation Process (CHE 155), 3rd Year Standing'
        ]);

        //4th Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 130',
            'course_code' => 'CHE 130',
            'course_name' => 'Chemical Process Laboratory',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Organic Chemistry (CHE 30), 4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 146',
            'course_code' => 'CHE 146',
            'course_name' => 'Chemical Engineering Laboratory 2',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemical Engineering Laboratory 1 (CHE 145)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 148',
            'course_code' => 'CHE 148',
            'course_name' => 'Particle Technology',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Momentum Transfer (CHE 153), 4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 152',
            'course_code' => 'CHE 152',
            'course_name' => 'Biochemical Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemical Reaction Engineering (CHE 156), Organic Chemistry (CHE 30)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 196',
            'course_code' => 'CHE 196',
            'course_name' => 'Chemical Engineering Design 1',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Separation Process (CHE 155), Chemical Reaction Engineering (CHE 156), Particle Technology (CHE 148)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 200A',
            'course_code' => 'CHE 200A',
            'course_name' => 'Undergraduate Thesis 1',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHEE 102',
            'course_code' => 'CHEE 102',
            'course_name' => 'Introduction to Polymer Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Introduction to Petrochemical Engineering (CHEE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'ESE 101',
            'course_code' => 'ESE 101',
            'course_name' => 'Environmental Science and Engineering',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'IE 113',
            'course_code' => 'IE 113',
            'course_name' => 'Engineering Management',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Economics (IE 111)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'TCEP 1',
            'course_code' => 'TCEP 1',
            'course_name' => 'Technical Competency Enhancement Program I',
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
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 133',
            'course_code' => 'CHE 133',
            'course_name' => 'Industrial Waste Management and Control',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ' Particle Technology (CHE 148), Environmental Science and Engineering (ESE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 161',
            'course_code' => 'CHE 161',
            'course_name' => 'Process Dynamics and Control',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Computer Applications in CHE (CHE 193), Advance Engineering Mathematics in CHE (CHE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 189',
            'course_code' => 'CHE 189',
            'course_name' => 'Chemical Engineering Laws and Ethics',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Ethics (PHILO 01), 4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 197',
            'course_code' => 'CHE 197',
            'course_name' => 'Chemical Engineering Design 2',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemical Engineering Design 1 (CHE 196), Engineering Management (IE 113), Process Dynamics and Control (CHE 161)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 199',
            'course_code' => 'CHE 199',
            'course_name' => 'Plant Inspection and Seminars',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemical Engineering Design 1 (CHE 196), (CHE 142), Chemical Reaction Engineering (CHE 156), 4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHEE 103',
            'course_code' => 'CHEE 103',
            'course_name' => 'Introduction to Plastic Technology',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'CHE 200B',
            'course_code' => 'CHE 200B',
            'course_name' => 'Undergraduate Thesis II',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Undergraduate Thesis 1 (CHE 200A), 4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'ENGG 101',
            'course_code' => 'ENGG 101',
            'course_name' => 'Technopreneurship 101',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Management (IE 113), 4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSCHE',
            'program_name' => 'Bachelor of Science in Chemical Engineering',
            'control_code' => 'TCEP 2',
            'course_code' => 'TCEP 2',
            'course_name' => 'Technical Competency Enhancement Program II',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Technical Competency Enhancement Program I (TCEP 1), 4th Year Standing'
        ]);
    }
}
