<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\Curriculum\CourseScheduling;
use App\Models\Curriculum\Curriculums;
use App\Models\Faculty\Department;
use App\Models\MaintenanceManagement\ControlAcademicYear;
use App\Models\MaintenanceManagement\ControlLevel;
use App\Models\MaintenanceManagement\ControlPeriod;
use App\Models\MaintenanceManagement\Rooms;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SuperAdminController extends Controller
{

    //NOTE: ALL OF THIS FUNCTIONS GET THE LATEST ACADEMIC YEAR UNLESS IS_ACTIVE IS SET TO FALSE
    
    public function getActiveUsersPercentage()
    {
        $totalUsers = User::count();
        $activeUser = User::where('is_active', 1)->count();
        $percentage = $totalUsers > 0 ? ($activeUser / $totalUsers) * 100 : 0;

        return response()->json([
            'percentage' => $percentage,
            'total_users' => $totalUsers,
            'active_users' => $activeUser,
        ]);
    }

    public function getScheduleConflicts(Request $request)
    {
        // $latestYear = CourseScheduling::max('year');
        $latestYear = ControlAcademicYear::where('is_active', 1)->max('academic_year');

        $semester = $request->input('period');

        $conflictSchedule = CourseScheduling::where('year', $latestYear)
            ->where('semester', $semester)
            ->where('conflict', true)
            ->get(['id', 'title', 'course', 'section', 'year', 'label', 'startTime', 'endTime', 'room', 'teacher']);

        // Log::info('Conflict schedules retrieved', [
        //     'year' => $currentYear,
        //     'semester' => $semester,
        //     'conflict_schedules' => $conflictSchedule
        // ]);

        return response()->json($conflictSchedule);
    }

    public function getPeriods()
    {
        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());
        return response()->json($periods);
    }

    public function getRoomsScheduleForCurrentYear()
    {
        // $latestYear = CourseScheduling::max('year');
        $latestYear = ControlAcademicYear::where('is_active', 1)->max('academic_year');

        $rooms = Rooms::select('room_number')->get()->pluck('room_number')->toArray();

        $schedules = CourseScheduling::where('year', $latestYear)
            ->where('conflict', '!=', '1')
            ->whereIn('room', $rooms)
            ->get([
                'id',
                'title',
                'startTime',
                'endTime',
                'year',
                'room',
            ]);

        return response()->json($schedules);
    }

    public function getUserSchedules(Request $request)
    {
        $semester = $request->input('period');
        $departmentId = $request->input('department_id');

        if (!$semester) {
            return response()->json(['error' => 'Period is required'], 400);
        }

        $department = Department::find($departmentId);
        if (!$department) {
            return response()->json(['error' => 'Department not found'], 404);
        }

        $programCode = $department->program_code;
        // $latestYear = CourseScheduling::max('year');
        $latestYear = ControlAcademicYear::where('is_active', 1)->max('academic_year');

        $instructorNames = User::where('department_id', $departmentId)->pluck('name')->toArray();

        // Fetch schedules
        $schedules = CourseScheduling::where('year', $latestYear)
            ->where('course', $programCode)
            ->where('semester', $semester)
            ->whereIn('teacher', $instructorNames) //added for filtering by instructor names
            ->get([
                'id',
                'title',
                'label',
                'course',
                'section',
                'startTime',
                'endTime',
                'room',
                'teacher',
                'daysOfWeek'
            ]);

        $curriculums = Curriculums::where('program_code', $programCode)
            ->where('period', $semester)
            ->get(['course_code', 'lec', 'lab', 'units']);

        $groupedSchedules = $schedules->groupBy(function ($schedule) {
            $key = $schedule->title . '|' . $schedule->course . '|' . $schedule->section . '|' . $schedule->teacher;
            if (!empty($schedule->label)) {
                $key .= '|' . $schedule->label;
            }
            return $key;
        });

        function formatTime($time)
        {
            return \Carbon\Carbon::createFromFormat('H:i:s', $time)->format('g:i A');
        }

        $formattedSchedules = $groupedSchedules->map(function ($group) use ($curriculums) {
            $first = $group->first();

            $daysOfWeek = $group->pluck('daysOfWeek')
                ->flatMap(function ($days) {
                    return is_string($days) ? json_decode($days, true) : $days;
                })
                ->unique()
                ->sort()
                ->values()
                ->all();

            $timeRanges = $group->map(function ($s) {
                return formatTime($s->startTime) . ' - ' . formatTime($s->endTime);
            })->unique()->values()->implode(' / ');

            $curriculum = $curriculums->firstWhere('course_code', $first->title);

            return [
                'id' => $first->id,
                'title' => $first->title,
                'course' => $first->course,
                'section' => $first->section,
                'teacher' => $first->teacher,
                'label' => $first->label,
                'room' => $first->room,
                'daysOfWeek' => $daysOfWeek,
                'timeRanges' => $timeRanges,
                'curriculum' => $curriculum ? [
                    'lec' => $curriculum->lec,
                    'lab' => $curriculum->lab,
                    'units' => $curriculum->units,
                ] : null,
            ];
        })->values();

        return response()->json($formattedSchedules);
    }


    public function getSubjectsScheduled(Request $request)
    {
        $semester = $request->input('period');
        $departmentId = $request->input('department_id');

        if (!$semester) {
            return response()->json(['error' => 'Period is required'], 400);
        }

        $department = Department::find($departmentId);
        if (!$department) {
            return response()->json(['error' => 'Department not found'], 404);
        }

        $programCode = $department->program_code;

        // $latestYear = Curriculums::where('program_code', $programCode)
        //     ->where('period', $semester)
        //     ->max('curriculum_year');
        // $latestYear = CourseScheduling::max('year');
        $latestYear = ControlAcademicYear::where('is_active', 1)->max('academic_year');

        if (!$latestYear) {
            return response()->json([
                'schedules' => [],
                'missingSplits' => [],
                'missingSchedules' => [],
            ]);
        }

        $allSubjects = Curriculums::where('program_code', $programCode)
            // ->where('curriculum_year', $latestYear)
            ->where('period', $semester)
            ->get(['course_code', 'level']);

        if ($allSubjects->isEmpty()) {
            return response()->json([
                'schedules' => [],
                'missingSplits' => [],
                'missingSchedules' => [],
            ]);
        }

        $schedules = CourseScheduling::where('year', $latestYear)
            ->where('course', $programCode)
            ->where('semester', $semester)
            ->where('conflict', false)
            ->where('ignoredSplit', false)
            ->get(['id', 'title', 'course', 'year', 'label', 'section', 'color']);

        // Group subjects by base subject and section
        $subjectsWithSplits = [];
        foreach ($schedules as $schedule) {
            // Extract split information from the `label` field
            $splitLabel = $schedule->label; // e.g., "Split 1"
            preg_match('/^(.*?)( Split [A-Z0-9]+)?$/', $schedule->title, $matches);
            $baseSubject = trim($matches[1]); // e.g., "CHE 10"

            $key = $baseSubject . '-' . $schedule->section; // Group by subject and section

            if (!isset($subjectsWithSplits[$key])) {
                $subjectsWithSplits[$key] = [
                    'baseSubject' => $baseSubject,
                    'section' => $schedule->section,
                    'splits' => [],
                ];
            }
            if ($splitLabel) {
                $subjectsWithSplits[$key]['splits'][] = [
                    'splitLabel' => $splitLabel,
                    'section' => $schedule->section,
                ];
            }
        }

        // Check for missing splits dynamically
        $missingSplits = [];
        foreach ($subjectsWithSplits as $key => $data) {
            $baseSubject = $data['baseSubject'];
            $section = $data['section'];
            $splits = $data['splits'];

            // Extract numeric or alphabetic splits
            $numericSplits = [];
            $alphabeticSplits = [];

            foreach ($splits as $split) {
                if (preg_match('/^Split ([0-9]+)$/', $split['splitLabel'], $matches)) {
                    $numericSplits[] = (int)$matches[1];
                } elseif (preg_match('/^Split ([A-Z])$/', $split['splitLabel'], $matches)) {
                    $alphabeticSplits[] = $matches[1];
                }
            }

            // Helper to get the color from $schedules
            $getColor = function ($baseSubject, $section) use ($schedules) {
                $schedule = $schedules->where('title', $baseSubject)->where('section', $section)->first();
                return $schedule?->color ?? '#6366f1'; // fallback if not found
            };

            // Handle numeric splits
            if (!empty($numericSplits)) {
                $maxNumeric = max($numericSplits); // Find the maximum numeric split
                $ignored = $schedules->where('title', $baseSubject)->where('section', $section)->first()?->ignoredSplit ?? false;

                for ($i = 1; $i <= $maxNumeric + 1; $i++) { // Check up to the next split
                    $expectedSplit = "Split $i";
                    if (!in_array($expectedSplit, array_column($splits, 'splitLabel')) && !$ignored) {
                        $missingSplits[] = [
                            'subject' => $baseSubject,
                            'section' => $section,
                            'missingSplit' => $expectedSplit,
                            'color' => $getColor($baseSubject, $section), // <-- add color
                            'year' => $latestYear,
                            'course' => $programCode,
                        ];
                    }
                }
            }

            // Handle alphabetic splits
            if (!empty($alphabeticSplits)) {
                $alphabeticRange = range('A', 'Z');
                $maxAlphabeticIndex = array_search(max($alphabeticSplits), $alphabeticRange); // Find the max alphabetic split
                $ignored = $schedules->where('title', $baseSubject)->where('section', $section)->first()?->ignoredSplit ?? false;

                for ($i = 0; $i <= $maxAlphabeticIndex + 1; $i++) { // Check up to the next split
                    $expectedSplit = "Split " . $alphabeticRange[$i];
                    if (!in_array($expectedSplit, array_column($splits, 'splitLabel')) && !$ignored) {
                        $missingSplits[] = [
                            'subject' => $baseSubject,
                            'section' => $section,
                            'missingSplit' => $expectedSplit,
                            'color' => $getColor($baseSubject, $section), // <-- add color
                            'year' => $latestYear,
                            'course' => $programCode,
                        ];
                    }
                }
            }
        }

        // Identify missing schedules
        $scheduledSubjects = $schedules->pluck('title')->toArray(); // List of scheduled subjects
        $missingSchedules = [];
        foreach ($allSubjects as $subject) {
            if (!in_array($subject->course_code, $scheduledSubjects)) {
                $missingSchedules[] = [
                    'course_code' => $subject->course_code,
                    'level' => $subject->level,
                ];
            }
        }

        return response()->json([
            'schedules' => $schedules,
            'missingSplits' => $missingSplits,
            'missingSchedules' => $missingSchedules,
        ]);
    }

    public function ignoreMissingSplits(Request $request)
    {
        $id = $request->input('id');

        $schedule = CourseScheduling::find($id);
        if (!$schedule) {
            return response()->json(['error' => 'Schedule not found'], 404);
        }

        CourseScheduling::where('title', $schedule->title)
            ->where('section', $schedule->section)
            ->update(['ignoredSplit' => true]);

        return response()->json(['message' => 'All splits for the subject have been ignored successfully.']);
    }

    public function getInstructors()
    {
        $instructors = User::all();
        return response()->json($instructors);
    }

    public function getYearLevels()
    {
        $year_levels = ControlLevel::all();
        return response()->json($year_levels);
    }
}
