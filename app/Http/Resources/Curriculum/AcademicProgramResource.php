<?php

namespace App\Http\Resources\Curriculum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Faculty\DepartmentResource;

class AcademicProgramResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'academic_type' => $this->academic_type,
            'department' => DepartmentResource::make($this->department),
            'program_code' => $this->program_code,
            'program_name' => $this->program_name,
            'level' => $this->level,
            'strand' => $this->strand,
            'strand_name' => $this->strand_name,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->toFormattedDateString(),
            'updated_at' => $this->updated_at->toFormattedDateString(),
        ];
    }
}
