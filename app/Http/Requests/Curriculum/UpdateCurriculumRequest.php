<?php

namespace App\Http\Requests\Curriculum;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateCurriculumRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'curriculum_year' => [
                'required',
                'integer',
            ],
            'control_code' => [
                'required',
                'string',
                'max:255',
            ],
            'course_code' => [
                'required',
                'string',
                'max:255',
            ],
            'course_name' => [
                'required',
                'string',
                'max:255',
            ],
            'lec' => [
                'required',
                'integer',
            ],
            'lab' => [
                'required',
                'integer',
            ],
            'units' => [
                'required',
                'integer',
            ],
            'level' => [
                'required',
                'string',
            ],
            'period' => [
                'required',
                'string',
                'max:255',
            ],
            'is_complab' => [
                'required',
                'boolean',
            ],
            'pre_reqs' => [
                'nullable',
                'string',
            ],
        ];
    }
}
