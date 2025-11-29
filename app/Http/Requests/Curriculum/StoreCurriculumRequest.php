<?php

namespace App\Http\Requests\Curriculum;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCurriculumRequest extends FormRequest
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
            'rows' => [
                'required',
                'array',
            ],
            'rows.*.curriculum_year' => [
                'required',
                'integer',
            ],
            'rows.*.program_code' => [
                'required',
                'string',
                'max:255',
            ],
            'rows.*.program_name' => [
                'required',
                'string',
                'max:255',
            ],
            'rows.*.control_code' => [
                'required',
                'string',
                'max:255',
            ],
            'rows.*.course_code' => [
                'required',
                'string',
                'max:255',
            ],
            'rows.*.course_name' => [
                'required',
                'string',
                'max:255',
            ],
            'rows.*.lec' => [
                'nullable',
                'integer',
            ],
            'rows.*.lab' => [
                'nullable',
                'integer',
            ],
            'rows.*.units' => [
                'required',
                'integer',
            ],
            'rows.*.level' => [
                'required',
                'string',
            ],
            'rows.*.period' => [
                'required',
                'string',
                'max:255',
            ],
            'rows.*.is_complab' => [
                'required',
                'boolean',
            ],
            'rows.*.pre_reqs' => [
                'nullable',
                'string',
            ],
        ];
    }
}
