<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Curriculum\Curriculums;
use App\Models\MaintenanceManagement\ControlAcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Faculty\Department;
use App\Models\User;
use App\Models\Curriculum\CourseScheduling;

class FacultyScheduleController extends Controller
{
    public function index(Request $request)
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Faculty Loading'],
            ['title' => 'Faculty Schedule', 'link' => route('faculty_schedule.index')],
        ];

        $dean = User::where('is_active', 1)
            ->where('is_dean', 1)
            ->first();
        $deanName = $dean ? $dean->name : "No Dean Found";

        // dd([
        //     'breadcrumbs' => $breadcrumbs,
        //     'deanName' => $deanName,
        // ]);
        
        return Inertia::render('FacultyLoading/FacultySchedule', [
            'breadcrumbs' => $breadcrumbs,
            'deanName' => $deanName,
        ]);
    }

    public function getActiveDepartments()
    {
        $departments = Department::active()->get();
        return response()->json($departments);
    }

    public function getTeachersByDepartment($departmentId)
    {
        $teachers = User::where('department_id', $departmentId)
            ->where('is_active', 1)
            ->with('position')
            ->where('role', '!=', 'super-admin')
            ->get(['id', 'name', 'profile_picture', 'position_id']);

        // Transform the profile_picture path if needed
        $teachers->transform(function ($teacher) {
            if ($teacher->profile_picture && !filter_var($teacher->profile_picture, FILTER_VALIDATE_URL)) {
                // If the profile picture is not a complete URL
                if (!str_starts_with($teacher->profile_picture, '/')) {
                    $teacher->profile_picture = '/storage/' . $teacher->profile_picture;
                }
            }
            return $teacher;
        });

        return response()->json($teachers);
    }

    
    //this is get academic_year
    public function getCurriculumYear(Request $request)
    {
        // $curriculum_year = Curriculums::where('program_code', $request->program_code)->get();
        // $curriculum_years = $curriculum_year->pluck('curriculum_year')->toArray();

        // return response()->json($curriculum_years);
        $academicYears = ControlAcademicYear::where('is_active', true)
            ->orderBy('academic_year', 'desc')
            ->get()
            ->pluck('academic_year')
            ->toArray();

        return response()->json($academicYears);
    }

    public function getTeacherSchedules(Request $request)
    {
        $request->validate([
            'teacher_id' => 'required|numeric',
            'year' => 'required|string',
            'semester' => 'required|string'
        ]);

        $teacher = User::find($request->teacher_id);

        if (!$teacher) {
            return response()->json([]);
        }

        $schedules = CourseScheduling::where('teacher', $teacher->name)
            ->where('year', $request->year)
            ->where('semester', $request->semester)
            ->get();

        if ($schedules->isEmpty()) {
            return response()->json([]);
        }

        $curriculums = Curriculums::where([
            ['curriculum_year', $request->year],
            ['period', $request->semester]
        ])->select('course_name as SubjectName', 'lec', 'lab', 'units')->get();

        $curriculumData = $curriculums->keyBy('SubjectName');

        $schedules->transform(function ($schedule) use ($curriculumData) {
            $courseName = $schedule->SubjectName;

            if (isset($curriculumData[$courseName])) {
                $schedule->lec = $curriculumData[$courseName]->lec;
                $schedule->lab = $curriculumData[$courseName]->lab;
                $schedule->units = $curriculumData[$courseName]->units;
            } else {
                $schedule->lec = 0;
                $schedule->lab = 0;
                $schedule->units = 0;
            }

            return $schedule;
        });

        return response()->json($schedules);
    }
}
