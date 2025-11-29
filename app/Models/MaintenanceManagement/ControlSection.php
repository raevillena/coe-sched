<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class ControlSection extends Model
{
    protected $table = 'control_sections';
    
    protected $fillable = [
        'id',
        'program_code',
        'program_name',
        'level',
        'section_name',
        'is_active'
    ];
}
