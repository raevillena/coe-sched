<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Http\Resources\Faculty\DepartmentResource;
use App\Models\MaintenanceManagement\ControlPeriod;
use App\Models\Curriculum\CourseScheduling;
use App\Models\Curriculum\Curriculums;
use App\Models\Faculty\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class FacultyWorkloadController extends Controller
{
    public function index(Request $request)
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Loading'],
            ['title' => 'Faculty Workload', 'link' => route('faculty_workload.index')],
        ];

        $departments = DepartmentResource::collection(Department::where('is_active', 1)->get());
        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());

        return Inertia::render('FacultyLoading/FacultyWorkload', [
            'breadcrumbs' => $breadcrumbs,
            'period_name' => $periods,
            'departments' => $departments,
        ]);
    }
    
    public function getSchedules(Request $request)
    {
        
        function formatTime($time)
        {
            return \Carbon\Carbon::createFromFormat('H:i:s', $time)->format('g:i A');
        }

        try {
            $query = CourseScheduling::query();

            if ($request->has('year')) {
                $query->where('year', $request->year);
            }

            if ($request->has('semester')) {
                $query->where('semester', $request->semester);
            }

            // if ($request->has('course')) {
            //     $query->where('course', $request->course);
            // }

            $schedules = $query->get();

            $curriculums = Curriculums::where([
                ['program_code', $request->course],
                // ['curriculum_year', $request->year],
                ['period', $request->semester]
            ])->select('course_name as SubjectName', 'lec', 'lab', 'units')->get();

            // Group schedules by subject, course, section, teacher, and label (if present)
            $groupedSchedules = $schedules->groupBy(function ($schedule) {
                $groupingKey = $schedule->SubjectName . '|' . $schedule->course . '|' . $schedule->section . '|' . $schedule->teacher;
                // include 'label' in the grouping key only if it exists
                if (!empty($schedule->label)) {
                    $groupingKey .= '|' . $schedule->label;
                }
                return $groupingKey;
            });

            $formattedSchedules = $groupedSchedules->map(function ($group) use ($curriculums) {
                $firstSchedule = $group->first();

                $daysOfWeek = $group->pluck('daysOfWeek')
                    ->flatMap(function ($days) {
                        return is_string($days) ? json_decode($days, true) : $days;
                    })
                    ->unique()
                    ->sort()
                    ->values()
                    ->all();

                // Merge startTime and endTime ranges
                $timeRanges = $group->map(function ($schedule) {
                    return formatTime($schedule->startTime) . ' - ' . formatTime($schedule->endTime);
                })->unique()->values()->implode(' / ');

                // Merge rooms with slash if multiple
                $rooms = $group->pluck('room')->unique()->values()->implode(' / ');

                $matchingCurriculum = $curriculums->firstWhere('SubjectName', $firstSchedule->SubjectName);

                return array_merge($firstSchedule->only([
                    'id',
                    'title',
                    'daysOfWeek',
                    'SubjectName',
                    //'room',
                    'teacher',
                    'color',
                    'section',
                    'course',
                    'year',
                    'semester',
                    'conflict',
                    'label',
                    'student_count',
                    'updated_at',
                ]), [
                    'daysOfWeek' => $daysOfWeek,
                    'timeRanges' => $timeRanges,
                    'room' => $rooms,
                    'lec' => $matchingCurriculum->lec ?? null,
                    'lab' => $matchingCurriculum->lab ?? null,
                    'units' => $matchingCurriculum->units ?? null,
                ]);
            })->values();

            return response()->json($formattedSchedules);
        } catch (\Exception $e) {
            Log::error('Error retrieving schedules:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Something went wrong. Please try again later.'], 500);
        }
    }

    public function getInstructors(Request $request)
    {
        $departmentId = $request->query('departmentId');

        $instructors = User::where('department_id', $departmentId)
            ->where('is_active', 1)
            ->where('role', '!=', 'super-admin')
            ->get();

        return response()->json($instructors);
    }

    public function getDepartments()
    {
        $departments = Department::where('is_active', 1)->get();
        return response()->json($departments);
    }

    public function updateStudentCounts(Request $request)
    {
        $studentCounts = $request->input('studentCounts');

        foreach ($studentCounts as $scheduleId => $count) {
            $schedule = CourseScheduling::find($scheduleId);

            if ($schedule) {
                $schedule->student_count = $count;
                $schedule->save();
            }
        }

        return response()->json(['message' => 'Number of students updated successfully.']);
    }
}
