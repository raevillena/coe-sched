<?php

namespace App\Models\Curriculum;

use Illuminate\Database\Eloquent\Model;

class CourseOfferings extends Model
{
    protected $table = 'offerings_infos';

    protected $fillable = [
        'course_code',  
        'course_type',
        'curriculums_id',
        'course_name',
        'section_name',
        'level'
    ];
    
    public function curriculums()
    {
        return $this->belongsTo(Curriculums::class, 'curriculums_id');
    }
    
}
