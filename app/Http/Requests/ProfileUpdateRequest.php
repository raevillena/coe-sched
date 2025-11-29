<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'password' => [
                'required', 
                Password::min(8)
                    ->mixedCase() 
                    ->numbers() 
                    ->uncompromised(), 
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
            'designation' => [
                'nullable',
                'string',
                'max:255',
            ],
            'deloading' => [
                'nullable',
                'integer',
                'min:0',
            ],
        ];
    }
}
