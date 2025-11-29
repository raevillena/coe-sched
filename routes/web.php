<?php

use App\Http\Controllers\BackupController;
use App\Http\Controllers\Curriculum\CourseOfferingsController;
use App\Http\Controllers\Curriculum\ControlSectionController;
use App\Http\Controllers\Curriculum\CourseSchedulingController;
use App\Http\Controllers\Maintenance\SectionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\Faculty\PositionController;
use App\Http\Controllers\Faculty\FacultyController;
use App\Http\Controllers\Curriculum\CurriculumController;
use App\Http\Controllers\CustomizePDFController;
use App\Http\Controllers\Dashboard\SuperAdminController;
use App\Http\Controllers\EditNOTAController;
use App\Http\Controllers\Faculty\FacultyScheduleController;
use App\Http\Controllers\Faculty\FacultyWorkloadController;
use App\Http\Controllers\Faculty\RoomScheduleController;
use App\Http\Controllers\Faculty\SearchScheduleController;
use App\Http\Controllers\HelpCenterController;
use App\Http\Controllers\Maintenance\AcademicEntityController;
use App\Http\Controllers\Maintenance\RoomController;
use App\Http\Controllers\Reports\CurriculumsUpdateController;
use App\Http\Controllers\Reports\FacultyReportsController;
use App\Http\Controllers\UserPreferenceController;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ToursController;
use App\Http\Resources\Faculty\DepartmentResource;
use App\Http\Resources\Maintenance\ControlPeriodResource;
use App\Models\DatabaseBackup;
use App\Models\Faculty\Department;
use App\Models\MaintenanceManagement\ControlPeriod;


//Super Admin and Admin Functions
Route::get('/users', [SuperAdminController::class, 'getActiveUsersPercentage'])->name('users.active_percentage');
Route::get('/schedule-conflicts', [SuperAdminController::class, 'getScheduleConflicts'])->name('schedule.conflicts');
Route::get('/periods', [SuperAdminController::class, 'getPeriods'])->name('get.periods');
Route::get('/rooms/utilized-underutilized', [SuperAdminController::class, 'getRoomsScheduleForCurrentYear'])->name("rooms.schedules_data");
Route::get('/users/schedules', [SuperAdminController::class, 'getUserSchedules'])->name('user.schedules');
Route::get('/curriculums', [SuperAdminController::class, 'getCurriculums'])->name('curriculums.all');
Route::get('/subjects-scheduled', [SuperAdminController::class, 'getSubjectsScheduled'])->name("subjects.scheduled");
Route::post('/ignore-missing-splits', [SuperAdminController::class, 'ignoreMissingSplits'])->name('ignore.missing.splits');
Route::get('/get-instructors', [SuperAdminController::class, 'getInstructors'])->name('get_instructors');
Route::get('/get-year-levels', [SuperAdminController::class, 'getYearLevels'])->name('get_year_levels');

