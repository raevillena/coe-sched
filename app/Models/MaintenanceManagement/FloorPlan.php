<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class FloorPlan extends Model
{
    protected $table = 'floor_plans';
    
    protected $fillable = [
        'building',
        'floor',
        'floor_plan_map',
        'rectangles',
        'is_active',
    ];
    
    protected $casts = [
        'rectangles' => 'array', // automatically cast rectangles to array
    ];
}
