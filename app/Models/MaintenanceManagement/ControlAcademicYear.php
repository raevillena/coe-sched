<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class ControlAcademicYear extends Model
{
    protected $table = 'control_academic_year';
    
    protected $fillable = [
        'academic_year',
        'is_active',
    ];
}
