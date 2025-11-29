<?php

namespace App\Models\Curriculum;

use Illuminate\Database\Eloquent\Model;
use App\Models\Faculty\Department;

class AcademicPrograms extends Model
{
    protected $table = 'academic_programs';

    protected $fillable = [
        'academic_type',
        'department_id',
        'program_code',
        'program_name',
        'level',
        'is_active',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
