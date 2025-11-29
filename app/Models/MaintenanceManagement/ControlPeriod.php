<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class ControlPeriod extends Model
{
    protected $table = 'control_periods';
    
    protected $fillable = [
        'period_name',
        'is_active',
    ];
}
