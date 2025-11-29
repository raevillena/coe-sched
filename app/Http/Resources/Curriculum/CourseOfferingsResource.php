<?php

namespace App\Http\Resources\Curriculum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Faculty\DepartmentResource;

class CourseOfferingsResource extends JsonResource
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
            'course_type' => $this->course_type,
            'curriculums_id' => $this->curriculums_id,
            'course_code' => $this->course_code,
            'course_name' => $this->course_name,
            'section_name' => $this->section_name,
            'level' => $this->level,
            'created_at' => $this->created_at->toFormattedDateString(),
            'updated_at' => $this->updated_at->toFormattedDateString(),
        ];
    }
}
