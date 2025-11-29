<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicManagement\UpdateActiveRequest;
use App\Http\Requests\SectionManagement\StoreSectionRequest;
use App\Http\Resources\Curriculum\AcademicProgramResource;
use App\Http\Resources\Curriculum\ControlSectionResource;
use App\Http\Resources\Maintenance\ControlLevelResource;
use App\Models\Curriculum\AcademicPrograms;
use App\Models\Faculty\Department;
use App\Models\MaintenanceManagement\ControlLevel;
use App\Models\MaintenanceManagement\ControlSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Maintenance Management'],
            ['title' => 'Section Management', 'link' => route('section_management.index')],
        ];

        $academic_programs = AcademicProgramResource::collection(AcademicPrograms::where('is_active', 1)->get());

        $levels = ControlLevelResource::collection(ControlLevel::where('is_active', 1)->get());

        //get all sections 
        $sections = ControlSectionResource::collection(ControlSection::all());
        
        return Inertia::render('Maintenance/SectionManagement', [
            'breadcrumbs' => $breadcrumbs,
            'academic_programs' => $academic_programs,
            'levels' => $levels,
            'sections' => $sections,
        ]);
    }

    //backup 
    // public function getSectionsName(Request $request)
    // {
    //     $program_code = $request->input('program_code');
    //     $level = $request->input('level');
    //     $section_name = $request->input('section_name');

    //     $existingSections = ControlSection::where('program_code', $request->program_code)
    //         ->where('level', $request->level)
    //         ->pluck('section_name', $request->section_name)
    //         ->toArray(); // Convert to array

    //     return response()->json($existingSections);
    // }

    public function getSectionsName(Request $request)
    {
        $existingSections = ControlSection::where('program_code', $request->program_code)
            ->where('level', $request->level)
            ->pluck('section_name')
            ->toArray();

        return response()->json($existingSections);
    }

    public function store_section(StoreSectionRequest $request)
    {
        $store_section = $request->validated();

        ControlSection::create($store_section);

        return response()->json(['success' => 'Section added successfully!']);
    }

    public function update_section_active_status(UpdateActiveRequest $request, ControlSection $sections, $id)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];

        //Log::info('Updating section ID: ' . $id . ' to is_active: ' . $is_active);

        $sections->where('id', $id)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Section active status updated in all departments successfully!']);
    }

    //get program_code
    public function getProgramCode($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['error' => 'Department not found'], 404);
        }

        return response()->json(['program_code' => $department->program_code]);
    }
}
