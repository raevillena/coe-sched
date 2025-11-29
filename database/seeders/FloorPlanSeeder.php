<?php

namespace Database\Seeders;

use App\Models\MaintenanceManagement\FloorPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FloorPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('floor_plans')->insert([
            'building' => 'Main Building',
            'floor' => 'Ground Floor',
            'floor_plan_map' => 'floor_plan_images/1741959448-MainBuilding-GroundFloor-coe-old-building-ground-floor 1280x720.jpg',
            'rectangles' => json_encode([
                ["id" => 1, "x" => -394, "y" => 284, "width" => 100, "height" => 50, "locked" => true, "room_number" => "CHE Dept", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSCHE"]), "description" => "", "is_active" => 1, "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316", "created_at" => now(), "updated_at" => now()],
                ["id" => 2, "x" => -394, "y" => 394, "width" => 100, "height" => 61, "locked" => true, "room_number" => "CPE Dept", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSCPE"]), "description" => "", "is_active" => 1, "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316", "created_at" => now(), "updated_at" => now()],
                ["id" => 3, "x" => -393.7408783146549, "y" => 157.9734073996308, "width" => 100, "height" => 51, "locked" => true, "room_number" => "CERE Dept", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSCERE"]), "description" => "", "is_active" => 1, "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316", "created_at" => now(), "updated_at" => now()],
                ["id" => 4, "x" => -148, "y" => 38, "width" => 129, "height" => 74, "locked" => true, "room_number" => "AVR", "room_type" => "", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(211, 211, 211)", "borderColor" => "#808080", "created_at" => now(), "updated_at" => now()],
                ["id" => 5, "x" => 263, "y" => 35, "width" => 64, "height" => 78, "locked" => true, "room_number" => "ABE Dept", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSABE"]), "description" => "", "is_active" => 1, "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316", "created_at" => now(), "updated_at" => now()],
                ["id" => 6, "x" => 396, "y" => 284, "width" => 100, "height" => 49, "locked" => true, "room_number" => "ME Dept", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSME"]), "description" => "", "is_active" => 1, "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316", "created_at" => now(), "updated_at" => now()],
                ["id" => 7, "x" => -260.34737246505654, "y" => 563.2716751539908, "width" => 60, "height" => 78, "locked" => true, "room_number" => "iHUB", "room_type" => "Laboratory / Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(211, 211, 211)", "borderColor" => "#808080", "created_at" => now(), "updated_at" => now()],
                ["id" => 8, "x" => -394, "y" => 467, "width" => 100, "height" => 55, "locked" => true, "room_number" => "COE 115", "room_type" => "Laboratory Room", "department_priority" => json_encode(["BSCPE"]), "description" => "", "is_active" => 1, "color" => "rgba(38, 217, 143)", "borderColor" => "#10B981", "created_at" => now(), "updated_at" => now()],
                ["id" => 9, "x" => -394, "y" => 340, "width" => 100, "height" => 49, "locked" => true, "room_number" => "COE 116", "room_type" => "Laboratory Room", "department_priority" => json_encode(["BSCPE"]), "description" => "", "is_active" => 1, "color" => "rgba(38, 217, 143)", "borderColor" => "#10B981", "created_at" => now(), "updated_at" => now()]
            ]),
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('floor_plans')->insert([
            'building' => 'Main Building',
            'floor' => '2nd Floor',
            'floor_plan_map' => 'floor_plan_images/1741965712-MainBuilding-2ndFloor-coe-old-buillding-2nd-floor 1280x720.jpg',
            'rectangles' => json_encode([
                ["id" => 1, "x" => -405, "y" => 458, "width" => 100, "height" => 53, "locked" => true, "room_number" => "COE 215", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 2, "x" => -406, "y" => 397, "width" => 100, "height" => 51, "locked" => true, "room_number" => "COE 216", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 3, "x" => -406, "y" => 339, "width" => 100, "height" => 49, "locked" => true, "room_number" => "COE 217", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 4, "x" => -406, "y" => 276, "width" => 100, "height" => 49, "locked" => true, "room_number" => "COE 218", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 5, "x" => -405, "y" => 213, "width" => 100, "height" => 49, "locked" => true, "room_number" => "COE 219", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 6, "x" => -405, "y" => 153, "width" => 100, "height" => 50, "locked" => true, "room_number" => "COE 220", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 7, "x" => -198.02659260036899, "y" => 26.25912168534512, "width" => 64, "height" => 79, "locked" => true, "room_number" => "COE 222", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 8, "x" => -123.02659260036899, "y" => 25.25912168534512, "width" => 66, "height" => 79, "locked" => true, "room_number" => "COE 223", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 9, "x" => -47.026592600368986, "y" => 25.25912168534512, "width" => 64, "height" => 79, "locked" => true, "room_number" => "COE 224", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 10, "x" => 388, "y" => 275, "width" => 100, "height" => 50, "locked" => true, "room_number" => "COE 204", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 11, "x" => 388, "y" => 336, "width" => 100, "height" => 50, "locked" => true, "room_number" => "COE 205", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 12, "x" => 388, "y" => 399, "width" => 100, "height" => 50, "locked" => true, "room_number" => "COE 206", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 13, "x" => 386, "y" => 461, "width" => 100, "height" => 50, "locked" => true, "room_number" => "COE 207", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 14, "x" => -349, "y" => 554, "width" => 67, "height" => 75, "locked" => true, "room_number" => "COE 214", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 15, "x" => -272, "y" => 553, "width" => 67, "height" => 75, "locked" => true, "room_number" => "COE 213", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 16, "x" => -159, "y" => 555, "width" => 135, "height" => 75, "locked" => true, "room_number" => "COE 212", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 17, "x" => -8, "y" => 555, "width" => 135, "height" => 75, "locked" => true, "room_number" => "COE 211", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 18, "x" => 105, "y" => 554, "width" => 63, "height" => 75, "locked" => true, "room_number" => "COE 210 B", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 19, "x" => 198, "y" => 555, "width" => 98, "height" => 75, "locked" => true, "room_number" => "COE 209 and 210 A", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 20, "x" => 310, "y" => 552, "width" => 104, "height" => 79, "locked" => true, "room_number" => "COE 208", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "updated_at" => "2025-03-14T15:17:39.514Z", "created_at" => "2025-03-14T15:17:39.514Z"],
                ["id" => 21, "x" => -406, "y" => 87, "width" => 100, "height" => 53, "locked" => true, "room_number" => "ECE Dept", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSECE"]), "description" => "", "is_active" => 1, "updated_at" => "2025-03-14T15:32:49.727Z", "created_at" => "2025-03-14T15:32:49.727Z", "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316"],
                ["id" => 22, "x" => 386, "y" => 88, "width" => 104, "height" => 52, "locked" => true, "room_number" => "EE Dept ", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSEE"]), "description" => "", "is_active" => 1, "updated_at" => "2025-03-14T15:33:09.817Z", "created_at" => "2025-03-14T15:33:09.817Z", "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316"]
            ]),
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('floor_plans')->insert([
            'building' => 'New Building Phase 1',
            'floor' => 'Ground Floor',
            'floor_plan_map' => 'floor_plan_images/1746843331-NewBuildingPhase1-GroundFloor-coe-new-building-ground-floor 1280x720.jpg',
            'rectangles' => json_encode([
                ["id" => 1, "x" => 325, "y" => 302, "width" => 78, "height" => 110, "locked" => true, "room_number" => "CE Dept", "room_type" => "Faculty Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(249, 155, 83)", "borderColor" => "#F97316", "created_at" => now(), "updated_at" => now()],
                ["id" => 2, "x" => 234, "y" => 303, "width" => 76, "height" => 109, "locked" => true, "room_number" => "NB Room 1", "room_type" => "Lecture Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "created_at" => now(), "updated_at" => now()],
                ["id" => 3, "x" => 145, "y" => 304, "width" => 76, "height" => 109, "locked" => true, "room_number" => "NB Room 2", "room_type" => "Lecture Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "created_at" => now(), "updated_at" => now()],
                ["id" => 4, "x" => 54, "y" => 303, "width" => 76, "height" => 109, "locked" => true, "room_number" => "NB Room 3", "room_type" => "Lecture Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "created_at" => now(), "updated_at" => now()],
                ["id" => 5, "x" => -36, "y" => 303, "width" => 76, "height" => 109, "locked" => true, "room_number" => "NB Room 4", "room_type" => "Lecture Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "created_at" => now(), "updated_at" => now()],
                ["id" => 6, "x" => -127, "y" => 302, "width" => 76, "height" => 109, "locked" => true, "room_number" => "NB Room 5", "room_type" => "Lecture Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "created_at" => now(), "updated_at" => now()],
                ["id" => 7, "x" => -216, "y" => 302, "width" => 76, "height" => 109, "locked" => true, "room_number" => "NB Room 6", "room_type" => "Lecture Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "created_at" => now(), "updated_at" => now()],
            ]),
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('floor_plans')->insert([
            'building' => 'New Building Phase 1',
            'floor' => '2nd Floor',
            'floor_plan_map' => 'floor_plan_images/1746843689-NewBuildingPhase1-2ndFloor-coe-new-building-2nd-floor 1280x720.jpg',
            'rectangles' => json_encode([
                ["id" => 1, "x" => -274.3157726219863, "y" => 295.25565594944214, "width" => 124, "height" => 112, "locked" => true, "room_number" => "CAD Room 3", "room_type" => "Laboratory Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(38, 217, 143)", "borderColor" => "#10B981", "created_at" => now(), "updated_at" => now()],
                ["id" => 2, "x" => -139.3157726219863, "y" => 295.25565594944214, "width" => 124, "height" => 112, "locked" => true, "room_number" => "CAD Room 2", "room_type" => "Laboratory Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(38, 217, 143)", "borderColor" => "#10B981", "created_at" => now(), "updated_at" => now()],
                ["id" => 3, "x" => 175.6842273780137, "y" => 296.25565594944214, "width" => 124, "height" => 112, "locked" => true, "room_number" => "CAD Room 1", "room_type" => "Laboratory Room", "department_priority" => json_encode(["BSCE"]), "description" => "", "is_active" => 1, "color" => "rgba(38, 217, 143)", "borderColor" => "#10B981", "created_at" => now(), "updated_at" => now()],
                ["id" => 4, "x" => 63.97340739963124, "y" => 294.2591216853451, "width" => 76, "height" => 112, "locked" => true, "room_number" => "NB Room 7", "room_type" => "Lecture Room", "department_priority" => "", "description" => "", "is_active" => 1, "color" => "rgba(148, 219, 253)", "borderColor" => "#1576c1", "created_at" => now(), "updated_at" => now()]
            ]),
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
