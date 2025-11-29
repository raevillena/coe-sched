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
        Schema::create('offerings_infos', function (Blueprint $table) {
            $table->id();
            //$table->string('course_type')->nullable(); //not yet used
            $table->unsignedBigInteger('curriculums_id');
            $table->string('course_code')->nullable();  
            $table->string('course_name')->nullable();
            $table->string('section_name');
            $table->string('level');
            $table->timestamps();

            $table->foreign('curriculums_id')
                ->references('id')->on('curriculums')
                ->onUpdate('cascade')
                ->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerings_infos');
    }
};
