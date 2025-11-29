<?php

namespace App\Models\CustomizePDF;

use Illuminate\Database\Eloquent\Model;

class CustomizePDF extends Model
{
    protected $table = 'pdf_customizations';
    
    protected $fillable = [
        'id',
        'year_implemented',
        'name', 
        'image',
    ];
}
