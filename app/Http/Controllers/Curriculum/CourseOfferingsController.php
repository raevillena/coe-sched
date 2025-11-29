<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Http\Requests\Curriculum\StoreCourseOfferingRequest;
use App\Http\Resources\Curriculum\AcademicProgramResource;
use App\Http\Resources\Maintenance\ControlLevelResource;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\Curriculum\AcademicPrograms;
use App\Models\Curriculum\CourseOfferings;
use App\Models\Curriculum\Curriculums;
use App\Models\MaintenanceManagement\ControlLevel;
use App\Models\MaintenanceManagement\ControlPeriod;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;

class CourseOfferingsController extends Controller
{

    public function index(){

        $academic_programs = AcademicProgramResource::collection(AcademicPrograms::where('is_active', 1)->get());

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Course Offering', 'link' => route('course_offerings.index')],
        ];
        
        return Inertia::render('CourseOfferings/Index', [
            'academic_programs' => $academic_programs,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function view($program_code){

        $academic_program = AcademicPrograms::where('program_code', $program_code)->get();
        $program_name = $academic_program->first()?->program_name ?? 'Program Not Found';

        $curriculums = Curriculums::where('program_code', $program_code)->get();
        $curriculum_years = $curriculums->pluck('curriculum_year')->toArray();

        $periods = ControlPeriodResource::collection(ControlPeriod::all());

        $levels = ControlLevelResource::collection(ControlLevel::all());

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'View Course Offering', 'link' => route('course_offerings.index')],
            ['title' => "{$program_code} - Course Offering"]
        ];

        return Inertia::render('CourseOfferings/ViewCourseOfferings', [
            'breadcrumbs' => $breadcrumbs,
            'program_name' => $program_name,
            'program_code' => $program_code,
            'curriculum_years' => $curriculum_years,
            'period_name' => $periods,
            'level_name' => $levels,
        ]);
    }

    public function store(StoreCourseOfferingRequest $request)
    {
        CourseOfferings::create($request->validated());
        return response()->json(['message' => 'Course Offering added successfully!']);
    }

    public function destroy(Request $request)
    {
        // Log::info('Deleting course offering:', ['curriculums_id' => $request->curriculums_id]);
        $course_offering = CourseOfferings::findOrFail($request->curriculums_id);
        $course_offering->delete();
        return response()->json(['message' => 'Course Offering deleted successfully!']);
    }

    

}