//Super-Admin
Route::middleware(['auth', 'verified', 'role:super-admin'])->group(function () {
    // Route::middleware('super-admin')->group(function () {

    //Super Admin
    Route::get('/super-admin/dashboard', function () {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
        ];
        $departments = DepartmentResource::collection(Department::all());
        return Inertia::render('Super-Admin/Dashboard', ['breadcrumbs' => $breadcrumbs, Auth::user(), 'departments' => $departments]);
    })->middleware(['auth', 'verified', 'role:super-admin'])->name('super-admin.dashboard');

    //Tour
    Route::put('/tour', [ToursController::class, 'update'])->name('tour.update');

    //Laravel Default
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Faculty
    Route::resource('faculties', FacultyController::class);
    Route::get('/faculty/create', [FacultyController::class, 'create'])->name('faculty.create');
    Route::post('/faculties/{faculty}/edit', [FacultyController::class, 'update'])->name('faculties.update');
    Route::put('/faculties/{faculty}/active_status', [FacultyController::class, 'setActiveStatus'])->name('faculties.active_status');
    Route::get('/faculties/faculties/in_active', [FacultyController::class, 'getInactiveFaculty'])->name('faculties.index_in_active');
    Route::resource('positions', PositionController::class)->only(['index']);
    Route::get('/api/teachers', [FacultyController::class, 'getTeachers'])->name('faculty.teachers');

    //Faculty Loading
    //Faculty Schedule
    Route::resource('faculty_schedule', FacultyScheduleController::class);
    Route::get('/api/{program_code}', [FacultyScheduleController::class, 'getCurriculumYear'])->name('faculty_loading.get_cy');
    Route::get('/api/departments/active', [FacultyScheduleController::class, 'getActiveDepartments'])->name('departments.active');
    Route::get('/api/departments/{department}/teachers', [FacultyScheduleController::class, 'getTeachersByDepartment'])->name('departments.teachers');
    Route::get('/api/faculty/schedules', [FacultyScheduleController::class, 'getTeacherSchedules'])->name('faculty_schedule.get_schedules');
    Route::get('/api/dean', [FacultyScheduleController::class, 'getDean'])->name('faculty_schedule.get_dean');

    //Search Schedule
    Route::get('search_schedule', [SearchScheduleController::class, 'index'])->name('search_schedule.index');
    Route::get('getSearchedSchedules', [SearchScheduleController::class, 'getSearchedSchedules'])->name('getSearchedSchedules');

    //Room Schedule
    Route::get('room_schedule', [RoomScheduleController::class, 'index'])->name('rooms_schedule.index');
    //get academic year detoy
    Route::get('room_schedule/get_curriculum_year', [RoomScheduleController::class, 'getCurriculumYear'])->name('rooms_schedule.get_curriculum_year');
    Route::get('room_schedule/get_schedules', [RoomScheduleController::class, 'getSchedules'])->name('rooms_schedule.get_schedules');

    //Faculty WorkLoad
    Route::get('faculty_workload', [FacultyWorkloadController::class, 'index'])->name('faculty_workload.index');
    Route::get('faculty_workload/get_schedules', [FacultyWorkloadController::class, 'getSchedules'])->name('faculty_workload.get_schedules');
    Route::get('faculty_workload/get_departments', [FacultyWorkLoadController::class, 'getDepartments'])->name('faculty_workload.get_departments');
    Route::get('faculty_workload/get_instructors', [FacultyWorkloadController::class, 'getInstructors'])->name('faculty_workload.get_instructors');
    Route::post('faculty_workload/update_student_counts', [FacultyWorkloadController::class, 'updateStudentCounts'])->name('faculty_workload.update_student_counts');

    //Curriculum
    Route::resource('curriculum', CurriculumController::class);
    Route::get('curriculums/add_curriculum', [CurriculumController::class, 'add'])->name('curriculum.add');
    Route::post('curriculums/store_curriculum', [CurriculumController::class, 'store'])->name('curriculum.store');
    Route::get('curriculums/{program_code}', [CurriculumController::class, 'view'])->name('curriculum.view');
    Route::get('curriculums/{program_code}/{curriculum_year}', [CurriculumController::class, 'list'])->name('curriculum.list');
    Route::get('curriculums/{program_code}/{curriculum_year}/edit', [CurriculumController::class, 'edit'])->name('curriculum.edit');
    Route::get('curriculums/{program_code}/{curriculum_year}/archived_curriculum', [CurriculumController::class, 'edit_archived'])->name('curriculum.edit_archived');
    Route::post('curriculums/{curriculum}/edit', [CurriculumController::class, 'update'])->name('curriculum.update');
    Route::put('curriculums/{curriculum}/archive', [CurriculumController::class, 'archiveCurriculum'])->name('curriculum.archive');
    Route::get('get_curriculum_years/{program_code}', [CurriculumController::class, 'getCurriculumYear'])->name('view_curriculum.get_cy');
    Route::post('curriculums/duplicate', [CurriculumController::class, 'duplicateCurriculum'])->name('curriculum.duplicate');

    //Course Offerings
    Route::get('course_offerings', [CourseOfferingsController::class, 'index'])->name('course_offerings.index');
    Route::get('course_offerings/{program_code}/view', [CourseOfferingsController::class, 'view'])->name('course_offerings.view');
    Route::post('curriculums/add_course_offering', [CourseOfferingsController::class, 'store'])->name('course_offerings.store');
    Route::delete('course_offerings/{curriculums_id}', [CourseOfferingsController::class, 'destroy'])->name('course_offerings.destroy');

    //Control Select Search Table Component on Course offerings
    Route::get('course_offerings/control_getSections', [ControlSectionController::class, 'getSections'])->name('control.get_sections');
    Route::get('course_offerings/control_getCurriculumYear', [ControlSectionController::class, 'getCurriculumYear'])->name('control.get_cy');
    Route::get('course_offerings/control_getPeriods', [ControlSectionController::class, 'getPeriods'])->name('control.get_periods');
    Route::get('course_offerings/control_getLevels', [ControlSectionController::class, 'getLevels'])->name('control.get_levels');
    Route::get('course_offerings/get_academic_years', [AcademicEntityController::class, 'getAcademicYears'])->name('control.get_academic_years');
    Route::get('course_offerings/control_courses', [ControlSectionController::class, 'getCourses'])->name('control.get_courses');

    //Course Scheduling
    Route::post('course_scheduling/duplicate', [CourseSchedulingController::class, 'duplicateSchedule'])->name('course_scheduling.duplicate');
    Route::get('course_scheduling', [CourseSchedulingController::class, 'index'])->name('course_scheduling.index');
    Route::get('course_scheduling/get_courses_offered', [CourseSchedulingController::class, 'getCoursesOffered'])->name('course_scheduling.get_courses_offered');
    Route::get('course_scheduling/get_rooms', [CourseSchedulingController::class, 'getRooms'])->name('course_scheduling.get_rooms');
    Route::post('course_scheduling/save', [CourseSchedulingController::class, 'store'])->name('course_scheduling.store');
    Route::get('course_scheduling/get_schedules', [CourseSchedulingController::class, 'getSchedules'])->name('course_scheduling.get_schedules');
    Route::put('course_scheduling/update/{id}', [CourseSchedulingController::class, 'update'])->name('course_scheduling.update');
    Route::delete('course_scheduling/delete/{id}', [CourseSchedulingController::class, 'delete'])->name('course_scheduling.delete');

    // Save schedule to database
    Route::post('/course-scheduling/save', [CourseSchedulingController::class, 'saveSchedule'])->middleware(['auth'])->name('course-scheduling.save');

    //Academic Entity Management
    Route::get('academic_entity_management', [AcademicEntityController::class, 'index'])->name('academic_entity_management.index');

    //Department
    Route::post('academic_entity_management/add_department', [AcademicEntityController::class, 'store_department'])->name('departments.store');
    Route::put('academic_entity_management/edit_department/{departments}', [AcademicEntityController::class, 'update_department'])->name('departments.update');
    Route::put('academic_entity_management/active_status/dept/{departments}', [AcademicEntityController::class, 'update_department_active_status'])->name('departments.active_status');
    Route::post('settings/{department}/update-logo', [AcademicEntityController::class, 'update_department_logo'])->name('departments.update_logo');
    //Route::delete('academic_entity_management/delete_department/{departments}', [AcademicEntityController::class, 'delete_department'])->name('departments.delete');

    //Position
    Route::post('academic_entity_management/add_position', [AcademicEntityController::class, 'store_position'])->name('positions.store');
    Route::put('academic_entity_management/edit_position/{positions}', [AcademicEntityController::class, 'update_position'])->name('positions.update');
    Route::put('academic_entity_management/active_status/pos/{positions}', [AcademicEntityController::class, 'update_position_active_status'])->name('positions.active_status');

    //Period
    Route::post('academic_entity_management/add_period', [AcademicEntityController::class, 'store_period'])->name('periods.store');
    Route::put('academic_entity_management/edit_period/{periods}', [AcademicEntityController::class, 'update_period'])->name('periods.update');
    Route::put('academic_entity_management/active_status/period/{periods}', [AcademicEntityController::class, 'update_period_active_status'])->name('periods.active_status');

    //Level
    Route::post('academic_entity_management/add_level', [AcademicEntityController::class, 'store_level'])->name('levels.store');
    Route::put('academic_entity_management/edit_level/{levels}', [AcademicEntityController::class, 'update_level'])->name('levels.update');
    Route::put('academic_entity_management/active_status/level/{levels}', [AcademicEntityController::class, 'update_level_active_status'])->name('levels.active_status');
    
    //Academic Year
    Route::post('academic_entity_management/add_ay', [AcademicEntityController::class, 'store_academic_year'])->name('academic_year.store');
    Route::put('academic_entity_management/edit_ay/{academic_years}', [AcademicEntityController::class, 'update_academic_year'])->name('academic_year.update');
    Route::put('academic_entity_management/active_status/ay/{academic_years}', [AcademicEntityController::class, 'update_ay_active_status'])->name('academic_year.active_status');
    //End of Academic Entity Management

    //Section Management
    Route::get('section_management', [SectionController::class, 'index'])->name('section_management.index');
    Route::get('section_management/{program_code}/{level}/section_name', [SectionController::class, 'getSectionsName'])->name('sections.get');
    Route::post('section_management/add_section', [SectionController::class, 'store_section'])->name('sections.store');
    Route::put('section_management/active_status/section/{id}', [SectionController::class, 'update_section_active_status'])->name('sections.active_status');
    Route::get('section_management/departments/{id}', [SectionController::class, 'getProgramCode'])->name('sections.getProgramCode');

    //Room Management
    Route::get('room_management', [RoomController::class, 'index'])->name('room_management.index');
    //floor plan
    Route::get('room_management/add_floor_plan', [RoomController::class, 'add_floor_plan'])->name('room_management.add_floor_plan');
    Route::post('room_management/check_building_floor', [RoomController::class, 'check_building_floor'])->name('check.building_floor');
    Route::post('room_management/add_floor_plan/store', [RoomController::class, 'store_floor_plan'])->name('floor_plan.store');
    Route::get('room_management/edit_floor_plan', [RoomController::class, 'edit_floor_plan'])->name('room_management.edit_floor_plan');
    Route::post('room_management/edit_floor_plan/edit/{floor_plan}', [RoomController::class, 'update_floor_plan'])->name('floor_plan.update');
    Route::get('room_management/room_details/{building}/{floor}/{room_number}', [RoomController::class, 'getRoomDetails'])->name('room_details.get');
    Route::put('room_management/edit_floor_plan/active_status/{floorplans}', [RoomController::class, 'update_floor_plan_active_status'])->name('floorplans.active_status');
    //floor management
    Route::post('room_management/add_floor', [RoomController::class, 'store_floor'])->name('floors.store');
    Route::put('room_management/edit_floor/{floors}', [RoomController::class, 'update_floor'])->name('floors.update');
    Route::put('room_management/active_status/floor/{floors}', [RoomController::class, 'update_floor_active_status'])->name('floors.active_status');
    //building management    
    Route::post('room_management/add_building', [RoomController::class, 'store_building'])->name('buildings.store');
    Route::put('room_management/edit_building/{buildings}', [RoomController::class, 'update_building'])->name('buildings.update');
    Route::put('room_management/active_status/building/{buildings}', [RoomController::class, 'update_building_active_status'])->name('buildings.active_status');
    //facility management
    Route::get('room_management/manage_facilities', [RoomController::class, 'manage_facilities'])->name('room_management.manage_facilities');

    //Reports - Not yet implemented
    //Faculty Reports
    Route::get('reports/faculty_reports', [FacultyReportsController::class, 'index'])->name('faculty_reports.index');
    //Curriculums Update
    Route::get('reports/curriculums_update', [CurriculumsUpdateController::class, 'index'])->name('curriculums_update.index');

    //Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('settings/update_user/{user}', [SettingsController::class, 'update_user'])->name('settings.update_user');
    Route::post('settings/change_password/{user}', [SettingsController::class, 'update_password'])->name('settings.update_password');

    //Help Center
    Route::get('help_center', [HelpCenterController::class, 'index'])->name('help_center.index');

    //Customize PDF
    Route::get('customize_pdf', [CustomizePDFController::class, 'index'])->name('customize_pdf.index');
    Route::post('customize_pdf/curriculum', [CustomizePDFController::class, 'storeCurriculum'])->name('customize_pdf.store_curriculum');
    // Route::get('customize_pdf/get_curriculum_header_pdf_years', [CustomizePDFController::class, 'getCurriculumHeaderPDFYear'])->name('customize_pdf.get_curriculum_header_cy');
    Route::get('customize_pdf/curriculum_header_images', [CustomizePDFController::class, 'getCurriculumHeaderImages'])->name('get_curriculum_header_images');
    Route::get('customize_pdf/curriculum_footer_images', [CustomizePDFController::class, 'getCurriculumFooterImages'])->name('get_curriculum_footer_images');
    Route::post('customize_pdf/sheader_footer_status', [CustomizePDFController::class, 'updateHeaderFooterStatus'])->name('update_header_footer_status');
    Route::get('customize_pdf/active_header_footer', [CustomizePDFController::class, 'getActiveHeaderFooter'])->name('get_active_header_footer');

    //Edit NOTA 
    Route::get('/edit_nota', [EditNOTAController::class, 'index'])->name('edit_nota.index');
    Route::post('/edit_nota_content', [EditNOTAController::class, 'store'])->name('edit_nota.store');
    Route::get('/show_nota_content', [EditNOTAController::class, 'show'])->name('edit_nota.show');

    // Settings
    Route::post('settings/update-theme', [ProfileController::class, 'update_theme'])->name('settings.update_theme');

    //Email Validation 
    Route::get('check-email', [ProfileController::class, 'check_email'])->name('check_email');

    //Backup
    Route::get('system_maintenance', [BackupController::class, 'index'])->name('database_backup.index');
    Route::post('backup', [BackupController::class, 'backup']);

    Route::get('/download-backup/{path}', function ($path) {
        return response()->download(storage_path("app/backup_database/$path"));
    });

    Route::get('/get-backups', function () {
        return DatabaseBackup::all();
    });

    Route::post('/delete-backup', [BackupController::class, 'deleteBackup'])->name('delete.backup');
    //End of Backup

    //Pinned Calendar
    Route::post('/preferences/pinned-calendar', [UserPreferenceController::class, 'updatePinnedCalendar'])->name('preferences.pinned-calendar.update');
    Route::get('/preferences/pinned-calendar', [UserPreferenceController::class, 'getPinnedCalendar'])->name('preferences.pinned-calendar.get');
});

