<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Http\Resources\Curriculum\ControlSectionResource;
use App\Http\Resources\Curriculum\CourseOfferingsResource;
use App\Http\Resources\Faculty\DepartmentResource;
use App\Http\Resources\Maintenance\ControlLevelResource;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\Curriculum\ControlSection;
use App\Models\Curriculum\CourseOfferings;
use App\Models\Curriculum\CourseScheduling; // Add this import
use App\Models\Curriculum\Curriculums;
use App\Models\Faculty\Department;
use App\Models\MaintenanceManagement\ControlLevel;
use App\Models\MaintenanceManagement\ControlPeriod;
use App\Models\MaintenanceManagement\Rooms;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CourseSchedulingController extends Controller
{
    private function generateReadableColor()
    {
        // Generate darker colors for better contrast with white text
        $hue = mt_rand(0, 360);
        $saturation = mt_rand(60, 80);
        $lightness = mt_rand(25, 45); // Keeping lightness lower for better contrast

        // Convert HSL to RGB
        $h = $hue / 360;
        $s = $saturation / 100;
        $l = $lightness / 100;

        if ($s == 0) {
            $r = $g = $b = $l;
        } else {
            $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
            $p = 2 * $l - $q;

            $r = $this->hue2rgb($p, $q, $h + 1 / 3);
            $g = $this->hue2rgb($p, $q, $h);
            $b = $this->hue2rgb($p, $q, $h - 1 / 3);
        }

        // Convert RGB to hex
        $hex = sprintf("#%02x%02x%02x", round($r * 255), round($g * 255), round($b * 255));
        return $hex;
    }

    private function hue2rgb($p, $q, $t)
    {
        if ($t < 0) $t += 1;
        if ($t > 1) $t -= 1;
        if ($t < 1 / 6) return $p + ($q - $p) * 6 * $t;
        if ($t < 1 / 2) return $q;
        if ($t < 2 / 3) return $p + ($q - $p) * (2 / 3 - $t) * 6;
        return $p;
    }

    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Curriculum Management'],
            ['title' => 'Course Scheduling', 'link' => route('course_scheduling.index')],
        ];

        $departments = DepartmentResource::collection(Department::where('is_active', 1)->get());
        $levels = ControlLevelResource::collection(ControlLevel::where('is_active', 1)->get());
        $periods = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());

        return Inertia::render('CourseScheduling/Index', [
            'breadcrumbs' => $breadcrumbs,
            'departments' => $departments,
            'level_name' => $levels,
            'period_name' => $periods,
        ]);
    }

    //getCourses from Curriculums
    public function getCoursesOffered(Request $request)
    {
        $validatedData = $request->validate([
            'program_code' => 'required|string',
            'level' => 'required|string',
            'curriculum_year' => 'required|string',
            'period' => 'required|string',
            'section_name' => 'required|string',
        ]);

        Log::info('Fetching courses with params:', $validatedData);

        $courses_to_schedule = Curriculums::where('program_code', $validatedData['program_code'])
            ->where('level', $validatedData['level'])
            ->where('curriculum_year', $validatedData['curriculum_year'])
            ->where('period', $validatedData['period'])
            ->select('id', 'course_code as title', 'course_name as SubjectName', 'lec', 'lab', 'units')
            ->get()
            ->map(function ($curriculum) {
                $data = [
                    'id' => (string) $curriculum->id,
                    'title' => $curriculum->title,
                    'SubjectName' => $curriculum->SubjectName,
                    'lec' => (int)$curriculum->lec,  // Ensure these are cast to integers
                    'lab' => (int)$curriculum->lab,
                    'unit' => (int)$curriculum->units, // Changed from units to unit to match frontend
                    'color' => $this->generateReadableColor()
                ];
                Log::info('Mapped course data:', $data);
                return $data;
            });

        return response()->json($courses_to_schedule);
    }

    //getCoursesOffered from Course Offered Table
    // public function getCoursesOffered(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'program_code' => 'required|string',
    //         'level' => 'required|string',
    //         'curriculum_year' => 'required|string',
    //         'period' => 'required|string',
    //         'section_name' => 'required|string',
    //     ]);

    //     $courses_to_schedule = CourseOfferings::with(['curriculums:id,course_code as title,course_name,lec,lab,units'])
    //         ->whereHas('curriculums', function ($query) use ($validatedData) {
    //             $query->where('program_code', $validatedData['program_code'])
    //                 ->where('level', $validatedData['level'])
    //                 ->where('curriculum_year', $validatedData['curriculum_year'])
    //                 ->where('period', $validatedData['period']);
    //         })
    //         ->where('section_name', $validatedData['section_name'])
    //         ->where('level', $validatedData['level'])
    //         ->select('id', 'course_code as title', 'course_name as SubjectName', 'curriculums_id')
    //         ->get()
    //         ->map(function ($courseOffering) {
    //             return [
    //                 'id' => (string) $courseOffering->id,
    //                 'title' => $courseOffering->title,
    //                 'SubjectName' => $courseOffering->SubjectName,
    //                 // detoy la nayunam nu ada pay kayat mo alaen ijay nga data ijay curriculums
    //                 'curriculum' => [
    //                     'lec' => $courseOffering->curriculums->lec,
    //                     'lab' => $courseOffering->curriculums->lab,
    //                     'units' => $courseOffering->curriculums->units,
    //                 ],
    //                 'color' => $this->generateReadableColor()
    //             ];
    //         });

    //     return response()->json($courses_to_schedule);
    // }

    // public function getInstructors(Request $request) {}


    /**
     * Save a schedule to the database
     */
    public function getSchedules(Request $request)
    {
        try {
            $query = CourseScheduling::query();

            // Add filters based on request parameters
            if ($request->has('year')) {
                $query->where('year', $request->year);
            }

            if ($request->has('semester')) {
                $query->where('semester', $request->semester);
            }

            if ($request->has('course')) {
                $query->where('course', $request->course);
            }

            if ($request->has('section')) {
                $query->where('section', $request->section);
            }

            // Add filter for room if provided
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

    /**
     * Delete a schedule from the database
     */
    public function delete($id)
    {
        try {
            Log::info('Schedule delete request for ID: ' . $id);

            // Find the schedule and get its room before deletion
            $schedule = CourseScheduling::findOrFail($id);
            $room = $schedule->room;
            $year = $schedule->year;
            $semester = $schedule->semester;

            // Delete the schedule
            $schedule->delete();

            // Resolve conflicts for remaining schedules in the room
            $this->updateAllConflicts($room, $year, $semester);

            Log::info('Schedule deleted successfully:', ['id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Schedule deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting schedule: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    // get rooms with availability status
    public function getRooms(Request $request)
    {
        try {
            $baseQuery = Rooms::where('is_active', 1)
                ->where('room_type', '!=', 'Faculty Room');

            // If course is provided, filter by department priority
            if ($request->has('course')) {
                $course = $request->course;
                $baseQuery->where(function ($query) use ($course) {
                    $query->whereNull('department_priority')
                          ->orWhere('department_priority', '')
                          ->orWhereJsonContains('department_priority', $course);
                });
            }

            $rooms = $baseQuery->get(['room_number', 'room_type', 'department_priority']);

            if (!$request->has(['selectedDays', 'startTime', 'endTime', 'year', 'semester'])) {
                return response()->json($rooms);
            }

            $validated = $request->validate([
                'selectedDays' => 'required|array',
                'startTime' => 'required|string',
                'endTime' => 'required|string',
                'year' => 'required|string',
                'semester' => 'required|string'
            ]);

            $startMinutes = $this->timeToMinutes($validated['startTime']);
            $endMinutes = $this->timeToMinutes($validated['endTime']);

            $roomNumbers = $rooms->pluck('room_number')->toArray();
            
            $existingSchedules = CourseScheduling::where('year', $validated['year'])
                ->where('semester', $validated['semester'])
                ->whereIn('room', $roomNumbers)
                ->get();

            $schedulesByRoom = $existingSchedules->groupBy('room');

            $roomAvailability = [];
            foreach ($rooms as $room) {
                $hasConflict = false;
                $roomNumber = $room->room_number;
                if ($schedulesByRoom->has($roomNumber)) {
                    $roomSchedules = $schedulesByRoom->get($roomNumber);
                    foreach ($roomSchedules as $schedule) {
                        $scheduleDays = $this->parseDaysOfWeek($schedule->daysOfWeek);
                        if ($this->hasDayOverlap($validated['selectedDays'], $scheduleDays)) {
                            $existingStart = $this->timeToMinutes($schedule->startTime);
                            $existingEnd = $this->timeToMinutes($schedule->endTime);
                            if ($this->hasTimeOverlap($startMinutes, $endMinutes, $existingStart, $existingEnd)) {
                                $hasConflict = true;
                                break;
                            }
                        }
                    }
                }
                $roomAvailability[] = [
                    'roomNumber' => $roomNumber,
                    'isAvailable' => !$hasConflict,
                    'roomType' => $room->room_type,
                    'departmentPriority' => $room->department_priority,
                ];
            }

            return response()->json($roomAvailability);
        } catch (\Exception $e) {
            Log::error('Error checking room availability: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    ////////////// new
    public function saveSchedule(Request $request)
    {
        try {
            Log::info('Schedule save request data:', $request->all());

            $validated = $request->validate([
                'id' => 'required|string',
                'title' => 'required|string',
                'SubjectName' => 'required|string',
                'startTime' => 'required|string',
                'endTime' => 'required|string',
                'daysOfWeek' => 'required|array',
                'daysOfWeek.*' => 'required|integer|min:0|max:6',
                'color' => 'nullable|string',
                'label' => 'nullable|string',
                'teacher' => 'required|string',
                'room' => 'required|string',
                'section' => 'required|string',
                'course' => 'required|string',
                'year' => 'required',
                'semester' => 'required|string',
            ]);

            DB::beginTransaction();
            
            // Create the first schedule with the first selected day
            $firstSchedule = new CourseScheduling([
                'id' => $validated['id'],
                'title' => $validated['title'],
                'SubjectName' => $validated['SubjectName'],
                'startTime' => $validated['startTime'],
                'endTime' => $validated['endTime'],
                'daysOfWeek' => json_encode([$validated['daysOfWeek'][0]]),
                'color' => $validated['color'],
                'label' => $validated['label'],
                'teacher' => $validated['teacher'],
                'room' => $validated['room'],
                'section' => $validated['section'],
                'course' => $validated['course'],
                'year' => (string) $validated['year'],
                'semester' => $validated['semester'],
                'conflict' => false,
            ]);
            
            $firstSchedule->save();
            $savedScheduleIds = [$firstSchedule->id];

            // Create additional schedules for other days if any
            for ($i = 1; $i < count($validated['daysOfWeek']); $i++) {
                $additionalSchedule = new CourseScheduling([
                    'id' => uniqid('sch_') . '_' . time() . '_' . $i,
                    'title' => $validated['title'],
                    'SubjectName' => $validated['SubjectName'],
                    'startTime' => $validated['startTime'],
                    'endTime' => $validated['endTime'],
                    'daysOfWeek' => json_encode([$validated['daysOfWeek'][$i]]),
                    'color' => $validated['color'],
                    'label' => $validated['label'],
                    'teacher' => $validated['teacher'],
                    'room' => $validated['room'],
                    'section' => $validated['section'],
                    'course' => $validated['course'],
                    'year' => (string) $validated['year'],
                    'semester' => $validated['semester'],
                    'conflict' => false,
                ]);
                $additionalSchedule->save();
                $savedScheduleIds[] = $additionalSchedule->id;
            }

            // Update conflicts for all schedules in the room
            $this->updateAllConflicts($validated['room'], $validated['year'], $validated['semester']);

            // Get all updated schedules to return
            $updatedSchedules = CourseScheduling::whereIn('id', $savedScheduleIds)->get();

            DB::commit();

            Log::info('Schedules created successfully:', [
                'main_id' => $firstSchedule->id,
                'all_ids' => $savedScheduleIds
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Schedules saved successfully',
                'schedules' => $updatedSchedules
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving schedule: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save schedule: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'SubjectName' => 'required|string',
            'teacher' => 'required|string',
            'room' => 'required|string',
            'startTime' => 'required',
            'endTime' => 'required',
            'daysOfWeek' => 'required|json',
            'section' => 'required|string',
            'course' => 'required|string',
            'year' => 'required',
            'semester' => 'required',
            'label' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $schedule = new CourseScheduling();
        $schedule->fill($data);
        $schedule->id = uniqid('sch_') . '_' . time();
        $schedule->conflict = false;
        $schedule->save();

        // Update conflicts for the room after saving
        $this->updateAllConflicts($data['room'], $data['year'], $data['semester']);

        return response()->json(['message' => 'Schedule created successfully', 'id' => $schedule->id]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'SubjectName' => 'required|string',
            'teacher' => 'required|string',
            'room' => 'required|string',
            'startTime' => 'required',
            'endTime' => 'required',
            'daysOfWeek' => 'required|json',
            'section' => 'required|string',
            'course' => 'required|string',
            'year' => 'required',
            'semester' => 'required',
            'label' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $schedule = CourseScheduling::findOrFail($id);
        $schedule->update($data);

        // Update conflicts for the room after updating
        $this->updateAllConflicts($data['room'], $data['year'], $data['semester']);

        return response()->json(['message' => 'Schedule updated successfully']);
    }

    /**
     * Update conflicts for all schedules in the same room, year, and semester.
     */
    public function updateAllConflicts($room, $year, $semester)
    {
        try {
            // Get all schedules in the specified room
            $schedules = CourseScheduling::where('room', $room)
                ->where('year', (string) $year)
                ->where('semester', $semester)
                ->get();

            // Reset conflicts for all schedules in this room
            foreach ($schedules as $schedule) {
                $schedule->conflict = false;
                $schedule->save();
            }

            // Check for new conflicts
            foreach ($schedules as $schedule1) {
                foreach ($schedules as $schedule2) {
                    if ($schedule1->id === $schedule2->id) continue;

                    $days1 = $this->parseDaysOfWeek($schedule1->daysOfWeek);
                    $days2 = $this->parseDaysOfWeek($schedule2->daysOfWeek);

                    if ($this->hasDayOverlap($days1, $days2)) {
                        $start1 = $this->timeToMinutes($schedule1->startTime);
                        $end1 = $this->timeToMinutes($schedule1->endTime);
                        $start2 = $this->timeToMinutes($schedule2->startTime);
                        $end2 = $this->timeToMinutes($schedule2->endTime);

                        if ($this->hasTimeOverlap($start1, $end1, $start2, $end2)) {
                            $schedule1->conflict = true;
                            $schedule2->conflict = true;
                            $schedule1->save();
                            $schedule2->save();
                        }
                    }
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error in updateAllConflicts: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Helper method to parse daysOfWeek from string or array.
     */
    private function parseDaysOfWeek($daysOfWeek)
    {
        if (is_string($daysOfWeek)) {
            try {
                return json_decode($daysOfWeek, true) ?: [];
            } catch (\Exception $e) {
                Log::error("Error parsing daysOfWeek: " . $e->getMessage());
                return [];
            }
        }
        return is_array($daysOfWeek) ? $daysOfWeek : [];
    }

    /**
     * Helper method to check for overlapping days.
     */
    private function hasDayOverlap(array $days1, array $days2)
    {
        return !empty(array_intersect($days1, $days2));
    }

    /**
     * Helper method to check for overlapping times.
     */
    private function hasTimeOverlap($startMinutes1, $endMinutes1, $startMinutes2, $endMinutes2)
    {
        return ($startMinutes1 < $endMinutes2 && $endMinutes1 > $startMinutes2);
    }

    /**
     * Helper to convert time string to minutes.
     */
    private function timeToMinutes($timeStr)
    {
        if (preg_match('/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/', $timeStr, $matches)) {
            $hours = (int)$matches[1];
            $minutes = (int)$matches[2];
            return $hours * 60 + $minutes;
        }
        return 0;
    }

    /**
     * Check for room conflicts before duplicating schedule
     */
    private function checkForRoomConflicts($room, $daysOfWeek, $startTime, $endTime, $year, $semester)
    {
        $days = $this->parseDaysOfWeek($daysOfWeek);
        $startMinutes = $this->timeToMinutes($startTime);
        $endMinutes = $this->timeToMinutes($endTime);

        $existingSchedules = CourseScheduling::where('room', $room)
            ->where('year', $year)
            ->where('semester', $semester)
            ->get();

        foreach ($existingSchedules as $existing) {
            $existingDays = $this->parseDaysOfWeek($existing->daysOfWeek);
            
            if ($this->hasDayOverlap($days, $existingDays)) {
                $existingStart = $this->timeToMinutes($existing->startTime);
                $existingEnd = $this->timeToMinutes($existing->endTime);
                
                if ($this->hasTimeOverlap($startMinutes, $endMinutes, $existingStart, $existingEnd)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Update conflict status for existing events
     */
    private function updateConflictingEvents($room, $year, $semester, $excludeId = null)
    {
        $schedules = CourseScheduling::where('room', $room)
            ->where('year', $year)
            ->where('semester', $semester)
            ->when($excludeId, function ($query) use ($excludeId) {
                return $query->where('id', '!=', $excludeId);
            })
            ->get();

        foreach ($schedules as $schedule) {
            // Reset conflict status before checking
            $schedule->conflict = false;
            
            // Check against all other schedules
            $hasConflict = false;
            foreach ($schedules as $otherSchedule) {
                if ($schedule->id !== $otherSchedule->id) {
                    // Since we now store single days per record, we can directly compare the days
                    $day1 = json_decode($schedule->daysOfWeek)[0];
                    $day2 = json_decode($otherSchedule->daysOfWeek)[0];

                    if ($day1 === $day2) {
                        // Only check time overlap if the days match
                        $start1 = $this->timeToMinutes($schedule->startTime);
                        $end1 = $this->timeToMinutes($schedule->endTime);
                        $start2 = $this->timeToMinutes($otherSchedule->startTime);
                        $end2 = $this->timeToMinutes($otherSchedule->endTime);
                        
                        if ($this->hasTimeOverlap($start1, $end1, $start2, $end2)) {
                            $hasConflict = true;
                            $otherSchedule->conflict = true;
                            $otherSchedule->save();
                            break;
                        }
                    }
                }
            }
            
            $schedule->conflict = $hasConflict;
            $schedule->save();
        }
    }

    private function checkForSpecificConflict($schedule1, $schedule2)
    {
        $days1 = $this->parseDaysOfWeek($schedule1->daysOfWeek);
        $days2 = $this->parseDaysOfWeek($schedule2->daysOfWeek);
        
        if ($this->hasDayOverlap($days1, $days2)) {
            $start1 = $this->timeToMinutes($schedule1->startTime);
            $end1 = $this->timeToMinutes($schedule1->endTime);
            $start2 = $this->timeToMinutes($schedule2->startTime);
            $end2 = $this->timeToMinutes($schedule2->endTime);
            
            return $this->hasTimeOverlap($start1, $end1, $start2, $end2);
        }
        
        return false;
    }

    public function duplicateSchedule(Request $request)
    {
        try {
            Log::info('Attempting to duplicate schedule with data:', $request->all());
            
            $validated = $request->validate([
                'oldYear' => 'required|string',
                'newYear' => 'required|string',
                'semester' => 'required|string', 
                'course' => 'required|string',
                'section' => 'required|string'
            ]);

            $oldSchedules = CourseScheduling::where([
                'year' => strval($validated['oldYear']),
                'semester' => $validated['semester'],
                'course' => $validated['course'],
                'section' => $validated['section']
            ])->get();

            if ($oldSchedules->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => "No schedules found for year {$validated['oldYear']}"
                ], 404);
            }

            DB::beginTransaction();
            try {
                $duplicatedSchedules = [];
                $tempSchedules = collect([]);

                // First pass: Create all new schedules
                foreach ($oldSchedules as $schedule) {
                    $newSchedule = new CourseScheduling();
                    $newSchedule->fill($schedule->toArray());
                    $newSchedule->id = uniqid('sch_') . '_' . time();
                    $newSchedule->year = strval($validated['newYear']);
                    $newSchedule->conflict = false; // Initially set to false
                    $newSchedule->save();
                    
                    $duplicatedSchedules[] = $newSchedule->id;
                    $tempSchedules->push($newSchedule);
                }

                // Second pass: Check conflicts for all schedules
                foreach ($tempSchedules as $schedule) {
                    $hasConflict = false;
                    
                    // Check against existing schedules in the target year
                    $existingSchedules = CourseScheduling::where('room', $schedule->room)
                        ->where('year', $validated['newYear'])
                        ->where('semester', $validated['semester'])
                        ->where('id', '!=', $schedule->id)
                        ->get();

                    // Combine existing and newly created schedules for conflict check
                    $allSchedulesToCheck = $existingSchedules->merge($tempSchedules->where('id', '!=', $schedule->id));

                    foreach ($allSchedulesToCheck as $otherSchedule) {
                        if ($this->checkForSpecificConflict($schedule, $otherSchedule)) {
                            $hasConflict = true;
                            $otherSchedule->conflict = true;
                            $otherSchedule->save();
                        }
                    }

                    if ($hasConflict) {
                        $schedule->conflict = true;
                        $schedule->save();
                    }
                }
                
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Schedules duplicated successfully',
                    'count' => count($duplicatedSchedules)
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Transaction error: ' . $e->getMessage());
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Duplication error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate schedules: ' . $e->getMessage()
            ], 500);
        }
    }
}
