<?php

namespace Database\Seeders;

use App\Models\EditNOTA\EditNOTA;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EditNOTASeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EditNOTA::create([
            'intro' => 'Per endorsement of the concerned department, you are hereby assigned to teach the following subjects during the',
            'body' => 'Classes start on August 19, 2024; hence, please be in the rooms assigned to your subjects to receive and start meeting your students, In addition, you are advised to prepare instructional materials for your assigned subjects. You are also advised to print the class roster, check the list of students enrolled in your class and make necessary corrections before submission to the office. Submit to the College Secretary the number of students attending your classes, changes in your schedule, and the subject dissolved or added to your load to update the faculty workload of the college. Furthermore, submit your updated syllabi in each subject you are assigned to your Department Chair for checking before distribution to the students on the first day of classes.',
        ]);
    }
}