//Admin
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Admin
    Route::get('/admin/dashboard', function () {
        if (Auth::user()->role === 'super-admin') {
            // Redirect to the super-admin dashboard if the user role is super-admin
            return redirect()->route('super-admin.dashboard');
        }

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
        ];
        $departments = DepartmentResource::collection(Department::all());

        return Inertia::render('Admin/Dashboard', [
            'breadcrumbs' => $breadcrumbs,
            Auth::user(),
            'departments' => $departments,
        ]);
    })->middleware(['auth', 'verified', 'role:admin'])->name('admin.dashboard');

    //Tour
    Route::put('/tour', [ToursController::class, 'update'])->name('tour.update');

    //Laravel Default
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Faculty
    Route::resource('faculties', FacultyController::class);
    Route::get('/faculty/create', [FacultyController::class, 'create'])->name('faculty.create');
    Route::post('/faculties/{faculty}/edit', [FacultyController::class, 'update'])->name('faculties.update');
    Route::put('/faculties/{faculty}/active_status', [FacultyController::class, 'setActiveStatus'])->name('faculties.active_status');
    Route::get('/faculties/faculties/in_active', [FacultyController::class, 'getInactiveFaculty'])->name('faculties.index_in_active');
    Route::resource('positions', PositionController::class)->only(['index']);
    Route::get('/api/teachers', [FacultyController::class, 'getTeachers'])->name('faculty.teachers');
    Route::get('/check-teacher', [FacultyController::class, 'checkTeacher']);
    // Check if room exists in the database before scheduling
    Route::get('/check-room', [RoomController::class, 'checkRoom'])->name('check-room');

    //Faculty Loading
    //Faculty Schedule
    Route::resource('faculty_schedule', FacultyScheduleController::class);
    Route::get('/api/{program_code}', [FacultyScheduleController::class, 'getCurriculumYear'])->name('faculty_loading.get_cy');
    Route::get('/api/departments/active', [FacultyScheduleController::class, 'getActiveDepartments'])->name('departments.active');
    Route::get('/api/departments/{department}/teachers', [FacultyScheduleController::class, 'getTeachersByDepartment'])->name('departments.teachers');
    Route::get('/api/faculty/schedules', [FacultyScheduleController::class, 'getTeacherSchedules'])->name('faculty_schedule.get_schedules');
    Route::get('/api/dean', [FacultyScheduleController::class, 'getDean'])->name('faculty_schedule.get_dean');

    //Search Schedule
    Route::get('search_schedule', [SearchScheduleController::class, 'index'])->name('search_schedule.index');
    Route::get('getSearchedSchedules', [SearchScheduleController::class, 'getSearchedSchedules'])->name('getSearchedSchedules');

    //Room Schedule
    Route::get('room_schedule', [RoomScheduleController::class, 'index'])->name('rooms_schedule.index');
    Route::get('room_schedule/get_curriculum_year', [RoomScheduleController::class, 'getCurriculumYear'])->name('rooms_schedule.get_curriculum_year');
    Route::get('room_schedule/get_schedules', [RoomScheduleController::class, 'getSchedules'])->name('rooms_schedule.get_schedules');

    //Faculty WorkLoad
    Route::get('faculty_workload', [FacultyWorkloadController::class, 'index'])->name('faculty_workload.index');
    Route::get('faculty_workload/get_schedules', [FacultyWorkloadController::class, 'getSchedules'])->name('faculty_workload.get_schedules');
    Route::get('faculty_workload/get_departments', [FacultyWorkLoadController::class, 'getDepartments'])->name('faculty_workload.get_departments');
    Route::get('faculty_workload/get_instructors', [FacultyWorkloadController::class, 'getInstructors'])->name('faculty_workload.get_instructors');
    Route::post('faculty_workload/update_student_counts', [FacultyWorkloadController::class, 'updateStudentCounts'])->name('faculty_workload.update_student_counts');

    //Curriculum
    Route::resource('curriculum', CurriculumController::class);
    Route::get('curriculums/add_curriculum', [CurriculumController::class, 'add'])->name('curriculum.add');
    Route::post('curriculums/store_curriculum', [CurriculumController::class, 'store'])->name('curriculum.store');
    Route::get('curriculums/{program_code}', [CurriculumController::class, 'view'])->name('curriculum.view');
    Route::get('curriculums/{program_code}/{curriculum_year}', [CurriculumController::class, 'list'])->name('curriculum.list');
    Route::get('curriculums/{program_code}/{curriculum_year}/edit', [CurriculumController::class, 'edit'])->name('curriculum.edit');
    Route::get('curriculums/{program_code}/{curriculum_year}/archived_curriculum', [CurriculumController::class, 'edit_archived'])->name('curriculum.edit_archived');
    Route::post('curriculums/{curriculum}/edit', [CurriculumController::class, 'update'])->name('curriculum.update');
    Route::put('curriculums/{curriculum}/archive', [CurriculumController::class, 'archiveCurriculum'])->name('curriculum.archive');
    Route::get('get_curriculum_years/{program_code}', [CurriculumController::class, 'getCurriculumYear'])->name('view_curriculum.get_cy');
    Route::post('curriculums/duplicate', [CurriculumController::class, 'duplicateCurriculum'])->name('curriculum.duplicate');

    //Course Offerings
    Route::get('course_offerings', [CourseOfferingsController::class, 'index'])->name('course_offerings.index');
    Route::get('course_offerings/{program_code}/view', [CourseOfferingsController::class, 'view'])->name('course_offerings.view');
    Route::post('curriculums/add_course_offering', [CourseOfferingsController::class, 'store'])->name('course_offerings.store');
    Route::delete('course_offerings/{curriculums_id}', [CourseOfferingsController::class, 'destroy'])->name('course_offerings.destroy');

    //Control Select Search Table Component on Course offerings
    Route::get('course_offerings/control_getSections', [ControlSectionController::class, 'getSections'])->name('control.get_sections');
    Route::get('course_offerings/control_getCurriculumYear', [ControlSectionController::class, 'getCurriculumYear'])->name('control.get_cy');
    Route::get('course_offerings/control_getPeriods', [ControlSectionController::class, 'getPeriods'])->name('control.get_periods');
    Route::get('course_offerings/control_getLevels', [ControlSectionController::class, 'getLevels'])->name('control.get_levels');
    Route::get('course_offerings/get_academic_years', [AcademicEntityController::class, 'getAcademicYears'])->name('control.get_academic_years');
    Route::get('course_offerings/control_courses', [ControlSectionController::class, 'getCourses'])->name('control.get_courses');

    //Course Scheduling
    Route::post('course_scheduling/duplicate', [CourseSchedulingController::class, 'duplicateSchedule'])->name('course_scheduling.duplicate');
    Route::get('course_scheduling', [CourseSchedulingController::class, 'index'])->name('course_scheduling.index');
    Route::get('course_scheduling/get_courses_offered', [CourseSchedulingController::class, 'getCoursesOffered'])->name('course_scheduling.get_courses_offered');
    Route::get('course_scheduling/get_rooms', [CourseSchedulingController::class, 'getRooms'])->name('course_scheduling.get_rooms');
    Route::post('course_scheduling/save', [CourseSchedulingController::class, 'store'])->name('course_scheduling.store');
    Route::get('course_scheduling/get_schedules', [CourseSchedulingController::class, 'getSchedules'])->name('course_scheduling.get_schedules');
    Route::put('course_scheduling/update/{id}', [CourseSchedulingController::class, 'update'])->name('course_scheduling.update');
    Route::delete('course_scheduling/delete/{id}', [CourseSchedulingController::class, 'delete'])->name('course_scheduling.delete');

    // Save schedule to database
    Route::post('/course-scheduling/save', [CourseSchedulingController::class, 'saveSchedule'])->middleware(['auth'])->name('course-scheduling.save');

    //Academic Entity Management
    Route::get('academic_entity_management', [AcademicEntityController::class, 'index'])->name('academic_entity_management.index');

    //Department
    Route::post('academic_entity_management/add_department', [AcademicEntityController::class, 'store_department'])->name('departments.store');
    Route::put('academic_entity_management/edit_department/{departments}', [AcademicEntityController::class, 'update_department'])->name('departments.update');
    Route::put('academic_entity_management/active_status/dept/{departments}', [AcademicEntityController::class, 'update_department_active_status'])->name('departments.active_status');
    Route::post('settings/{department}/update-logo', [AcademicEntityController::class, 'update_department_logo'])->name('departments.update_logo');
    //Route::delete('academic_entity_management/delete_department/{departments}', [AcademicEntityController::class, 'delete_department'])->name('departments.delete');

    //Position
    Route::post('academic_entity_management/add_position', [AcademicEntityController::class, 'store_position'])->name('positions.store');
    Route::put('academic_entity_management/edit_position/{positions}', [AcademicEntityController::class, 'update_position'])->name('positions.update');
    Route::put('academic_entity_management/active_status/pos/{positions}', [AcademicEntityController::class, 'update_position_active_status'])->name('positions.active_status');

    //Period
    Route::post('academic_entity_management/add_period', [AcademicEntityController::class, 'store_period'])->name('periods.store');
    Route::put('academic_entity_management/edit_period/{periods}', [AcademicEntityController::class, 'update_period'])->name('periods.update');
    Route::put('academic_entity_management/active_status/period/{periods}', [AcademicEntityController::class, 'update_period_active_status'])->name('periods.active_status');

    //Level
    Route::post('academic_entity_management/add_level', [AcademicEntityController::class, 'store_level'])->name('levels.store');
    Route::put('academic_entity_management/edit_level/{levels}', [AcademicEntityController::class, 'update_level'])->name('levels.update');
    Route::put('academic_entity_management/active_status/level/{levels}', [AcademicEntityController::class, 'update_level_active_status'])->name('levels.active_status');
    
    //Academic Year
    Route::post('academic_entity_management/add_ay', [AcademicEntityController::class, 'store_academic_year'])->name('academic_year.store');
    Route::put('academic_entity_management/edit_ay/{academic_years}', [AcademicEntityController::class, 'update_academic_year'])->name('academic_year.update');
    Route::put('academic_entity_management/active_status/ay/{academic_years}', [AcademicEntityController::class, 'update_ay_active_status'])->name('academic_year.active_status');
    //End of Academic Entity Management

    //Section Management
    Route::get('section_management', [SectionController::class, 'index'])->name('section_management.index');
    Route::get('section_management/{program_code}/{level}/section_name', [SectionController::class, 'getSectionsName'])->name('sections.get');
    Route::post('section_management/add_section', [SectionController::class, 'store_section'])->name('sections.store');
    Route::put('section_management/active_status/section/{id}', [SectionController::class, 'update_section_active_status'])->name('sections.active_status');
    Route::get('section_management/departments/{id}', [SectionController::class, 'getProgramCode'])->name('sections.getProgramCode');

    //Room Management
    Route::get('room_management', [RoomController::class, 'index'])->name('room_management.index');
    //floor plan
    Route::get('room_management/add_floor_plan', [RoomController::class, 'add_floor_plan'])->name('room_management.add_floor_plan');
    Route::post('room_management/check_building_floor', [RoomController::class, 'check_building_floor'])->name('check.building_floor');
    Route::post('room_management/add_floor_plan/store', [RoomController::class, 'store_floor_plan'])->name('floor_plan.store');
    Route::get('room_management/edit_floor_plan', [RoomController::class, 'edit_floor_plan'])->name('room_management.edit_floor_plan');
    Route::post('room_management/edit_floor_plan/edit/{floor_plan}', [RoomController::class, 'update_floor_plan'])->name('floor_plan.update');
    Route::get('room_management/room_details/{building}/{floor}/{room_number}', [RoomController::class, 'getRoomDetails'])->name('room_details.get');
    Route::put('room_management/edit_floor_plan/active_status/{floorplans}', [RoomController::class, 'update_floor_plan_active_status'])->name('floorplans.active_status');
    //floor management
    Route::post('room_management/add_floor', [RoomController::class, 'store_floor'])->name('floors.store');
    Route::put('room_management/edit_floor/{floors}', [RoomController::class, 'update_floor'])->name('floors.update');
    Route::put('room_management/active_status/floor/{floors}', [RoomController::class, 'update_floor_active_status'])->name('floors.active_status');
    //building management    
    Route::post('room_management/add_building', [RoomController::class, 'store_building'])->name('buildings.store');
    Route::put('room_management/edit_building/{buildings}', [RoomController::class, 'update_building'])->name('buildings.update');
    Route::put('room_management/active_status/building/{buildings}', [RoomController::class, 'update_building_active_status'])->name('buildings.active_status');
    //facility management
    Route::get('room_management/manage_facilities', [RoomController::class, 'manage_facilities'])->name('room_management.manage_facilities');

    //Reports - Not yet implemented
    //Faculty Reports
    Route::get('reports/faculty_reports', [FacultyReportsController::class, 'index'])->name('faculty_reports.index');
    //Curriculums Update
    Route::get('reports/curriculums_update', [CurriculumsUpdateController::class, 'index'])->name('curriculums_update.index');

    //Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('settings/update_user/{user}', [SettingsController::class, 'update_user'])->name('settings.update_user');
    Route::post('settings/change_password/{user}', [SettingsController::class, 'update_password'])->name('settings.update_password');

    //Help Center
    Route::get('help_center', [HelpCenterController::class, 'index'])->name('help_center.index');

    //Customize PDF
    Route::get('customize_pdf', [CustomizePDFController::class, 'index'])->name('customize_pdf.index');
    Route::post('customize_pdf/curriculum', [CustomizePDFController::class, 'storeCurriculum'])->name('customize_pdf.store_curriculum');
    // Route::get('customize_pdf/get_curriculum_header_pdf_years', [CustomizePDFController::class, 'getCurriculumHeaderPDFYear'])->name('customize_pdf.get_curriculum_header_cy');
    Route::get('customize_pdf/curriculum_header_images', [CustomizePDFController::class, 'getCurriculumHeaderImages'])->name('get_curriculum_header_images');
    Route::get('customize_pdf/curriculum_footer_images', [CustomizePDFController::class, 'getCurriculumFooterImages'])->name('get_curriculum_footer_images');
    Route::post('customize_pdf/sheader_footer_status', [CustomizePDFController::class, 'updateHeaderFooterStatus'])->name('update_header_footer_status');
    Route::get('customize_pdf/active_header_footer', [CustomizePDFController::class, 'getActiveHeaderFooter'])->name('get_active_header_footer');

     //Edit NOTA 
    Route::get('/edit_nota', [EditNOTAController::class, 'index'])->name('edit_nota.index');
    Route::post('/edit_nota_content', [EditNOTAController::class, 'store'])->name('edit_nota.store');
    Route::get('/show_nota_content', [EditNOTAController::class, 'show'])->name('edit_nota.show');
    
    // Settings
    Route::post('settings/update-theme', [ProfileController::class, 'update_theme'])->name('settings.update_theme');

    //Email Validation 
    Route::get('check-email', [ProfileController::class, 'check_email'])->name('check_email');

    //Backup
    Route::get('system_maintenance', [BackupController::class, 'index'])->name('database_backup.index');
    Route::post('backup', [BackupController::class, 'backup']);

    Route::get('/download-backup/{path}', function ($path) {
        return response()->download(storage_path("app/backup_database/$path"));
    });

    Route::get('/get-backups', function () {
        return DatabaseBackup::all();
    });

    Route::post('/delete-backup', [BackupController::class, 'deleteBackup'])->name('delete.backup');
    //End of Backup

    //Pinned Calendar
    Route::post('/preferences/pinned-calendar', [UserPreferenceController::class, 'updatePinnedCalendar'])->name('preferences.pinned-calendar.update');
    Route::get('/preferences/pinned-calendar', [UserPreferenceController::class, 'getPinnedCalendar'])->name('preferences.pinned-calendar.get');
});

