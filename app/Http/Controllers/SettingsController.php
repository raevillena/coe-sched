<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Settings\UpdateLogoRequest;
use App\Http\Requests\Settings\UpdateUserPassRequest;
use App\Http\Requests\Settings\UpdateUserRequest;
use App\Models\Faculty\Department;
use App\Http\Resources\Faculty\DepartmentResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $cacheKey = 'departments:settings';

        $departments = cache()->remember($cacheKey, 300, function () {
            return DepartmentResource::collection(Department::all());
        });

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Settings', 'link' => route('settings.index')],
        ];

        return Inertia::render('Settings/Index', [
            'departments' => $departments,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function update_user(UpdateUserRequest $request, User $user)
    {
        $username = str_replace(' ', '_', $request->input('name'));
        $imagePath = $user->profile_picture;

        if ($request->hasFile('profile_picture')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $file = $request->file('profile_picture');
            $imageName = time() . '-' . $username . '-' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('profile_pictures', $imageName, 'public');
        }

        $user->update(array_merge($request->only(['name', 'email', 'designation', 'deloading']), ['profile_picture' => $imagePath]));

        return redirect()->route('settings.index')->with('success', 'Profile updated successfully!');
    }

    public function update_password(UpdateUserPassRequest $request, User $user)
    {
        $validated = $request->validated();

        // berify the old password
        if (!Hash::check($validated['oldPassword'], $user->password)) {
            Log::error('Password update failed for user ID: ' . $user->id . ' - Incorrect old password provided.');
            return response()->json([
                'errors' => [
                    'oldPassword' => ['The provided password does not match our records.'],
                ],
            ], 422);
        }

        // check if the new password is the same as the old password
        if (Hash::check($validated['password'], $user->password)) {
            Log::info('Password update attempted with the same password for user ID: ' . $user->id);
            return response()->json([
                'errors' => [
                    'password' => ['The new password cannot be the same as the old password.'],
                ],
            ], 422);
        }

        $user->password = bcrypt($validated['password']);
        $user->save();

        Log::info('Password updated successfully for user ID: ' . $user->id);

        Auth::logout();

        return redirect()->route('login')->with('status', 'Password updated successfully. Please log in with your new password.');
    }
}
