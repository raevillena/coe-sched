<?php

namespace Database\Seeders\CurriculumSeeder;

use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BSMESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //1st year
        //1st sem
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'COMP01',
            'course_code' => 'COMP01',
            'course_name' => 'Computer Fundamentals and Programming',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'DRAW 01',
            'course_code' => 'DRAW 01',
            'course_name' => 'Engineering Drawing',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 10',
            'course_code' => 'ME 10',
            'course_name' => 'ME Orientation',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'PE 01',
            'course_code' => 'PE 01',
            'course_name' => 'PATH-Fit 1',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'PHILO 01',
            'course_code' => 'PHILO 01',
            'course_name' => 'Ethics',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'CAD 11',
            'course_code' => 'CAD 11',
            'course_name' => 'Computer Aided Draft',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Drawing (DRAW 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'MATH 35',
            'course_code' => 'MATH 35',
            'course_name' => 'Engineering Calculus II',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Pre-Calculus for Engineers (ENGG 10), Engineering Calculus I (MATH34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'NSTP 02',
            'course_code' => 'NSTP 02',
            'course_name' => 'CWTS 2/ ROTC 2',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'CWTS 1/ROTC 1 (NSTP 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'PE 02',
            'course_code' => 'PE 02',
            'course_name' => 'PATH- Fit 2',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'PATH-Fit 1 (PE 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'PHY 10',
            'course_code' => 'PHY 10',
            'course_name' => 'Physics for Engineers',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH34),	Engineering Calculus II (MATH35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'SOCSC 01',
            'course_code' => 'SOCSC 01',
            'course_name' => 'Readings in Philippine History',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'STS 01',
            'course_code' => 'STS 01',
            'course_name' => 'Science, Technology and Society',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //2nd Year
        //1st Semester
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'EE 11',
            'course_code' => 'EE 11',
            'course_name' => 'Basic Electrical Engineering',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10), Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'HUM 01',
            'course_code' => 'HUM 01',
            'course_name' => 'Art Appreciation',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 111',
            'course_code' => 'ME 111',
            'course_name' => 'Thermodynamics I',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10),	Engineering Calculus II (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 141',
            'course_code' => 'ME 141',
            'course_name' => 'Workshop Theory and Practice',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Drawing (DRAW 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'MECH 101',
            'course_code' => 'MECH 101',
            'course_name' => 'Statics of Rigid Bodies',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'PE 03',
            'course_code' => 'PE 03',
            'course_name' => 'PATH-Fit 3',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'PATH- Fit 2 (PE 02)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'PI 01',
            'course_code' => 'PI 01',
            'course_name' => 'Life and Works of Rizal',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'SOCSC 02',
            'course_code' => 'SOCSC 02',
            'course_name' => 'Understanding the Self',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //2nd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ECE 100',
            'course_code' => 'ECE 100',
            'course_name' => 'Basic Electronics',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Basic Electrical Engineering	(EE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 101',
            'course_code' => 'ME 101',
            'course_name' => 'Advance Mathematics for ME',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equations (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 112',
            'course_code' => 'ME 112',
            'course_name' => 'Thermodynamics II',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Thermodynamics I (ME 111)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 142',
            'course_code' => 'ME 142',
            'course_name' => 'Machine Shop Theory',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Workshop Theory and Practice (ME 141)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'PE 04',
            'course_code' => 'PE 04',
            'course_name' => 'PATH- Fit 4',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'PATH-Fit 3 (PE 03)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'SOCSC 03',
            'course_code' => 'SOCSC 03',
            'course_name' => 'The Contemporary World',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'SOCSC 12',
            'course_code' => 'SOCSC 12',
            'course_name' => 'The Entrepreneur Mind',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //3rd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'EE 129',
            'course_code' => 'EE 129',
            'course_name' => 'DC and AC Machinery',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Basic Electrical Engineering (EE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ENGG 101',
            'course_code' => 'ENGG 101',
            'course_name' => 'Technopreneurship 101',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 113',
            'course_code' => 'ME 113',
            'course_name' => 'Heat Transfer',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Thermodynamics II (ME 112)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 114',
            'course_code' => 'ME 114',
            'course_name' => 'Combustion Engineering',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Thermodynamics II (ME 112)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 123',
            'course_code' => 'ME 123',
            'course_name' => 'Machine Elements',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Dynamics of Rigid Bodies (MECH 102)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 151',
            'course_code' => 'ME 151',
            'course_name' => 'Mechanical Engineering Lab I',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Mechanics of Deformable Bodies (MECH 103)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'MECH 103',
            'course_code' => 'MECH 103',
            'course_name' => 'Mechanics of Deformable Bodies',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Dynamics of Rigid Bodies (MECH 102)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'MECH 105',
            'course_code' => 'MECH 105',
            'course_name' => 'Fluid Mechanics for Engineers',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Thermodynamics I (ME 111), Mechanics of Deformable Bodies (MECH 103)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
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

        //3rd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ELCTV 1',
            'course_code' => 'ELCTV 1',
            'course_name' => 'Energy Audit Equipment, Tools & Methods',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'IT 11',
            'course_code' => 'IT 11',
            'course_name' => 'Living in the IT Era',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 104',
            'course_code' => 'ME 104',
            'course_name' => 'Basic Occupational Safety and Health',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 131',
            'course_code' => 'ME 131',
            'course_name' => 'Fluid Machinery',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fluid Mechanics for Engineers (MECH 105)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 150',
            'course_code' => 'ME 150',
            'course_name' => 'Materials Science & Engineering for ME',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fluid Mechanics for Engineer	(MECH 105), Chemistry for Engineers (CHE 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 152',
            'course_code' => 'ME 152',
            'course_name' => 'Mechanical Engineering Lab II',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Mechanical Engineering Lab I	(ME 151)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 162',
            'course_code' => 'ME 162',
            'course_name' => 'Air-Conditioning and Ventilation System',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Heat Transfer (ME 113), Refrigeration Systems (ME 163)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 163',
            'course_code' => 'ME 163',
            'course_name' => 'Refrigeration Systems',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Heat Transfer (ME 113)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 190',
            'course_code' => 'ME 190',
            'course_name' => 'Methods of Research for ME',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Purposive Communication (COMM 01), 3rd Year Standing'
        ]);

        //4th Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ECE 172',
            'course_code' => 'ECE 172',
            'course_name' => 'Control Engineering',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Basic Electronics (ECE 100)'
        ]);


        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ELCTV 2',
            'course_code' => 'ELCTV 2',
            'course_name' => 'Case Study/Project on Energy Audit Application',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Energy Audit Equipment, Tools & Methods (ELCTV 1)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'IE 111',
            'course_code' => 'IE 111',
            'course_name' => 'Engineering Economy',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 130',
            'course_code' => 'ME 130',
            'course_name' => 'Computer Applications for ME',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 144',
            'course_code' => 'ME 144',
            'course_name' => 'Machine Design I',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Machine Elements (ME 123), Fluid Mechanics for Engineer (MECH 105)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 147',
            'course_code' => 'ME 147',
            'course_name' => 'Vibration Engineering',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equations (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 172',
            'course_code' => 'ME 172',
            'course_name' => 'Steam Power Engineering',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Thermodynamics II (ME 112)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 174',
            'course_code' => 'ME 174',
            'course_name' => 'Industrial Plant Engineering',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Refrigeration Systems (ME 163), Air-Conditioning and Ventilation System (ME 162), Fluid Machinery (ME 131)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 200A',
            'course_code' => 'ME 200A',
            'course_name' => 'Undergraduate Thesis I for ME',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Methods of Research for ME (ME 190), 4th Year Standing'
        ]);

        //4th Year
        //2nd Semester
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'IE 113',
            'course_code' => 'IE 113',
            'course_name' => 'Engineering Management',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 145',
            'course_code' => 'ME 145',
            'course_name' => 'Machine Design II',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Machine Design I	(ME 144)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 153',
            'course_code' => 'ME 153',
            'course_name' => 'ME Laboratory III',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Mechanical Engineering Lab II (ME 152)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 171',
            'course_code' => 'ME 171',
            'course_name' => 'Manufacturing & Processes with Plant Visits',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 175',
            'course_code' => 'ME 175',
            'course_name' => 'Power Plant Design with Renewable Energy',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Combustion Engineering (ME 114), Thermodynamics II (ME 112)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 180',
            'course_code' => 'ME 180',
            'course_name' => 'Technical Competency Enhancement Program',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '4th Year',
           'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Graduating Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 192',
            'course_code' => 'ME 192',
            'course_name' => 'ME Laws, Ethics, Contracts, Codes & Standards',
            'lec' => '1',
            'lab' => '1',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSME',
            'program_name' => 'Bachelor of Science in Mechanical Engineering',
            'control_code' => 'ME 200B',
            'course_code' => 'ME 200B',
            'course_name' => 'Undergraduate Thesis II for ME',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Undergraduate Thesis I for ME (ME 200A)'
        ]);
    }
}
