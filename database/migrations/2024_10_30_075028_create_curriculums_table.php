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
        Schema::create('curriculums', function (Blueprint $table) {
            $table->id();
            $table->integer('curriculum_year');
            $table->string('program_code');
            $table->string('program_name');
            $table->string('control_code');
            $table->string('course_code');
            $table->string('course_name');
            $table->integer('lec')->nullable()->default(0);
            $table->integer('lab')->nullable()->default(0);
            $table->integer('units')->nullable()->default(0);
            //$table->decimal('hours',5,2)->nullable(); //not yet used
            $table->string('level');
            $table->string('period');
            //$table->decimal('srf', 10,2)->default(0.00); //not yet used
            //$table->integer('percent_tuition')->default(100); //not yet used
            $table->integer('is_complab')->default(0);
            $table->string('pre_reqs')->nullable();
            $table->integer('is_active')->default(1); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculums');
    }
};
