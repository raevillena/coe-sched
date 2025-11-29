<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class ControlLevel extends Model
{
    protected $table = 'control_levels';
    
    protected $fillable = [
        'level_name',
        'is_active',
    ];
}
