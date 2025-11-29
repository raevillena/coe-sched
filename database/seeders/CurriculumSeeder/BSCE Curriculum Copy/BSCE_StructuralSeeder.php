<?php

namespace Database\Seeders\CurriculumSeeder;

use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BSCE_StructuralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 100',
            'course_code' => 'CE 100',
            'course_name' => 'Civil Engineering Orientation',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'COMP 02',
            'course_code' => 'COMP 02',
            'course_name' => 'Computer Fundamentals and Programming II',
            'lec' => '0',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '2',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'ENGG 10',
            'course_code' => 'ENGG 10',
            'course_name' => 'Pre-calculus for Engineers',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'ENGL 10',
            'course_code' => 'ENGL 10',
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
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'NSTP 01',
            'course_code' => 'NSTP 01',
            'course_name' => 'CWTS 1/ROTC 1',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //1st year
        //2nd sem

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CHE 10',
            'course_code' => 'CHE 10',
            'course_name' => 'Chemistry for Engineers',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'DRAW 02',
            'course_code' => 'DRAW 02',
            'course_name' => 'Engineering Drawing and Plans',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'MATH 34',
            'course_code' => 'MATH 34',
            'course_name' => 'Engineering Calculus I',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Pre-calculus for Engineers (ENGG 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'PHY 10',
            'course_code' => 'PHY 10',
            'course_name' => 'Physics for Engineers',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculuus I (MATH 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'PI 01',
            'course_code' => 'PI 01',
            'course_name' => 'Life and Works of Rizal',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'SOCSC 03',
            'course_code' => 'SOCSC 03',
            'course_name' => 'The Contemporary World',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'PATHFit 2',
            'course_code' => 'PATHFit 2',
            'course_name' => 'Exercise-based Fitness Activities',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Movement Competency Training (PATHFit 1)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'NSTP 02',
            'course_code' => 'NSTP 02',
            'course_name' => 'CWTS 2/ROTC 2',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'CWTS 1/ROTC 1 (NSTP 01)'
        ]);

        //2nd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CAD 11',
            'course_code' => 'CAD 11',
            'course_name' => 'Computer-Aided Drafting',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Drawing and Plans (DRAW 02), Computer Fundamentals and Programming II (COMP 02)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 111',
            'course_code' => 'CE 111',
            'course_name' => 'Engineering Utilities I',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 131',
            'course_code' => 'CE 131',
            'course_name' => 'Fundamentals of Surveying',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Drawing and Plans (DRAW 02)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'IT 11',
            'course_code' => 'IT 11',
            'course_name' => 'Living in the IT Era',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'MECH 101',
            'course_code' => 'MECH 101',
            'course_name' => 'Statics of Rigid Bodies',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10), Engineering Calculus II (MATH 25)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'NATSC 13',
            'course_code' => 'NATSC 13',
            'course_name' => 'Environmental Science',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'PATHFit 3',
            'course_code' => 'PATHFit 3',
            'course_name' => 'Phyiscal Activities Toward Health and Fitness 3 (Dance)',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Exercise-based Fitness Activities (PATHFit 2)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'PATHFit 3',
            'course_code' => 'PATHFit 3',
            'course_name' => 'Phyiscal Activities Toward Health and Fitness 3 (Dance)',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Exercise-based Fitness Activities (PATHFit 2)'
        ]);

        //2nd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 112',
            'course_code' => 'CE 112',
            'course_name' => 'Engineering Utilities II',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 121',
            'course_code' => 'CE 121',
            'course_name' => 'Geology for Civil Engineers',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Chemistry for Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 132',
            'course_code' => 'CE 132',
            'course_name' => 'Highway and Railroad Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fundamentals of Surveying (CE 131)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 141',
            'course_code' => 'CE 141',
            'course_name' => 'Hydraulics I',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Statics of Rigid Bodies (MECH 101), Mechanics of Deformable Bodies for CE (MECH 104)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'MATH 40',
            'course_code' => 'MATH 40',
            'course_name' => 'Differential Equations',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'MECH 102',
            'course_code' => 'MECH 102',
            'course_name' => 'Dynamics of Rigid Bodies',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Statics of Rigid Bodies (MECH 101), Mechanics of Deformable Bodies for CE (MECH 104)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'MECH 104',
            'course_code' => 'MECH 104',
            'course_name' => 'Mechanics of Deformable Bodies for CE',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Statics of Rigid Bodies (MECH 101), Dynamics of Rigid Bodies (MECH 102)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'PATHFit 4',
            'course_code' => 'PATHFit 4',
            'course_name' => 'Phyiscal Activities Toward Health and Fitness 3 (Sports)',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Exercise-based Fitness Activities (PATHFit 2)'
        ]);

        //3rd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 101',
            'course_code' => 'CE 101',
            'course_name' => 'Numerical Solutions to CE Problems',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equations (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 113',
            'course_code' => 'CE 113',
            'course_name' => 'Building Systems Design',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Drawing and Plans (DRAW 02)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 122',
            'course_code' => 'CE 122',
            'course_name' => 'Geotechnical Engineering I',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Geology for Civil Engineers (CE 121), Mechanics of Deformable Bodies for CE (MECH 104)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 142',
            'course_code' => 'CE 142',
            'course_name' => 'Hydraulics II',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Hydraulics I (CE 141), Dynamics of Rigid Bodies (MECH 102)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 151',
            'course_code' => 'CE 151',
            'course_name' => 'Structural Theory I',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Mechanics of Deformable Bodies for CE (MECH 104)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
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
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'IE 111',
            'course_code' => 'IE 111',
            'course_name' => 'Engineering Economics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '2nd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'SOCSC 12',
            'course_code' => 'SOCSC 12',
            'course_name' => 'The Entrepreneurial Mind',
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
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 114',
            'course_code' => 'CE 114',
            'course_name' => 'Construction Materials & Testing',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Mechanics of Deformable Bodies for CE (MECH 104)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 115',
            'course_code' => 'CE 115',
            'course_name' => 'Quantity Surveying',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Building Systems Design (CE 113)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 123',
            'course_code' => 'CE 123',
            'course_name' => 'Geotechnical Engineering II',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Geotechnical Engineering I (CE 122)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 152',
            'course_code' => 'CE 152',
            'course_name' => 'Structural Theory II',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Structural Theory I (CE 151)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 161',
            'course_code' => 'CE 161',
            'course_name' => 'Construction Methods and Project Management',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'ENGG 101',
            'course_code' => 'ENGG 101',
            'course_name' => 'Technopreneurship 101',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'IE 113',
            'course_code' => 'IE 113',
            'course_name' => 'Engineering Management',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '2nd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 190',
            'course_code' => 'CE 190',
            'course_name' => 'Engineering Data Analysis with Statistical Methods',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34)'
        ]);

        //3rd Year
        //Midyear

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 194',
            'course_code' => 'CE 194',
            'course_name' => 'On-The-Job Training - 320 Hours',
            'lec' => '0',
            'lab' => '3',
            'units' => '3',
            'level' => '3rd Year',
            'period' => 'Midyear',
            'is_complab' => '0',
            'pre_reqs' => 'Completed ALL subjects from 1st to 3rd Year'
        ]);

        //4th Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 133',
            'course_code' => 'CE 133',
            'course_name' => 'Principles of Transportation Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Highway and Railroad Engineering (CE 132)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 153',
            'course_code' => 'CE 153',
            'course_name' => 'Principles of Reinforced/ Prestressed Concrete',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Structural Theory II (CE 152)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 154',
            'course_code' => 'CE 154',
            'course_name' => 'Principles of Steel Design',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Structural Theory II (CE 152)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 155',
            'course_code' => 'CE 155',
            'course_name' => 'Earthquake Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Structural Theory II (CE 152)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 171',
            'course_code' => 'CE 171',
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
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'PHILO 01',
            'course_code' => 'PHILO 01',
            'course_name' => 'Ethics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 200A',
            'course_code' => 'CE 200A',
            'course_name' => 'CE Undergraduate Thesis I',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        //4th Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 117',
            'course_code' => 'CE 117',
            'course_name' => 'CE Law, Ethics and Contracts',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 143',
            'course_code' => 'CE 143',
            'course_name' => 'Hydrology',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 156',
            'course_code' => 'CE 156',
            'course_name' => 'Foundation and Retaining Wall Design',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Principles of Reinforced/ Prestressed Concrete (CE 153), Geotechnical Engineering II (CE 123)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 157',
            'course_code' => 'CE 157',
            'course_name' => 'Computer Softwares in Structural Analysis',
            'lec' => '1',
            'lab' => '2',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Principles of Reinforced/ Prestressed Concrete (CE 153), Principles of Steel Design (CE 154)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 158',
            'course_code' => 'CE 158',
            'course_name' => 'Bridge Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Principles of Reinforced/ Prestressed Concrete (CE 153)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 159',
            'course_code' => 'CE 159',
            'course_name' => 'Prestressed Concrete Design',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Principles of Reinforced/ Prestressed Concrete (CE 153)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 172',
            'course_code' => 'CE 172',
            'course_name' => 'Technical Competency Enhancement Program II',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Technical Competency Enhancement Program I (CE 171)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2024',
            'program_code' => 'BSCE',
            'program_name' => 'Bachelor of Science in Civil Engineering',
            'control_code' => 'CE 200B',
            'course_code' => 'CE 200B',
            'course_name' => 'CE Undergraduate Thesis II',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'CE Undergraduate Thesis I (CE 200A)'
        ]);
    }
}
