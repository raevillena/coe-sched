<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class ControlBuilding extends Model
{
    protected $table = 'control_buildings';
    
    protected $fillable = [
        'building_name',
        'is_active',
    ];
}
