<?php

namespace App\Http\Requests\RoomManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreFloorPlanRequest extends FormRequest
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
            'building' => [
                'required',
                'string',
                'max:255',
            ],
            'floor' => [
                'required',
                'string',
                'max:255',
            ],
            'floor_plan_map' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:10240',
            ],
            // rectangle validation
            'rectangles' => [
                'required',
                'json',
            ],
            'rectangles.*.id' => [
                'required',
                'integer',
            ],
            'rectangles.*.x' => [
                'required',
                'numeric',
            ],
            'rectangles.*.y' => [
                'required',
                'numeric',
            ],
            'rectangles.*.width' => [
                'required',
                'numeric',
            ],
            'rectangles.*.height' => [
                'required',
                'numeric',
            ],
            'rectangles.*.locked' => [
                'required',
                'boolean',
            ],
            'rectangles.*.room_number' => [
                'required',
                'string',
                'max:255',
            ],
            'rectangles.*.room_type' => [
                'nullable',
                'string',
                'max:255',
            ],
            'rectangles.*.department_priority' => [
                'nullable',
                'string',
                'max:255',
            ],
            'rectangles.*.description' => [
                'nullable',
                'string',
                'max:255',
            ],
            'rectangles.*.room_image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:5120',
            ],
            'rectangles.*.is_active' => [
                'required',
                'integer',
            ],
            'rectangles.*.color' => [
                'required',
                'string',
            ],
            'rectangles.*.borderColor' => [
                'required',
                'string',
            ],
            'rectangles.*.updated_at' => [
                'required',
                'date',
            ],
            'rectangles.*.created_at' => [
                'required',
                'date',
            ],
        ];
    }
}
