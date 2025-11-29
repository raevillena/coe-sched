<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class ControlFloor extends Model
{
    protected $table = 'control_floors';
    
    protected $fillable = [
        'floor_name',
        'is_active',
    ];
}