//User
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    //User
    Route::get('/dashboard', function () {
        if (Auth::user()->role === 'super-admin') {
            return redirect()->route('super-admin.dashboard');
        } else if (Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
        ];
        $period_name = ControlPeriodResource::collection(ControlPeriod::where('is_active', 1)->get());
        return Inertia::render('Dashboard', ['breadcrumbs' => $breadcrumbs, Auth::user(), 'period_name' => $period_name]);
    })->middleware(['auth', 'verified', 'role:user'])->name('dashboard');

    //Tour
    Route::put('/tour', [ToursController::class, 'update'])->name('tour.update');

    //Laravel Default
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Faculty
    Route::resource('faculties', FacultyController::class);
    Route::get('/faculty/create', [FacultyController::class, 'create'])->name('faculty.create');
    Route::post('/faculties/{faculty}/edit', [FacultyController::class, 'update'])->name('faculties.update');
    Route::put('/faculties/{faculty}/active_status', [FacultyController::class, 'setActiveStatus'])->name('faculties.active_status');
    Route::get('/faculties/faculties/in_active', [FacultyController::class, 'getInactiveFaculty'])->name('faculties.index_in_active');
    Route::resource('positions', PositionController::class)->only(['index']);
    Route::get('/api/teachers', [FacultyController::class, 'getTeachers'])->name('faculty.teachers');

    //Faculty Loading
    //Faculty Schedule
    Route::resource('faculty_schedule', FacultyScheduleController::class);
    Route::get('/api/{program_code}', [FacultyScheduleController::class, 'getCurriculumYear'])->name('faculty_loading.get_cy');
    Route::get('/api/departments/active', [FacultyScheduleController::class, 'getActiveDepartments'])->name('departments.active');
    Route::get('/api/departments/{department}/teachers', [FacultyScheduleController::class, 'getTeachersByDepartment'])->name('departments.teachers');
    Route::get('/api/faculty/schedules', [FacultyScheduleController::class, 'getTeacherSchedules'])->name('faculty_schedule.get_schedules');

    //Search Schedule
    Route::get('search_schedule', [SearchScheduleController::class, 'index'])->name('search_schedule.index');
    Route::get('getSearchedSchedules', [SearchScheduleController::class, 'getSearchedSchedules'])->name('getSearchedSchedules');

    //Room Schedule
    Route::get('room_schedule', [RoomScheduleController::class, 'index'])->name('rooms_schedule.index');
    Route::get('room_schedule/get_curriculum_year', [RoomScheduleController::class, 'getCurriculumYear'])->name('rooms_schedule.get_curriculum_year');
    Route::get('room_schedule/get_schedules', [RoomScheduleController::class, 'getSchedules'])->name('rooms_schedule.get_schedules');

    //Faculty WorkLoad
    Route::get('faculty_workload', [FacultyWorkloadController::class, 'index'])->name('faculty_workload.index');
    Route::get('faculty_workload/get_schedules', [FacultyWorkloadController::class, 'getSchedules'])->name('faculty_workload.get_schedules');
    Route::get('faculty_workload/get_departments', [FacultyWorkLoadController::class, 'getDepartments'])->name('faculty_workload.get_departments');
    Route::get('faculty_workload/get_instructors', [FacultyWorkloadController::class, 'getInstructors'])->name('faculty_workload.get_instructors');
    Route::post('faculty_workload/update_student_counts', [FacultyWorkloadController::class, 'updateStudentCounts'])->name('faculty_workload.update_student_counts');

    //Control Select Search Table Component on Course offerings
    Route::get('course_offerings/control_getSections', [ControlSectionController::class, 'getSections'])->name('control.get_sections');
    Route::get('course_offerings/control_getCurriculumYear', [ControlSectionController::class, 'getCurriculumYear'])->name('control.get_cy');
    Route::get('course_offerings/control_getPeriods', [ControlSectionController::class, 'getPeriods'])->name('control.get_periods');
    Route::get('course_offerings/control_getLevels', [ControlSectionController::class, 'getLevels'])->name('control.get_levels');
    Route::get('course_offerings/control_courses', [ControlSectionController::class, 'getCourses'])->name('control.get_courses');

    //Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('settings/update_user/{user}', [SettingsController::class, 'update_user'])->name('settings.update_user');
    Route::post('settings/change_password/{user}', [SettingsController::class, 'update_password'])->name('settings.update_password');

    //Help Center
    Route::get('help_center', [HelpCenterController::class, 'index'])->name('help_center.index');

    // Settings
    Route::post('settings/update-theme', [ProfileController::class, 'update_theme'])->name('settings.update_theme');

    //Email Validation 
    Route::get('check-email', [ProfileController::class, 'check_email'])->name('check_email');

    //Pinned Calendar
    Route::post('/preferences/pinned-calendar', [UserPreferenceController::class, 'updatePinnedCalendar'])->name('preferences.pinned-calendar.update');
    Route::get('/preferences/pinned-calendar', [UserPreferenceController::class, 'getPinnedCalendar'])->name('preferences.pinned-calendar.get');

    //From Super Admin / Admin
    Route::get('course_scheduling/get_schedules', [CourseSchedulingController::class, 'getSchedules'])->name('course_scheduling.get_schedules');
    Route::get('/api/dean', [FacultyScheduleController::class, 'getDean'])->name('faculty_schedule.get_dean');
    Route::get('customize_pdf/active_header_footer', [CustomizePDFController::class, 'getActiveHeaderFooter'])->name('get_active_header_footer');
    Route::get('/show_nota_content', [EditNOTAController::class, 'show'])->name('edit_nota.show');
});

require __DIR__ . '/auth.php';
