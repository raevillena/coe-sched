<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\Curriculum\Curriculums;
use App\Models\MaintenanceManagement\ControlPeriod;
use App\Models\MaintenanceManagement\FloorPlan;
use App\Models\Curriculum\CourseScheduling;
use App\Models\MaintenanceManagement\ControlAcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RoomScheduleController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Loading'],
            ['title' => 'Room Schedule', 'link' => route('rooms_schedule.index')],
        ];

        $floor_plans = FloorPlan::where('is_active', 1)->get();

        //get periods
        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());

        return Inertia::render('FacultyLoading/RoomSchedule', [
            'breadcrumbs' => $breadcrumbs,
            'floor_plans' => $floor_plans,
            'period_name' => $periods,
        ]);
    }

    //this is get academic_year
    public function getCurriculumYear()
    {
        // $curriculum_years = Curriculums::pluck('curriculum_year')->toArray();

        // return response()->json($curriculum_years);
        $academicYears = ControlAcademicYear::where('is_active', true)
            ->orderBy('academic_year', 'desc')
            ->get()
            ->pluck('academic_year')
            ->toArray();

        return response()->json($academicYears);
    }


    public function getSchedules(Request $request)
    {
        try {
            $query = CourseScheduling::query();

            if ($request->has('year')) {
                $query->where('year', $request->year);
            }

            if ($request->has('semester')) {
                $query->where('semester', $request->semester);
            }

            if ($request->has('room')) {
                $query->where('room', $request->room);
            }
            
            $schedules = $query->get();

            $formattedSchedules = $schedules->map(function ($schedule) {
                return [
                    'id' => (string)$schedule->id,
                    'title' => $schedule->title,
                    'startTime' => $schedule->startTime,
                    'endTime' => $schedule->endTime,
                    'daysOfWeek' => $schedule->daysOfWeek,
                    'SubjectName' => $schedule->SubjectName,
                    'room' => $schedule->room,
                    'teacher' => $schedule->teacher,
                    'color' => $schedule->color,
                    'section' => $schedule->section,
                    'course' => $schedule->course,
                    'year' => $schedule->year,
                    'semester' => $schedule->semester,
                    'conflict' => $schedule->conflict,
                    'label' => $schedule->label,
                ];
            });

            return response()->json($formattedSchedules);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
