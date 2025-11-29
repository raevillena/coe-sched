<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;

use Inertia\Inertia;
use App\Models\Faculty\Department;
use App\Http\Resources\Faculty\FacultyResource;
use App\Http\Resources\Faculty\DepartmentResource;
use App\Http\Requests\Faculty\StoreFacultyRequest;
use App\Http\Requests\Faculty\UpdateFacultyRequest;
use App\Http\Requests\Faculty\UpdateFacultyStatusRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class FacultyController extends Controller
{
    //read
    public function index(Request $request)
    {
        $cacheVersionKey = 'faculties_version';
        $currentVersion = cache()->get($cacheVersionKey, 1);

        $cacheKeyFaculties = 'faculties_' . md5($request->search . $request->department_id . $request->page . $currentVersion);
        $cacheKeyDepartments = 'departments:faculty';

        $faculties = cache()->remember($cacheKeyFaculties, 3600, function () use ($request) {
            return User::where('is_active', 1)
                ->search($request)
                ->paginate(10);
        });

        $departments = cache()->remember($cacheKeyDepartments, 3600, function () {
            return DepartmentResource::collection(Department::all());
        });

        // check cache if working
        // if (cache()->has($cacheKeyFaculties)) {
        //     Log::info("Faculties cache hit");
        // } else {
        //     Log::info("Faculties cache miss");
        // }

        // if (cache()->has($cacheKeyDepartments)) {
        //     Log::info("Departmentss cache hit");
        // } else {
        //     Log::info("Departments cache miss");
        // }

        // breadcrumbs
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Members'],
            ['title' => 'View Faculty', 'link' => route('faculties.index')],
        ];

        return Inertia::render('Faculty/Index', [
            'faculties' => FacultyResource::collection($faculties),
            'departments' => $departments,
            'department_id' => $request->department_id ?? "",
            'search' => $request->search ?? "",
            'breadcrumbs' => $breadcrumbs
        ]);
    }


    public function create()
    {
        $cacheKey = 'departments';

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Members'],
            ['title' => 'Add Faculty', 'link' => route('faculties.create')],
        ];

        $departments = cache()->remember($cacheKey, 300, function () {
            return DepartmentResource::collection(Department::where('is_active', 1)->get());
        });

        return Inertia::render('Faculty/Create', [
            'departments' => $departments,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function store(StoreFacultyRequest $request)
    {
        $username = str_replace(' ', '_', $request->input('name'));

        if ($file = $request->file('profile_picture')) {
            $imageName = time() . '-' . $username . '-' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('profile_pictures', $imageName, 'public');
        } else {
            $imagePath = null;
        }

        User::create(array_merge($request->validated(), ['profile_picture' => $imagePath]));

        $cacheVersionKey = 'faculties_version';
        $currentVersion = cache()->get($cacheVersionKey, 1);
        cache()->put($cacheVersionKey, $currentVersion + 1);

        $cacheKeyFaculties = 'faculties_' . md5($request->search . $request->department_id . $request->page . $currentVersion);

        cache()->forget($cacheKeyFaculties);
        cache()->remember($cacheKeyFaculties, 3600, function () use ($request) {
            return User::where('is_active', 1)
                ->search($request)
                ->paginate(10);
        });

        return redirect()->route('faculties.index')->with('success', 'Faculty created successfully!');
    }

    //delete removed
    // public function destroy(User $faculty, Request $request)
    // {
    //     if ($faculty->id === Auth::id()) {
    //         return response()->json([
    //             'message' => 'You cannot delete your own account.',
    //         ], 403); 
    //     }

    //     if ($faculty->profile_picture) {
    //         Storage::disk('public')->delete($faculty->profile_picture);
    //     }
    //     $faculty->delete();

    //     $cacheVersionKey = 'faculties_version';
    //     $currentVersion = cache()->get($cacheVersionKey, 1);
    //     cache()->put($cacheVersionKey, $currentVersion + 1);

    //     $cacheKeyFaculties = 'faculties_' . md5($request->search . $request->department_id . $request->page . $currentVersion);

    //     cache()->forget($cacheKeyFaculties);
    //     cache()->remember($cacheKeyFaculties, 3600, function () use ($request) {
    //         return User::where('is_active', 1)
    //             ->search($request) 
    //             ->paginate(10);
    //     });

    //     return response()->json([
    //         'message' => 'Faculty member deleted successfully!',
    //         'faculty_id' => $faculty->id,
    //     ]);
    // }

    public function setActiveStatus(User $faculty, UpdateFacultyStatusRequest $request)
    {
        $faculty->update(['is_active' => $request->is_active]);

        $cacheVersionKey = 'faculties_version';
        $currentVersion = cache()->get($cacheVersionKey, 1);
        cache()->put($cacheVersionKey, $currentVersion + 1);

        $cacheKeyFaculties = 'faculties_' . md5($request->search . $request->department_id . $request->page . $currentVersion);

        cache()->forget($cacheKeyFaculties);
        cache()->remember($cacheKeyFaculties, 3600, function () use ($request) {
            return User::where('is_active', 1)
                ->search($request)
                ->paginate(10);
        });

        return response()->json([
            'message' => 'Faculty status updated successfully!',
            'faculty_id' => $faculty->id,
        ]);
    }

    //update
    public function edit(User $faculty)
    {
        $cacheKey = 'departments';

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Members'],
            ['title' => 'View Faculty', 'link' => route('faculties.index')],
            ['title' => 'Edit Faculty'],
        ];

        $departments = cache()->remember($cacheKey, 300, function () {
            return DepartmentResource::collection(Department::all());
        });

        return Inertia::render('Faculty/Edit', [
            'departments' => $departments,
            'faculty' => FacultyResource::make($faculty),
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function update(UpdateFacultyRequest $request, User $faculty)
    {
        $username = str_replace(' ', '_', $request->input('name'));
        $imagePath = $faculty->profile_picture;

        if ($request->hasFile('profile_picture')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $file = $request->file('profile_picture');
            $imageName = time() . '-' . $username . '-' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('profile_pictures', $imageName, 'public');
        }

        $faculty->update(array_merge($request->validated(), ['profile_picture' => $imagePath]));

        $cacheVersionKey = 'faculties_version';
        $currentVersion = cache()->get($cacheVersionKey, 1);
        cache()->put($cacheVersionKey, $currentVersion + 1);

        $cacheKeyFaculties = 'faculties_' . md5($request->search . $request->department_id . $request->page . $currentVersion);

        cache()->forget($cacheKeyFaculties);
        cache()->remember($cacheKeyFaculties, 3600, function () use ($request) {
            return User::where('is_active', 1)
                ->search($request)
                ->paginate(10);
        });
        return redirect()->route('faculties.index')->with('success', 'Faculty updated successfully!');
    }

    public function getInactiveFaculty(Request $request)
    {

        $faculties = User::where('is_active', 0)
            ->search($request)
            ->paginate(10);

        $departments = DepartmentResource::collection(Department::all());

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Members'],
            ['title' => 'View Faculty', 'link' => route('faculties.index')],
            ['title' => 'Inactive Faculty', 'link' => route('faculties.index_in_active')],
        ];

        return Inertia::render('Faculty/IndexInactive', [
            'faculties' => FacultyResource::collection($faculties),
            'departments' => $departments,
            'department_id' => $request->department_id ?? "",
            'search' => $request->search ?? "",
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function getTeachers()
    {
        $teachers = User::where('is_active', 1)
            ->whereIn('role', ['super-admin', 'admin', 'user'])
            ->select('id', 'name')
            ->where('role', '!=', 'super-admin')
            ->get();
            
        return response()->json($teachers);
    }

public function checkTeacher(Request $request)
{
    $teacher = $request->query('teacher');
    $exists = User::where('name', $teacher)
                 ->where('is_active', 1)
                 ->whereIn('role', ['admin', 'user'])
                 ->exists();
    
    return response()->json([
        'exists' => $exists
    ]);
}
}
