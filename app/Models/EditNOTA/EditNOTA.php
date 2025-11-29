<?php

namespace App\Models\EditNOTA;

use Illuminate\Database\Eloquent\Model;

class EditNOTA extends Model
{
    protected $table = 'nota_contents';
    
    protected $fillable = [
        'id',
        'intro',
        'body',
    ];
}
