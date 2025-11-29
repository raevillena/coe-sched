<?php

namespace App\Models\MaintenanceManagement;

use Illuminate\Database\Eloquent\Model;

class Rooms extends Model
{
    protected $table = 'rooms';
    
    protected $fillable = [
        'id',
        'room_id',
        'building',
        'floor',
        'room_number',
        'room_type',
        'department_priority',
        'is_active',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'department_priority' => 'array',
    ];
}
