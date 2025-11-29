<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Http\Resources\Curriculum\ControlSectionResource;
use App\Http\Resources\Curriculum\CourseOfferingsResource;
use App\Http\Resources\Maintenance\ControlLevelResource;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\MaintenanceManagement\ControlSection;
use App\Models\Curriculum\CourseOfferings;
use App\Models\Curriculum\Curriculums;
use App\Models\MaintenanceManagement\ControlLevel;
use App\Models\MaintenanceManagement\ControlPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;

class ControlSectionController extends Controller
{
    //get sections
    public function getSections(Request $request)
    {
        $sections = ControlSectionResource::collection(
            ControlSection::where('program_code', $request->program_code)
                ->where('is_active', 1)
                ->where('level', $request->level)->get()
        );

        return response()->json($sections);
    }

    //get curriculum year
    public function getCurriculumYear(Request $request)
    {
        $curriculum_year = Curriculums::where('program_code', $request->program_code)
            ->where('level', $request->level)->get();
        $curriculum_years = $curriculum_year->pluck('curriculum_year')->toArray();

        return response()->json($curriculum_years);
    }

    //get courses
    public function getCourses(Request $request)
    {
        // Get offered courses
        $offered_courses = CourseOfferings::with(['curriculums:id,course_code,course_name,lec,lab,units'])
            ->whereHas('curriculums', function ($query) use ($request) {
                $query->where('program_code', $request->program_code)
                    ->where('level', $request->level)
                    ->where('curriculum_year', $request->curriculum_year)
                    ->where('period', $request->period);
            })
            ->where('section_name', $request->section_name)
            ->where('level', $request->level)
            ->get();

        // Get courses to offer, except offered courses
        $courses_to_offer = Curriculums::where('program_code', $request->program_code)
            ->where('level', $request->level)
            ->where('curriculum_year', $request->curriculum_year)
            ->where('period', $request->period)
            ->where('is_active', 1)
            ->whereNotIn('id', $offered_courses->pluck('curriculums.id'))
            ->get(['id', 'course_code', 'course_name', 'lec', 'lab', 'units']);

        return response()->json([
            'courses_to_offer' => $courses_to_offer,
            'offered_courses' => $offered_courses,
        ]);
    }

    //get periods
    public function getPeriods()
    {
        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());
        return response()->json($periods);
    }

    //get levels
    public function getLevels()
    {
        $levels = ControlLevelResource::collection(ControlLevel::where('is_active', 1)->get());
        return response()->json($levels);
    }
}
