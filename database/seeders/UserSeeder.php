<?php

namespace Database\Seeders;

use App\Models\Faculty\Department;
use App\Models\Faculty\Faculty;
use App\Models\Faculty\Position;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        Department::factory()
            ->count(9)
            ->sequence(fn($sequence) => [
                'name' => [
                    'Computer Engineering',
                    'Electronics Engineering',
                    'Electrical Engineering',
                    'Civil Engineering',
                    'Chemical Engineering',
                    'Mechanical Engineering',
                    'Agricultural and Biosystems Engineering',
                    'Ceramic Engineering',
                    'Other Department'
                ][$sequence->index],
                'program_code' => [
                    'BSCPE', //1
                    'BSECE', //2
                    'BSEE', //3
                    'BSCE', //4
                    'BSCHE', //5
                    'BSME', //6
                    'BSABE', //7
                    'BSCERE', //8
                    'OT'
                ][$sequence->index],
                'logo' => [
                    'dept_logos/icpep.png',
                    'dept_logos/iecep.png',
                    'dept_logos/ieee.png',
                    'dept_logos/pice.jpg',
                    'dept_logos/piche.jpg',
                    'dept_logos/mech.png',
                    'dept_logos/psabe.jpg',
                    'dept_logos/ceramic.png',
                    'dept_logos/mmsu.png' 
                ][$sequence->index]
            ])
            ->has(
                Position::factory()
                    ->count(20)
                    ->state(
                        new Sequence(
                            // Instructors
                            ['name' => 'Instructor I'], //1
                            ['name' => 'Instructor II'], //2
                            ['name' => 'Instructor III'], //3
                            ['name' => 'Instructor IV'], //4
                            ['name' => 'Instructor V'], //5

                            // Assistant Professors
                            ['name' => 'Assistant Professor I'], //6
                            ['name' => 'Assistant Professor II'], //7
                            ['name' => 'Assistant Professor III'], //8
                            ['name' => 'Assistant Professor IV'], //9

                            // Associate Professors
                            ['name' => 'Associate Professor I'], //10
                            ['name' => 'Associate Professor II'], //11
                            ['name' => 'Associate Professor III'], //12
                            ['name' => 'Associate Professor IV'], //13
                            ['name' => 'Associate Professor V'], //14

                            // Professors
                            ['name' => 'Professor I'], //15
                            ['name' => 'Professor II'], //16
                            ['name' => 'Professor III'], //17
                            ['name' => 'Professor IV'], //18
                            ['name' => 'Professor V'], //19
                            ['name' => 'Professor VI'], //20
                        )
                    )
                // ->has(
                //     User::factory()
                //         ->count(2)
                //         ->state(
                //             function (array $attributes, Position $position) {
                //                 return [
                //                     'department_id' => $position->department_id,
                //                     'role' => ['user', 'admin', 'super-admin'][array_rand(['user', 'admin'])],
                //                     'theme' => ['dark', 'light', 'system'][array_rand(['dark', 'light', 'system'])],
                //                     'password' => bcrypt('password')
                //                 ];
                //             }
                //         )
                // )
            )
            ->create();

        //Devs
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Raymund Jan R. Pedro',
                'email' => 'ray@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1,
                'profile_picture' => 'profile_pictures/ray.jpg',
                'role' => 'super-admin',
                'theme' => 'dark',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Nathaniel T. Miguel',
                'email' => 'nathan@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1,
                'profile_picture' => 'profile_pictures/nathan.jpg',
                'role' => 'super-admin',
                'theme' => 'dark',
            ]);

        //BSCPE
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Vladimir Ibañez',
                'email' => 'vladimir@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 9, // Assistant Professor IV
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Marifaye Flores',
                'email' => 'marifaye@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Mary Grace Matias',
                'email' => 'mary@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Ajay Daquioag',
                'email' => 'ajay@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Willen Mark Manzanas',
                'email' => 'willen@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 10, // Associate Professor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Lovina Siechrist T. Agbayani',
                'email' => 'lovina@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 3, // Instructor III
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Aljay Santos',
                'email' => 'aljay@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 7, // Assistant Professor II
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Edwin F. Galutira',
                'email' => 'edz@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 12, // Associate Professor III
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Diana Rose Tambogon',
                'email' => 'diana@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Bobby Eclarin',
                'email' => 'bobby@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 12, // Associate Professor III
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Rick Asuncion',
                'email' => 'rick@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Philippe Santiago',
                'email' => 'philippe@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Mark Justine Cudapas',
                'email' => 'justine@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Engelbert Carino',
                'email' => 'engelbert@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 1,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);
        //End of BSCPE


        //BSECE
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Abegail E. Ruiz',
                'email' => 'aeruiz@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 7, // Assistant Professor II
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Julie Ailene Asuncion',
                'email' => 'jasuncion@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Christian Philip M. Austria',
                'email' => 'cmaustria@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Gregory John J. Saguiguit',
                'email' => 'gjsaguiguit@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Francis O. Que',
                'email' => 'foque@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Meynard C. Nicolas',
                'email' => 'mcnicolas@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Wilson R. Duldulao',
                'email' => 'wrduldulao@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 9, // Assistant Professor IV
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Lawrence John C. Tagata',
                'email' => 'ldtagata@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 8, // Assistant Professor III
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Ma. Fregie Gaile Pagador',
                'email' => 'mrpagador@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Pricilla Faye T. Simon',
                'email' => 'ptsimon@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 2,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);
        //End of BSECE

        //BSEE (No Data Yet)
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Salustiano Moralse',
                'email' => 'salustiano@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 3,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
            ]);
        //End of BSEE

        //BSCE
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Kei John Cyril G. Baria',
                'email' => 'kei@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Christian N. Bayangos',
                'email' => 'christian@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Emerson V. Bolibol',
                'email' => 'emerson@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. J. Edgardo Cabading',
                'email' => 'edgardo@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Darell Jhon A. Calaro',
                'email' => 'darell@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Mark Kevin A. Cardona',
                'email' => 'mark@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Jonas Paul B. Dela Cruz',
                'email' => 'jonas@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Zarah Ivana G. Dubla',
                'email' => 'zarah@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Kenneth L. Edra',
                'email' => 'kenneth@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 6, // Assistant Professor I
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Russell John F. Guinto',
                'email' => 'russell@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Dexter John S. Martinez',
                'email' => 'dexter@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Charles A. Mateo',
                'email' => 'charles@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 7, // Assistant Professor II
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Reymart S. Pecpec',
                'email' => 'reymart@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Melissa A. Pungtilan',
                'email' => 'melissa@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. John Robert Rayoan',
                'email' => 'john@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Arbie Mariz Revilla',
                'email' => 'arbie@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Mar Viandreus I. Ruiz',
                'email' => 'mar@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Karen Joyce B. Santiago',
                'email' => 'karen@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 7, // Assistant Professor II
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Jerose G. Solmerin',
                'email' => 'jerose@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. John Carlo R. Tabije',
                'email' => 'johncarlo@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Arvin Jan Tangonan',
                'email' => 'arvin@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 4,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);
        //End of BSCE

        //BSCHE
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Rosalie P. Agcaoili',
                'email' => 'rpagcaoili@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 11, // Associate Professor II
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Jessa D. Alonzo',
                'email' => 'jdalonzo@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        //Dean
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Sharona Q. Barroga',
                'email' => 'sqbarroga@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 16, // Professor II
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
                'is_dean' => '1',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Norlie P. Cacal',
                'email' => 'npcacal@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Aileen Grace M. Fronda',
                'email' => 'amfronda@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Eric R. Halabaso',
                'email' => 'erhalabaso@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 10, // Associate Professor I
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Ma. Carmina M. Lorenzo',
                'email' => 'mmlorenzo@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 7, // Assistant Professor II
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Roselle Y. Mamuad',
                'email' => 'rymamuad@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 9, // Assistant Professor IV
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Charella Rose M. Salvador',
                'email' => 'cmmacni@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 7, // Assistant Professor II
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Shan Caezar L. Tambio',
                'email' => 'sltambio@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 5,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);
        //End of BSCHE

        //BSME
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Arjay C. Alcantara',
                'email' => 'acalcantara@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Kendrick Cyrus A. Acidera',
                'email' => 'kaacidera@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Odette R. Alegato',
                'email' => 'oralegato@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. John Ian A. Asuncion',
                'email' => 'jaasuncion@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Asher Dave M. Calulot',
                'email' => 'amcalulot@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Rafael C. Domingo',
                'email' => 'rafael@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Alennie M. Fagaragan',
                'email' => 'amfagaragan@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Nathaniel Ericson R. Mateo',
                'email' => 'nrmateo@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 13, // Associate Professor IV
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Neal Janus R. Pacis',
                'email' => 'nrpacis@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Jan Leiton S. Palaspas',
                'email' => 'jspalaspas@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Peter Joenal A. Pelayo',
                'email' => 'papelayo@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Ian V. Romas',
                'email' => 'ivromas@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 6,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);
        //End of BSME

        //BSABE
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Reynold M. Agcaoili',
                'email' => 'reynold@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 14,
                'profile_picture' => 'profile_pictures/reynold.jpg',
                'role' => 'admin',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Nathaniel R. Alibuyog',
                'email' => 'nathaniel@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 20,
                'profile_picture' => 'profile_pictures/alibuyog.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Roxanne Joy O. Antonio',
                'email' => 'roxanne@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 1,
                'profile_picture' => 'profile_pictures/roxanne.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Bethany Grace S. Calixto',
                'email' => 'bethany@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 14,
                'profile_picture' => 'profile_pictures/bethany.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Michael N. Duldulao',
                'email' => 'michael@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 7,
                'profile_picture' => 'profile_pictures/michael.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Virgilio Julius P. Manzano, Jr.',
                'email' => 'virgilio@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 20,
                'profile_picture' => 'profile_pictures/virgilio.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Shaira Camille M. Santos',
                'email' => 'shaira@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 1,
                'profile_picture' => 'profile_pictures/shaira.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Lorcelie B. Taclan',
                'email' => 'lorcelie@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 12,
                'profile_picture' => 'profile_pictures/lorcelie.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Cristina D. Valentin',
                'email' => 'cristina@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 8,
                'profile_picture' => 'profile_pictures/cristina.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Dr. Bjorn S. Santos',
                'email' => 'bjorn@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 7,
                'position_id' => 19,
                'profile_picture' => 'profile_pictures/bjorn.jpg',
                'role' => 'user',
                'theme' => 'light',
            ]);
        //End of BSABE

        //BSCERE
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Rose Anne A. Butoy',
                'email' => 'rabutoy@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Annesa M. Dela Cruz',
                'email' => 'amdelacruz@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Andrew C. Doño',
                'email' => 'acdono@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Joseph Allan S. Gamiao',
                'email' => 'jsgamiao@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Emie S. Mirasol',
                'email' => 'esmirasol@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Dionesio C. Pondoc',
                'email' => 'dcpondoc@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Arlene Mia G. Ruguian',
                'email' => 'amruguian@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'admin',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Engr. Louvie John M. Ruguian',
                'email' => 'ljruguian@mmsu.edu.ph',
                'password' => bcrypt('password'),
                'department_id' => 8,
                'position_id' => 1, // Instructor I
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);
        //End of BSCERE


        //other dept
        User::factory()
            ->count(1)
            ->create([
                'name' => 'CAS Instructor',
                'email' => 'cas@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 9, // Other Department
                'position_id' => 1, // Assistant Professor IV
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'CAFSD Instructor',
                'email' => 'cafsd@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 9, // Other Department
                'position_id' => 1, // Assistant Professor IV
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'CBEA Instructor',
                'email' => 'cbea@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 9, // Other Department
                'position_id' => 1, // Assistant Professor IV
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);

        User::factory()
            ->count(1)
            ->create([
                'name' => 'Atty. Lorma Cuadro (CAS)',
                'email' => 'lorma@gmail.com',
                'password' => bcrypt('password'),
                'department_id' => 9, // Other Department
                'position_id' => 1,
                'profile_picture' => '',
                'role' => 'user',
                'theme' => 'light',
            ]);
    }
}
