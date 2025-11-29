<?php

namespace App\Http\Requests\AcademicManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateAcademicYearRequest extends FormRequest
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
        $ayId = $this->route('academic_years')->id;

        return [
            'academic_year' => [
                'required',
                'string',
                'max:255',
                Rule::unique('control_academic_year')->ignore($ayId),
            ],
        ];
    }
}
