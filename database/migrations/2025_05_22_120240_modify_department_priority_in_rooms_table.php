<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\MaintenanceManagement\Rooms;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, update existing string values to JSON arrays
        $rooms = Rooms::all();
        foreach ($rooms as $room) {
            $currentValue = $room->department_priority;
            if (!is_array($currentValue)) {
                // If it's not already an array, convert it to a single-item array
                $room->department_priority = $currentValue ? [$currentValue] : [];
                $room->save();
            }
        }

        // Add a temporary column
        Schema::table('rooms', function (Blueprint $table) {
            $table->json('department_priority_json')->nullable();
        });

        // Copy data to the temporary column
        DB::statement('UPDATE rooms SET department_priority_json = JSON_ARRAY(department_priority) WHERE JSON_VALID(department_priority) = 0');
        DB::statement('UPDATE rooms SET department_priority_json = department_priority WHERE JSON_VALID(department_priority) = 1');

        // Drop the old column
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn('department_priority');
        });

        // Rename the temporary column to the original name
        Schema::table('rooms', function (Blueprint $table) {
            $table->renameColumn('department_priority_json', 'department_priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add a temporary column
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('department_priority_string')->nullable();
        });

        // Copy first value from JSON array to string column
        DB::statement("UPDATE rooms SET department_priority_string = JSON_UNQUOTE(JSON_EXTRACT(department_priority, '$[0]'))");

        // Drop the JSON column
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn('department_priority');
        });

        // Rename the temporary column to the original name
        Schema::table('rooms', function (Blueprint $table) {
            $table->renameColumn('department_priority_string', 'department_priority');
        });
    }
};
