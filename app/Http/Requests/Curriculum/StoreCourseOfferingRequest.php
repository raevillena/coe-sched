<?php

namespace App\Http\Requests\Curriculum;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCourseOfferingRequest extends FormRequest
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
            'course_type' => [
                'nullable',
                'string',
            ],
            'curriculums_id' => [
                'required',
                'exists:curriculums,id',
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
            'section_name' => [
                'required',
                'string',
            ],
            'level' => [
                'required',
                'string',
            ],
        ];

    }

    
}
