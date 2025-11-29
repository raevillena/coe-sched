<?php

namespace App\Http\Requests\AcademicManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateLevelRequest extends FormRequest
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
        $levelId = $this->route('levels')->id;

        return [
            'level_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('control_levels')->ignore($levelId),
            ],
        ];
    }
}
