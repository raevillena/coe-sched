<?php

namespace App\Models\Curriculum;

use Illuminate\Database\Eloquent\Model;
use App\Models\Faculty\Department;
use Illuminate\Database\Eloquent\Builder;

class Curriculums extends Model
{
    protected $table = 'curriculums';

    protected $fillable = [
        'curriculum_year',
        'program_code',
        'program_name',
        'control_code',
        'course_code',
        'course_name',
        'lec',
        'lab',
        'units',
        'level',
        'period',
        'is_complab',
        'pre_reqs',
        'is_active',
    ];

    public function offerings_infos()
    {
        return $this->hasMany(CourseOfferings::class, 'curriculums_id');
    }
}


