<?php

namespace Database\Seeders\CurriculumSeeder;

use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BSCPESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //BSCPE 
        //Start of 2020-2021
        //1st year
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'ENGG 10',
            'course_code' => 'ENGG 10',
            'course_name' => 'Pre-Calculus I',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 101',
            'course_code' => 'CPE 101',
            'course_name' => 'Computer Engineering as a Discipline',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'COMPE 02',
            'course_code' => 'COMPE 02',
            'course_name' => 'Programming Logic and Design',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'PE 01',
            'course_code' => 'PE 01',
            'course_name' => 'Physical Activities Towards Health and Fitness 1',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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

        //2nd sem
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'PHY 10',
            'course_code' => 'PHY 10',
            'course_name' => 'Physics for Engineers',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Pre-Calculus (ENGG 10), Calculus I (Math 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'MATH 35',
            'course_code' => 'MATH 35',
            'course_name' => 'Engineering Calculus II',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Pre-Calculus (ENGG 10), Calculus I (Math 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 130',
            'course_code' => 'CPE 130',
            'course_name' => 'Discrete Mathematics for CpE',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Calculus I (Math 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 112',
            'course_code' => 'CPE 112',
            'course_name' => 'Object Oriented Programming for CpE',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Programming Logic and Design (COMPE 02)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 100',
            'course_code' => 'CPE 100',
            'course_name' => 'Computer Hardware Fundamentals',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'MATH 01',
            'course_code' => 'MATH 01',
            'course_name' => 'Mathematics for the Modern World',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'PE 02',
            'course_code' => 'PE 02',
            'course_name' => 'Physical Activities Towards Health and Fitness 2',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Towards Health and Fitness 1 (PE 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'MATH 40',
            'course_code' => 'MATH 40',
            'course_name' => 'Differential Equation',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Calculus 2 (MATH 35)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 113',
            'course_code' => 'CPE 113',
            'course_name' => 'Data Structure & Algorithms',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Object Oriented Programming (CPE 112)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'IT 11',
            'course_code' => 'IT 11',
            'course_name' => 'Living in the Information Technology Era',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'IE 111',
            'course_code' => 'IE 111',
            'course_name' => 'Engineering Economics',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '2nd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'PHILO 01',
            'course_code' => 'PHILO 01',
            'course_name' => 'Ethics',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'HUM 01',
            'course_code' => 'HUM 01',
            'course_name' => 'Arts Appreciation',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'PE 03',
            'course_code' => 'PE 03',
            'course_name' => 'PATH-FIT 3',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Towards Health and Fitness 2 (PE 02)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CAD 11',
            'course_code' => 'CAD 11',
            'course_name' => 'Computer-Aided Drafting',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => '2nd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'EE 121',
            'course_code' => 'EE 121',
            'course_name' => 'Electrical Circuits 1',
            'lec' => '3',
            'lab' => '2',
            'units' => '5',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        //2nd Semester
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 114',
            'course_code' => 'CPE 114',
            'course_name' => 'Software Design',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Data Structures and Algorithms (CPE 113)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'COMM 01',
            'course_code' => 'COMM 01',
            'course_name' => 'Purposive Communication',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'ECE 140',
            'course_code' => 'ECE 140',
            'course_name' => 'Fundamentals of Electronic Circuits',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Circuits I (EE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'NATSC 13',
            'course_code' => 'NATSC 13',
            'course_name' => 'Environmental Science',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
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
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'PE 04',
            'course_code' => 'PE 04',
            'course_name' => 'PATH-FIT 4',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physical Activities Towards Health and Fitness II (PE 02)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 137',
            'course_code' => 'CPE 137',
            'course_name' => 'Numerical Methods',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equations (MATH 40)'
        ]);

        //3rd year
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 116',
            'course_code' => 'CPE 116',
            'course_name' => 'System Development I',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Software Design (CPE 114)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 115',
            'course_code' => 'CPE 115',
            'course_name' => 'Operating Systems for CpE',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Data Structure and Algorithms (CPE 113)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 150',
            'course_code' => 'CPE 150',
            'course_name' => 'Data and Digital Communications',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fundamentals of Electronic Circuits (ECE 140)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 160',
            'course_code' => 'CPE 160',
            'course_name' => 'Introduction to HDL',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Programming Logic and Design (COMPE 02), Fundamentals of Electronic Circuits (ECE 140)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 161',
            'course_code' => 'CPE 161',
            'course_name' => 'Feedback and Control Systems',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Numerical Methods (CPE 137), Electrical Circuits I (EE 121)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 162',
            'course_code' => 'CPE 162',
            'course_name' => 'Fundamentals of Mixed Signals and Sensors',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fundamentals of Electronic Circuits (ECE 140)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'MATH 50',
            'course_code' => 'MATH 50',
            'course_name' => 'Engineering Data Analysis',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Calculus I (MATH 34)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 122',
            'course_code' => 'CPE 122',
            'course_name' => 'Computer Engineering Drafting and Design',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Fundamentals of Electronic Circuits (ECE 140)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 132',
            'course_code' => 'CPE 132',
            'course_name' => 'Logic Circuits and Design',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Fundamentals of Electronic Circuits (ECE 140)',
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 170',
            'course_code' => 'CPE 170',
            'course_name' => 'Basic Occupational Health and Safety',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 151',
            'course_code' => 'CPE 151',
            'course_name' => 'Computer Networks and Security',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Data and Digital Communications (CPE 150)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 163',
            'course_code' => 'CPE 163',
            'course_name' => 'Microprocessors',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Advanced Logic Circuits and Design (CPE 133)
'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 133',
            'course_code' => 'CPE 133',
            'course_name' => 'Advance Logic Circuits and Design',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Logic Circuits and Design (CPE 132)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 190',
            'course_code' => 'CPE 190',
            'course_name' => 'Methods of Research',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Data Analysis (MATH 50), Purposive Communication (COMM 01), Advanced Logic Circuits and Design (CPE 133)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 192',
            'course_code' => 'CPE 192',
            'course_name' => 'CpE Laws and Professional Practice',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 117',
            'course_code' => 'CPE 117',
            'course_name' => 'System Development II',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => 'System Development I (CPE 116)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'SOCSC 12',
            'course_code' => 'SOCSC 12',
            'course_name' => 'The Entrepreneurial Mind',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 180',
            'course_code' => 'CPE 180',
            'course_name' => 'Microelectronics I',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '3rd Year Standing'
        ]);

        //Mid Year
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 194',
            'course_code' => 'CPE 194',
            'course_name' => 'CpE On the Job Training (240 Hrs)',
            'lec' => '0',
            'lab' => '3',
            'units' => '3',
            'level' => '3rd Year',
            'period' => 'Mid Year',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        //4th Year
        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 164',
            'course_code' => 'CPE 164',
            'course_name' => 'Embedded Systems',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Microprocessors (CPE 163)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 134',
            'course_code' => 'CPE 134',
            'course_name' => 'Computer Architecture and Organization',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Microprocessors (CPE 163)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 165',
            'course_code' => 'CPE 165',
            'course_name' => 'Emerging Technologies in CpE',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 200A',
            'course_code' => 'CPE 200A',
            'course_name' => 'Undergraduate Thesis I',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Microprocessors (CPE 163), Methods of Research (CPE 190)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 166',
            'course_code' => 'CPE 166',
            'course_name' => 'Digital Signal Processing',
            'lec' => '3',
            'lab' => '1',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => 'Feedback and Control Systems (CPE 161)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'STS 01',
            'course_code' => 'STS 01',
            'course_name' => 'Science, Technology and Society',
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
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 181',
            'course_code' => 'CPE 181',
            'course_name' => 'Microelectronics II',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'CpE Elective I (CPE 180)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 200B',
            'course_code' => 'CPE 200B',
            'course_name' => 'Undergraduate Thesis II',
            'lec' => '0',
            'lab' => '2',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Undergraduate Thesis I (CPE 200A)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 199',
            'course_code' => 'CPE 199',
            'course_name' => 'Seminars and Fieldtrips',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'CPE 182',
            'course_code' => 'CPE 182',
            'course_name' => 'Microelectronics III',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Elective II (CPE 181)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'TCEP 1',
            'course_code' => 'TCEP 1',
            'course_name' => 'Technical Competency and Enchantment Program I',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'SOCSC 03',
            'course_code' => 'SOCSC 03',
            'course_name' => 'The Contemporary World',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2020',
            'program_code' => 'BSCPE',
            'program_name' => 'Bachelor of Science in Computer Engineering',
            'control_code' => 'ENGG 101',
            'course_code' => 'ENGG 101',
            'course_name' => 'Technopreneurship',
            'lec' => '2',
            'lab' => '1',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '1',
            'pre_reqs' => ''
        ]);
        //End of 2020-2021
    }
}
