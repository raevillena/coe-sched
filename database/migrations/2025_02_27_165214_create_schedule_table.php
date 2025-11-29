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
        Schema::create('schedules', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('startTime'); 
            $table->string('endTime');   
            $table->string('SubjectName');
            $table->string('color')->nullable();
            $table->string('label')->nullable(); // Label (e.g., "Split 1", "Split 2")
            $table->string('room')->nullable();
            $table->string('teacher')->nullable();
            $table->json('daysOfWeek')->nullable();
            $table->string('section')->nullable();
            $table->integer('student_count')->default(0); // For number of students
            $table->string('course')->nullable();
            $table->string('year')->nullable();
            $table->string('semester')->nullable();
            $table->boolean('conflict')->default(false);
            $table->boolean('ignoredSplit')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
