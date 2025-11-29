<?php

namespace App\Models\Faculty;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Curriculum\AcademicPrograms;
use App\Models\User;

class Department extends Model
{
    /** @use HasFactory<\Database\Factories\PositionsFactory> */
    use HasFactory;

    protected $fillable = ['name', 'program_code', 'logo', 'is_active'];

    public function positions()
    {
        return $this->hasMany(Position::class, 'department_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'department_id');
    }

    public function academicPrograms()
    {
        return $this->hasMany(AcademicPrograms::class, 'department_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
