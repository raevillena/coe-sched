<?php

namespace App\Http\Requests\Faculty;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class UpdateFacultyRequest extends FormRequest
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
        $facultyId = $this->route('faculty')->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                "unique:users,email,{$facultyId}",
            ],
            'password' => [
                'required',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    // ->uncompromised(),
            ],
            'position_id' => [
                'required',
                'exists:positions,id',
            ],
            'department_id' => [
                'required',
                'exists:departments,id',
            ],
            'profile_picture' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:10240',
            ],
            'role' => [
                'required',
                'string',

            ],
            'is_dean' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) {
                    if ($value == 1 && User::where('is_dean', 1)->exists()) {
                        $fail('A dean is already assigned. Please update the current dean`s status before proceeding.');
                    }
                },
            ],
        ];
    }
}
