<?php

namespace Database\Seeders\CurriculumSeeder;

use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BSECESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //1st year
        //1st sem
        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'CAD 11',
            'course_code' => 'CAD 11',
            'course_name' => 'Computer Aided Drafting',
            'lec' => '0',
            'lab' => '1',
            'units' => '1',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '1',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'CHE 10',
            'course_code' => 'CHE 10',
            'course_name' => 'Chemistry for Engineers',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'COMP 01',
            'course_code' => 'COMP 01',
            'course_name' => 'Computer Fundamentals and Programming',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ENGG 10',
            'course_code' => 'ENGG 10',
            'course_name' => 'Pre-Calculus for Engineers',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'MATH 34',
            'course_code' => 'MATH 34',
            'course_name' => 'Engineering Calculus I',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '1st Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PATH-FIT 1',
            'course_code' => 'PATH-FIT 1',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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

        //1st Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'CPE 111',
            'course_code' => 'CPE 111',
            'course_name' => 'Object-Oriented Programming',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Computer Fundamentals and Programming (COMP 01)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 110',
            'course_code' => 'ECE 110',
            'course_name' => 'ECE Technology',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'MATH 01',
            'course_code' => 'MATH 01',
            'course_name' => 'Mathematics in the Modern World',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'MATH 35',
            'course_code' => 'MATH 35',
            'course_name' => 'Engineering Calculus II',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34), Pre-Calculus for Engineers (ENGG10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PATH-FIT 2',
            'course_code' => 'PATH-FIT 2',
            'course_name' => 'Fitness Training',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Movement Competency Training (PATH-FIT 1)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PHY 10',
            'course_code' => 'PHY 10',
            'course_name' => 'Physics for Engineers',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Engineering Calculus I (MATH 34)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PHY 20',
            'course_code' => 'PHY 20',
            'course_name' => 'Physics II',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '1st Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics for Engineers (PHY 10)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'STS 01',
            'course_code' => 'STS 01',
            'course_name' => 'Science, Technology & Society',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'EE 121',
            'course_code' => 'EE 121',
            'course_name' => 'Electrical Circuits I',
            'lec' => '5',
            'lab' => '0',
            'units' => '5',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Physics II (PHY 20)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 122',
            'course_code' => 'ECE 122',
            'course_name' => 'Electronics I: Electronic Devices and Circuits',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Circuits I (EE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 192',
            'course_code' => 'ECE 192',
            'course_name' => 'ECE Laws, Contracts, Ethics, Standards and Safety',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'MATH 50',
            'course_code' => 'MATH 50',
            'course_name' => 'Engineering Data Analysis',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'MSE 100',
            'course_code' => 'MSE 100',
            'course_name' => 'Fundamentals of Material Science & Engineering',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PATH-FIT 3',
            'course_code' => 'PATH-FIT 3',
            'course_name' => 'PATH-FIT 3',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '2nd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Fitness Training (PATH-FIT 2)'
        ]);

        //2nd Year
        //2nd Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 101',
            'course_code' => 'ECE 101',
            'course_name' => 'Advanced Engineering Mathematics for ECE',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equations (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 123',
            'course_code' => 'ECE 123',
            'course_name' => 'Electronics II: Electronic Circuit Analysis & Design',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronics I: Electronic Devices and Circuits (ECE 122)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 153',
            'course_code' => 'ECE 153',
            'course_name' => 'Communications I: Principles of Communication Systems',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronics II: Electronic Circuit Analysis & Design (ECE 123)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 171',
            'course_code' => 'ECE 171',
            'course_name' => 'Electromagnetics',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Differential Equations (MATH 40)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'EE 124',
            'course_code' => 'EE 124',
            'course_name' => 'Electrical Circuits II',
            'lec' => '5',
            'lab' => '0',
            'units' => '5',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electrical Circuits I (EE 121)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PATH-FIT 4',
            'course_code' => 'PATH-FIT 4',
            'course_name' => 'PATH-FIT 4',
            'lec' => '5',
            'lab' => '0',
            'units' => '5',
            'level' => '2nd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'PATH-FIT 3 (PATH-FIT 3)'
        ]);

        //3rd Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 125',
            'course_code' => 'ECE 125',
            'course_name' => 'Electronics III: Electronics Systems & Design',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronics II: Electronic Circuit Analysis & Design (ECE 123)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 127',
            'course_code' => 'ECE 127',
            'course_name' => 'Digital Electronics I: Logic Circuits & Switching Theory',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronics I: Electronic Devices and Circuits (ECE 122)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 154',
            'course_code' => 'ECE 154',
            'course_name' => 'Signals, Spectra & Signal Processing',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Advanced Engineering Mathematics for ECE (ECE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 155',
            'course_code' => 'ECE 155',
            'course_name' => 'Communications II: Modulation and Coding Techniques',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Communications I: Principles of Communication Systems (ECE 153)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'IE 111',
            'course_code' => 'IE 111',
            'course_name' => 'Engineering Economics',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PHILO 01',
            'course_code' => 'PHILO 01',
            'course_name' => 'Ethics',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 128',
            'course_code' => 'ECE 128',
            'course_name' => 'Digital Electronics II: Microprocessor,  Microcontroller Systems & Design',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Digital Electronics I: Logic Circuits & Switching Theory (ECE 127)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 156',
            'course_code' => 'ECE 156',
            'course_name' => 'Communications III: Transmission Media & Antenna System & Design',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Communications II: Modulation and Coding Techniques (ECE 155)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 157',
            'course_code' => 'ECE 157',
            'course_name' => 'Communications IV: Data Communications',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Communications II: Modulation and Coding Techniques (ECE 155)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 175',
            'course_code' => 'ECE 175',
            'course_name' => 'Feedback and Control Systems',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Advanced Engineering Mathematics for ECE (ECE 101)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'HUM 01',
            'course_code' => 'HUM 01',
            'course_name' => 'Art Appreciation',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'SOCSC 01',
            'course_code' => 'SOCSC 01',
            'course_name' => 'Readings in Philippine History',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'SOCSC 03',
            'course_code' => 'SOCSC 03',
            'course_name' => 'The Contemporary World',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        //3rd Year
        //Mid year


        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 194',
            'course_code' => 'ECE 194',
            'course_name' => 'On-The-Job Training',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '3rd Year',
            'period' => 'Mid Year',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        //4th Year
        //1st Semester

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 158',
            'course_code' => 'ECE 158',
            'course_name' => 'Technical Competency Enhancement  Program I',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 163B',
            'course_code' => 'ECE 163B',
            'course_name' => 'Technical Competency Enhancement  Program I',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 163T',
            'course_code' => 'ECE 163T',
            'course_name' => 'Advanced Communication System and Design (Wireless)',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 190',
            'course_code' => 'ECE 190',
            'course_name' => 'Methods of Research',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 197A',
            'course_code' => 'ECE 197A',
            'course_name' => 'Design I/ Project Capstone I',
            'lec' => '1',
            'lab' => '0',
            'units' => '1',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => '4th Year Standing'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ENGG 101',
            'course_code' => 'ENGG 101',
            'course_name' => 'Technopreneurship 101',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'IT 11',
            'course_code' => 'IT 11',
            'course_name' => 'Living in the IT Era',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '1st Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'PI 01',
            'course_code' => 'PI 01',
            'course_name' => 'Life & Works of Rizal',
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
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 159',
            'course_code' => 'ECE 159',
            'course_name' => 'Technical Competency Enhancement  Program II',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 164B',
            'course_code' => 'ECE 164B',
            'course_name' => 'Electronics Ancillary System',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Electronics III: Electronics Systems & Design (ECE 125)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 164T',
            'course_code' => 'ECE 164T',
            'course_name' => 'Advanced Networking',
            'lec' => '4',
            'lab' => '0',
            'units' => '4',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 197B',
            'course_code' => 'ECE 197B',
            'course_name' => 'Design II/ Project Capstone II',
            'lec' => '2',
            'lab' => '0',
            'units' => '2',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => 'Design I/ Project Capstone I (ECE 197A)'
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ECE 199',
            'course_code' => 'ECE 199',
            'course_name' => 'Seminars/ Colloquium',
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
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
            'control_code' => 'ESE 101',
            'course_code' => 'ESE 101',
            'course_name' => 'Environmental Science and Engineering',
            'lec' => '3',
            'lab' => '0',
            'units' => '3',
            'level' => '4th Year',
            'period' => '2nd Semester',
            'is_complab' => '0',
            'pre_reqs' => ''
        ]);

        Curriculums::create([
            'curriculum_year' => '2022',
            'program_code' => 'BSECE',
            'program_name' => 'Bachelor of Science in Electronics Engineering',
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
    }
}
