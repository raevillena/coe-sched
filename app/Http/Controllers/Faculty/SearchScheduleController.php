<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Curriculum\CourseScheduling;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class SearchScheduleController extends Controller
{
    public function index(Request $request)
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Loading'],
            ['title' => 'Search Schedule', 'link' => route('search_schedule.index')],
        ];

        $schedules = CourseScheduling::search($request)->paginate(10);

        return Inertia::render('FacultyLoading/SearchSchedule', [
            'breadcrumbs' => $breadcrumbs,
            'schedules' => $schedules,
        ]);
    }

    public function getSearchedSchedules(Request $request)
    {
        try {
            //use search scope to filter schedules
            $schedules = CourseScheduling::search($request)->get();

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
