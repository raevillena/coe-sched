<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\CurriculumSeeder\BSABESeeder;
use Database\Seeders\CurriculumSeeder\BSCERESeeder;
use Database\Seeders\CurriculumSeeder\BSCESeeder;
use Database\Seeders\CurriculumSeeder\BSCHESeeder;
use Database\Seeders\CurriculumSeeder\BSCPESeeder;
use Database\Seeders\CurriculumSeeder\BSECESeeder;
use Database\Seeders\CurriculumSeeder\BSEESeeder;
use Database\Seeders\CurriculumSeeder\BSMESeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            AcademicProgramSeeder::class,
            AcademicYearSeeder::class,
            SectionsSeeder::class,
            PeriodsSeeder::class,
            YearLevelsSeeder::class,
            FloorsSeeder::class,
            BuildingsSeeder::class,
            FloorPlanSeeder::class,
            //RoomsSeeder::class,
            CustomizePDFSeeder::class,
            SchedulesSeeder::class,
            EditNOTASeeder::class,
            #curriculum
            BSCPESeeder::class, 
            BSEESeeder::class,
            BSECESeeder::class,
            BSCERESeeder::class,
            BSCESeeder::class,
            BSCHESeeder::class,
            BSMESeeder::class,
            // BSABESeeder::class,
        ]);
    }
}
