<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Faculty\Department;
use App\Http\Resources\Faculty\DepartmentResource;
use App\Http\Resources\Faculty\FacultyResource;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Faculty\PositionResource;
use App\Models\Faculty\Position;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */

    public function create(Request $request): Response
    {
        $departments = DepartmentResource::collection(Department::where('is_active', 1)->get());

        if ($request->has('department_id')) {
            $users = FacultyResource::collection(User::where('department_id', $request->input('department_id'))->get());
        } else {
            $users = FacultyResource::collection(User::all());
        }

        return Inertia::render('Auth/Login', [
            'users' => $users,
            'departments' => $departments,
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // dd($request->all(), $request->user());

        $loggedInUser = $request->user();
        $loggedInUserRole = $request->user()->role;

        if ($loggedInUserRole === 'super-admin') {
            return redirect()->intended(route('super-admin.dashboard', absolute: false))
                ->with('user', $loggedInUser);
        } elseif ($loggedInUserRole === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false))
                ->with('user', $loggedInUser);
        }

        return redirect()->intended(route('dashboard', absolute: false))
            ->with('user', $loggedInUser);
    }

    public function checkRole(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json(['role' => $user->role]);
    }

    public function storeSuperAdmin(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return redirect()->back()->withErrors(['email' => 'Invalid credentials.']);
        }

        $loggedInUser = Auth::user();

        if ($loggedInUser->role !== 'super-admin') {
            return redirect()->back()->withErrors(['email' => 'Only super-admins can log in here.']);
        }

        $request->session()->regenerate();
        
        return redirect()->intended(route('super-admin.dashboard'))
            ->with('user', $loggedInUser);
    }

    //old
    // public function getUsersByDepartment($department_id)
    // {
    //     $department = Department::find($department_id);
    //     if (!$department) {
    //         return response()->json(['message' => 'Department not found'], 404);
    //     }

    //     $users = $department->users()
    //         ->whereIn('role', ['user', 'admin'])
    //         ->where('is_active', 1)
    //         ->with('position')
    //         ->get();

    //     return response()->json($users);
    // }

    public function getUsersByDepartment($department_id)
    {
        $department = Department::find($department_id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $users = $department->users()
            ->whereIn('role', ['user', 'admin']) 
            ->where('is_active', 1)
            ->whereHas('position', function ($query) {
                $query->where('is_active', 1);
            })
            ->with('position')
            ->get();

        return response()->json($users);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
