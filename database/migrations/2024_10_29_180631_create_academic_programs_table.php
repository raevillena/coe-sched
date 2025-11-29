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
        Schema::create('academic_programs', function (Blueprint $table) {
            $table->id();
            $table->string('academic_type')->default('College')->nullable();
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments');
            $table->string('program_code')->nullable();
            $table->string('program_name')->nullable();
            //$table->string('level')->nullable(); //not yet used
            //$table->string('strand')->nullable(); //not yet used
            //$table->string('strand_name')->nullable(); //not yet used
            $table->integer('is_active')->default(1); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_programs');
    }
};
