<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicManagement\StoreAcademicYearRequest;
use App\Http\Requests\AcademicManagement\StoreDepartmentRequest;
use App\Http\Requests\AcademicManagement\StoreLevelRequest;
use App\Http\Requests\AcademicManagement\StorePeriodRequest;
use App\Http\Requests\AcademicManagement\StorePositionRequest;
use App\Http\Requests\AcademicManagement\UpdateAcademicYearRequest;
use App\Http\Requests\AcademicManagement\UpdateDepartmentRequest;
use App\Http\Requests\AcademicManagement\UpdatePeriodRequest;
use App\Http\Requests\AcademicManagement\UpdateActiveRequest;
use App\Http\Requests\AcademicManagement\UpdateLevelRequest;
use App\Http\Requests\AcademicManagement\UpdatePositionRequest;
use App\Http\Requests\AcademicManagement\UpdateLogoRequest;
use App\Models\Faculty\Department;
use App\Http\Resources\Faculty\DepartmentResource;
use App\Http\Resources\Faculty\PositionResource;
use App\Http\Resources\Maintenance\ControlAcademicYearResource;
use App\Http\Resources\Maintenance\ControlLevelResource;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\Curriculum\AcademicPrograms;
use App\Models\Faculty\Position;
use App\Models\MaintenanceManagement\ControlAcademicYear;
use App\Models\MaintenanceManagement\ControlLevel;
use App\Models\MaintenanceManagement\ControlPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AcademicEntityController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Maintenance Management'],
            ['title' => 'Academic Entity Management', 'link' => route('academic_entity_management.index')],
        ];
        //get departments
        $departments = DepartmentResource::collection(Department::all());

        //get positions
        $positions = Position::all()->unique('name');
        $unique_positions = PositionResource::collection($positions);

        //get periods
        $periods = ControlPeriodResource::collection(ControlPeriod::all());

        //get levels
        $levels = ControlLevelResource::collection(ControlLevel::all());

        //get academic years
        $academic_years = ControlAcademicYearResource::collection(ControlAcademicYear::all());

        return Inertia::render('Maintenance/AcademicEntityManagement', [
            'breadcrumbs' => $breadcrumbs,
            'departments' => $departments,
            'positions' => $unique_positions,
            'periods' => $periods,
            'levels' => $levels,
            'academic_years' => $academic_years,
        ]);
    }

    //department management
    public function store_department(StoreDepartmentRequest $request)
    {
        $store_department = $request->validated();

        $existingDepartmentName = Department::where('name', $request->name)->first();
        if ($existingDepartmentName) {
            return response()->json([
                'message' => 'A department with this name already exists.'
            ], 400);
        }

        $existingDepartmentCode = Department::where('program_code', $request->program_code)->first();
        if ($existingDepartmentCode) {
            return response()->json([
                'message' => 'A department with this code already exists.'
            ], 400);
        }

        $new_department = Department::create($store_department);

        AcademicPrograms::create([
            'department_id' => $new_department->id,
            'program_code' => $request->program_code,
            'program_name' => 'Bachelor of Science in ' . $request->name,
        ]);

        $positions = Position::distinct('name')->pluck('name');
        foreach ($positions as $position_name) {
            Position::create([
                'department_id' => $new_department->id,
                'name' => $position_name,
            ]);
        }

        $cacheVersionKey = 'faculties_version';
        cache()->forget('departments:faculty');
        cache()->increment($cacheVersionKey);

        return response()->json(['success' => 'Department added successfully!']);
    }

    public function update_department(UpdateDepartmentRequest $request, Department $departments)
    {
        #Log::info('Received update request:', ['department_id' => $departments->id]);

        $departments->update($request->validated());

        $new_program_name = 'Bachelor of Science in ' . $departments->name;

        //add exisiting name error to all update controllers

        AcademicPrograms::where('department_id', $departments->id)
            ->update([
                'program_code' => $departments->program_code,
                'program_name' => $new_program_name,
            ]);

        return response()->json([
            'success' => 'Department updated successfully!',
            'departments' => $departments
        ]);
    }

    public function update_department_logo(UpdateLogoRequest $request, Department $department)
    {
        $logoPath = $department->logo;

        if ($request->hasFile('logo')) {
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            $file = $request->file('logo');
            $logoName = time() . '-' . $file->getClientOriginalName();
            $logoPath = $file->storeAs('dept_logos', $logoName, 'public');
        }

        $department->update(['logo' => $logoPath]);

        $cacheKey = 'departments:settings';
        cache()->forget($cacheKey);
        cache()->forget($cacheKey . $department->id);

        cache()->remember($cacheKey, 300, function () {
            return DepartmentResource::collection(Department::all());
        });
        return redirect()->back()->with('success', 'Department logo updated successfully!');
    }   

    //removed
    // public function delete_department(Department $departments)
    // {
    //     AcademicPrograms::where('department_id', $departments->id)->delete();

    //     $departments->delete();

    //     return response()->json([
    //         'departments' => $departments->id,
    //         'success' => 'Department deleted successfully!'
    //     ]);
    // }

    public function update_department_active_status(UpdateActiveRequest $request, Department $departments)
    {
        AcademicPrograms::where('department_id', $departments->id)->update(['is_active' => $request->is_active]);

        $departments->update(['is_active' => $request->is_active]);

        //clear department cache from the faculty controller
        cache()->forget('departments');

        return response()->json([
            'success' => 'Department status updated successfully!',
            'departments' => $departments
        ]);
    }


    //position management
    public function store_position(StorePositionRequest $request)
    {
        $store_position = $request->validated();
        $position_name = $store_position['name'];

        $existingPositionName = Position::where('name', $request->name)->first();
        if ($existingPositionName) {
            return response()->json([
                'message' => 'A position with this name already exists.'
            ], 400);
        }

        $departments = Department::all();

        foreach ($departments as $department) {
            Position::create([
                'department_id' => $department->id,
                'name' => $position_name,
            ]);
        }

        return response()->json(['success' => 'Position added to all departments successfully!']);
    }

    public function update_position(UpdatePositionRequest $request, Position $positions)
    {
        $validated = $request->validated();
        $position_name = $validated['name'];

        $positions->where('name', $positions->name)
            ->update(['name' => $position_name]);

        return response()->json([
            'success' => 'Position updated in all departments successfully!',
        ]);
    }

    public function update_position_active_status(UpdateActiveRequest $request, Position $positions)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];

        $positions->where('name', $positions->name)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Position active status updated in all departments successfully!']);
    }

    public function getAcademicYears()
    {
        $academicYears = ControlAcademicYear::where('is_active', true)
            ->orderBy('academic_year', 'desc')
            ->get()
            ->pluck('academic_year')
            ->toArray();

        return response()->json($academicYears);
    }

    //period management
    public function store_period(StorePeriodRequest $request)
    {
        $store_period = $request->validated();

        $existingPeriodName = ControlPeriod::where('period_name', $request->period_name)->first();
        if ($existingPeriodName) {
            return response()->json([
                'message' => 'A period/semester with this name already exists.'
            ], 400);
        }

        ControlPeriod::create($store_period);

        return response()->json(['success' => 'Period added successfully!']);
    }

    public function update_period(UpdatePeriodRequest $request, ControlPeriod $periods)
    {
        $periods->update($request->validated());

        return response()->json([
            'success' => 'Period updated successfully!',
            'control_periods' => $periods
        ]);
    }

    public function update_period_active_status(UpdateActiveRequest $request, ControlPeriod $periods)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];

        $periods->where('period_name', $periods->period_name)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Position active status updated in all departments successfully!']);
    }

    //level management
    public function store_level(StoreLevelRequest $request)
    {
        $store_level = $request->validated();

        $existingLevelName = ControlLevel::where('level_name', $request->level_name)->first();
        if ($existingLevelName) {
            return response()->json([
                'message' => 'A year level with this name already exists.'
            ], 400);
        }

        ControlLevel::create($store_level);

        return response()->json(['success' => 'Year Level added successfully!']);
    }

    public function update_level(UpdateLevelRequest $request, ControlLevel $levels)
    {
        $levels->update($request->validated());

        return response()->json([
            'success' => 'Year Level updated successfully!',
            'control_levels' => $levels
        ]);
    }

    public function update_level_active_status(UpdateActiveRequest $request, ControlLevel $levels)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];

        $levels->where('level_name', $levels->level_name)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Year Level active status updated in all departments successfully!']);
    }

    //academic year management
    public function store_academic_year(StoreAcademicYearRequest $request)
    {
        $store_ay = $request->validated();

        $existingAY = ControlAcademicYear::where('academic_year', $request->academic_year)->first();
        if ($existingAY) {
            return response()->json([
                'message' => 'A academic year already exists.'
            ], 400);
        }

        ControlAcademicYear::create($store_ay);

        return response()->json(['success' => 'Academic Year added successfully!']);
    }

    public function update_academic_year(UpdateAcademicYearRequest $request, ControlAcademicYear $academic_years)
    {
        $academic_years->update($request->validated());

        return response()->json([
            'success' => 'Academic Year updated successfully!',
            'control_academic_year' => $academic_years
        ]);
    }

    public function update_ay_active_status(UpdateActiveRequest $request, ControlAcademicYear $academic_years)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];

        $academic_years->where('academic_year', $academic_years->academic_year)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Academic Year active status updated in all departments successfully!']);
    }
}
