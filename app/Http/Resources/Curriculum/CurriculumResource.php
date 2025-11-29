<?php

namespace App\Http\Resources\Curriculum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurriculumResource extends JsonResource
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
            'curriculum_year' => $this->curriculum_year,
            'program_code' => $this->program_code,
            'program_name' => $this->program_name,
            'control_code' => $this->control_code,
            'course_code' => $this->course_code,
            'course_name' => $this->course_name,
            'lec' =>$this->lec,
            'lab' =>$this->lab,
            'units' => $this->units,
            'hours' => $this->hours,
            'level' => $this->level,
            'period' => $this->period,
            'srf' => $this->srf,
            'percent_tuition' => $this->percent_situation,
            'is_complab' => $this->is_complab,
            'pre_reqs' => $this->pre_req,
            'created_at' => $this->created_at->toFormattedDateString(),
            'updated_at' => $this->updated_at->toFormattedDateString(),
        ];
    }
}
