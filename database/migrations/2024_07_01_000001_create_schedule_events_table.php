<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedule_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_id')->unique(); // Custom event ID 
            $table->string('title'); // Course code (e.g., "CPE 123")
            $table->string('subject_name'); // Full course name (e.g., "Digital Logic Design")
            $table->time('start_time'); // Start time in HH:MM:SS format
            $table->time('end_time'); // End time in HH:MM:SS format
            $table->json('days_of_week'); // Store day numbers as JSON array [1,2,3,etc]
            $table->string('room')->nullable(); // Room information
            $table->string('teacher')->nullable(); // Teacher name
            $table->string('color')->nullable(); // Event color for display
            $table->string('section'); // Class section (e.g., "BSCpE 1A")
            $table->string('course'); // Course/Program (e.g., "Computer Engineering")
            $table->string('year'); // Academic year (e.g., "2024-2025")
            $table->string('semester'); // Semester (e.g., "1st Semester")
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_events');
    }
};
