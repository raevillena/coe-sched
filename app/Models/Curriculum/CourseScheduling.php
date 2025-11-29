<?php

namespace App\Models\Curriculum;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CourseScheduling extends Model
{
    protected $table = 'schedules';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'startTime', // Make sure these column names match the database
        'endTime',
        'SubjectName',
        'color',
        'room',
        'teacher',
        'daysOfWeek',
        'section',
        'course',
        'year',
        'semester',
        'conflict',
        'label',
        'ignoredSplit',
        'student_count',
        'teacher_conflict'
    ];

    // Change the casts to ensure year is properly handled as a string
    protected $casts = [
        'startTime' => 'string',
        'endTime' => 'string',
        'daysOfWeek' => 'string', // Change from array to string since we store JSON
        'year' => 'string'
    ];
    
    // Ensure the year is cast to string before saving
    protected function castAttribute($key, $value)
    {
        if ($key === 'year' && $value !== null) {
            return (string) $value;
        }
        
        return parent::castAttribute($key, $value);
    }

    public function scopeSearch(Builder $query, Request $request): Builder
    {
        return $query->when($request->search, function ($query) use ($request) {
            $query->where(function ($query) use ($request) {
                $query->where('room', 'like', '%' . $request->search . '%')
                    ->orWhere('teacher', 'like', '%' . $request->search . '%')
                    // ->orWhere('course', 'like', '%' . $request->search . '%')
                    ->orWhere('section', 'like', '%' . $request->search . '%');
            });
        })->when($request->year, function ($query) use ($request) {
            $query->where('year', $request->year);
        })->when($request->semester, function ($query) use ($request) {
            $query->where('semester', $request->semester);
        });
    }
}
