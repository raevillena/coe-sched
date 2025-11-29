<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Http\Requests\Curriculum\ArchiveCurriculumRequest;
use App\Http\Resources\Curriculum\AcademicProgramResource;
use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\Curriculums;
use App\Http\Requests\Curriculum\StoreCurriculumRequest;
use App\Http\Requests\Curriculum\UpdateCurriculumRequest;
use App\Http\Resources\Maintenance\ControlLevelResource;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\MaintenanceManagement\ControlLevel;
use App\Models\MaintenanceManagement\ControlPeriod;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class CurriculumController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Curriculum', 'link' => route('curriculum.index')],
        ];

        $academic_programs = AcademicProgramResource::collection(AcademicPrograms::where('is_active', 1)->get());

        return Inertia::render('Curriculum/Index', [
            'academic_programs' => $academic_programs,
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    public function add()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Curriculum', 'link' => route('curriculum.index')],
            ['title' => 'Add Curriculum', 'link' => route('curriculum.add')],
        ];


        //get academic programs
        $academic_programs = AcademicProgramResource::collection(AcademicPrograms::where('is_active', 1)->get());

        //get periods
        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());

        //get levels
        $levels = ControlLevelResource::collection(ControlLevel::where('is_active', 1)->get());


        return Inertia::render('Curriculum/AddCurriculum', [
            'academic_programs' => $academic_programs,
            'periods' => $periods,
            'levels' => $levels,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function store(StoreCurriculumRequest $request)
    {
        $curriculums = $request->validated()['rows'];
        $timestamp = now();

        foreach ($curriculums as &$curriculum) {
            $curriculum['created_at'] = $timestamp;
            $curriculum['updated_at'] = $timestamp;
        }

        Curriculums::insert($curriculums);

        return redirect()->route('curriculum.index')->with('success', 'Curriculum added successfully!');
    }

    public function view($program_code)
    {
        /*alaen pela tay pagbasean nga dept(program_code) ex. BSCPE (galing URL) ijay academic_programs table
        then alaen ni program_name*/
        $academic_program = AcademicPrograms::where('program_code', $program_code)->get();
        $program_name = $academic_program->first()?->program_name ?? 'Program Not Found';

        //alaen ta pay dijay year metten gamit curriculums table
        $curriculums = Curriculums::where('program_code', $program_code)->get();
        $curriculum_years = $curriculums->pluck('curriculum_year')->toArray();

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Curriculum', 'link' => route('curriculum.index')],
            ['title' => $program_code, 'link' => route('curriculum.view', ['program_code' => $program_code])],
        ];

        return Inertia::render('Curriculum/ViewCurriculum', [
            'curriculums' => $curriculums,
            'program_name' => $program_name,
            'program_code' => $program_code,
            'curriculum_years' => $curriculum_years,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function list($program_code, $curriculum_year)
    {
        [$base_year, $next_year] = explode('-', $curriculum_year);

        //2024-2025
        $curriculum_range = "{$base_year}-{$next_year}";

        $curriculums = Curriculums::where('program_code', $program_code)
            ->where('curriculum_year', $curriculum_range)
            ->where('is_active', 1)
            ->get();

        $program_name = $curriculums->first()?->program_name ?? 'Program Not Found';

        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());

        $levels = ControlLevelResource::collection(ControlLevel::where('is_active', 1)->get());

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Curriculum', 'link' => route('curriculum.index')],
            ['title' => $program_code, 'link' => route('curriculum.view', ['program_code' => $program_code])],
            ['title' => "{$base_year}-{$next_year}"],
            ['title' => "List of Subjects"],
        ];

        return Inertia::render('Curriculum/ListCurriculum', [
            'curriculums' => $curriculums,
            'program_name' => $program_name,
            'program_code' => $program_code,
            'curriculum_year' => "{$base_year}-{$next_year}",
            'periods' => $periods,
            'levels' => $levels,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function edit($program_code, $curriculum_year)
    {
        [$base_year, $next_year] = explode('-', $curriculum_year);

        $curriculums = Curriculums::where('program_code', $program_code)
            ->whereIn('curriculum_year', [$base_year, $next_year])
            ->where('is_active', 1)
            ->get();

        $program_name = $curriculums->first()?->program_name ?? 'Program Not Found';

        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());

        $levels = ControlLevelResource::collection(ControlLevel::where('is_active', 1)->get());

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Curriculum', 'link' => route('curriculum.index')],
            ['title' => $program_code, 'link' => route('curriculum.view', ['program_code' => $program_code])],
            ['title' => "{$base_year}-{$next_year}"],
            ['title' => "Edit Curriculum", 'link' => route('curriculum.edit', ['program_code' => $program_code, 'curriculum_year' => $curriculum_year])],
        ];

        return Inertia::render('Curriculum/EditCurriculum', [
            'curriculums' => $curriculums,
            'program_name' => $program_name,
            'program_code' => $program_code,
            'curriculum_year' => "{$base_year}-{$next_year}",
            'periods' => $periods,
            'levels' => $levels,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function edit_archived($program_code, $curriculum_year)
    {
        [$base_year, $next_year] = explode('-', $curriculum_year);

        $curriculums = Curriculums::where('program_code', $program_code)
            ->whereIn('curriculum_year', [$base_year, $next_year])
            ->where('is_active', 0)
            ->get();

        $program_name = $curriculums->first()?->program_name ?? 'No Data Found';

        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());

        $levels = ControlLevelResource::collection(ControlLevel::where('is_active', 1)->get());

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Curriculum', 'link' => route('curriculum.index')],
            ['title' => $program_code, 'link' => route('curriculum.view', ['program_code' => $program_code])],
            ['title' => "{$base_year}-{$next_year}"],
            ['title' => "Edit Curriculum", 'link' => route('curriculum.edit', ['program_code' => $program_code, 'curriculum_year' => $curriculum_year])],
            ['title' => "Archived Curriculum"],

        ];

        return Inertia::render('Curriculum/ArchivedCurriculum', [
            'curriculums' => $curriculums,
            'program_name' => $program_name,
            'program_code' => $program_code,
            'curriculum_year' => "{$base_year}-{$next_year}",
            'periods' => $periods,
            'levels' => $levels,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function update(UpdateCurriculumRequest $request, Curriculums $curriculum)
    {
        $curriculum->update($request->validated());
        return response()->json([
            'success' => 'Curriculum updated successfully!',
            'curriculum' => $curriculum,
        ]);
    }

    //removed
    // public function destroy(Curriculums $curriculum)
    // {
    //     $curriculum->delete();
    //     return response()->json([
    //         'success' => 'Curriculum deleted successfully!',
    //         'curriculum_id' => $curriculum->id,
    //     ]);
    // }

    public function archiveCurriculum(ArchiveCurriculumRequest $request, Curriculums $curriculum)
    {
        $curriculum->update(['is_active' => $request->is_active]);
        return response()->json([
            'success' => 'Curriculum archived successfully!',
            'curriculum_id' => $curriculum->id,
        ]);
    }

    public function getCurriculumYear(Request $request)
    {
        $curriculum_year = Curriculums::where('program_code', $request->program_code)->get();
        $curriculum_years = $curriculum_year->pluck('curriculum_year')->toArray();

        return response()->json($curriculum_years);
    }

    //duplicate curriculum
    public function duplicateCurriculum(Request $request)
    {
        $validated = $request->validate([
            'curriculumYear' => 'required|digits:4',
            'newCurriculumYear' => 'required|digits:4|different:curriculumYear',
            'program_code' => 'required|string',
        ]);

        $curriculumYear = $validated['curriculumYear'];
        $newCurriculumYear = $validated['newCurriculumYear'];
        $programCode = $validated['program_code'];

        // check if cy already exists for the given program code
        $existingCurriculum = Curriculums::where('curriculum_year', $newCurriculumYear)
            ->where('program_code', $programCode)
            ->exists();
        if ($existingCurriculum) {
            return response()->json(['message' => 'The new curriculum year already exists for this program.'], 400);
        }

        $curriculums = Curriculums::where('curriculum_year', $curriculumYear)
            ->where('program_code', $programCode)
            ->get();

        if ($curriculums->isEmpty()) {
            return response()->json(['message' => 'No curriculum found for the specified year and program.'], 404);
        }

        $newCurriculums = $curriculums->map(function ($curriculum) use ($newCurriculumYear) {
            return [
                'curriculum_year' => $newCurriculumYear,
                'program_code' => $curriculum->program_code,
                'program_name' => $curriculum->program_name,
                'control_code' => $curriculum->control_code,
                'course_code' => $curriculum->course_code,
                'course_name' => $curriculum->course_name,
                'lec' => $curriculum->lec,
                'lab' => $curriculum->lab,
                'units' => $curriculum->units,
                'level' => $curriculum->level,
                'period' => $curriculum->period,
                'is_complab' => $curriculum->is_complab,
                'pre_reqs' => $curriculum->pre_reqs,
                'is_active' => $curriculum->is_active,
            ];
        });

        Curriculums::insert($newCurriculums->toArray());

        // Log::info('Curriculum duplicated successfully.', [
        //     'programCode' => $programCode,
        //     'curriculumYear' => $curriculumYear,
        //     'newCurriculumYear' => $newCurriculumYear,
        //     'duplicatedCurriculums' => $newCurriculums->toArray(),
        // ]);

        return response()->json(['message' => 'Curriculum duplicated successfully!'], 200);
    }
}
