//Models
//User
export interface User {
    id: number;
    name: string;
    email: string;
    department_id: number;
    role: "user" | "admin" | "super-admin";
    profile_picture: string;
    position: Position;
    theme: "dark" | "light" | "system";
    is_active: number;
    tours: { [tourName: string]: boolean };
    is_dean: number;
    deloading: number;
    designation: string;
    created_at: string;
    updated_at: string;
}
//Dashboard
export interface DashboardProps {
    auth: {
        user: User;
    };
    departments: {
        data: Department[];
    };
    breadcrumbs: BreadcrumbItemProps[];
    period_name: string;
}

// Breadcrumbs
export interface BreadcrumbItemProps {
    title: string;
    link: string;
}

//Login
export interface LoginProps {
    //for login.tsx
    departments: {
        data: Department[];
    };
}

export interface LoginFormProps {
    users: User[];
    onUserSelect: (userId: number) => void;
    onUserChange: (user: User | null) => void;
}
//End of Login Form

//Department
export interface Department {
    id: number;
    name: string;
    program_code: string;
    logo: File | null;
    is_active: number;
}

export interface AcademicYear {
    id: number;
    academic_year: string;
    is_active: number;
}

//Position
export interface Position {
    id: number;
    name: string;
    is_active: number;
}

//Period
export interface Period {
    id: number;
    period_name: string;
    is_active: number;
}

//Level
export interface Level {
    id: number;
    level_name: string;
    is_active: number;
}

//Sections
export interface Section {
    id: number;
    program_code: string;
    program_name: string;
    level: string;
    section_name: string;
    is_active: number;
}

//Faculty
export interface Faculty {
    id: number;
    department_id: number;
    name: string;
    email: string;
    password: string;
    department: {
        id: number;
        name: string;
    };
    position: {
        id: number;
        name: string;
    };
    profile_picture: File | null;
    role: string;
    is_dean: number;
    created_at: string;
}

//Faculty Index
export interface Links {
    label: string;
    url: string | null;
    active: boolean;
}

export interface Meta {
    from: number;
    to: number;
    total: number;
    links: Links[];
}
export interface FacultyProps {
    auth: {
        user: User;
    };
    faculties: {
        data: Faculty[];
        meta: Meta;
    };
    departments: {
        data: Department[];
    };
    //for edit.tsx
    faculty: {
        data: Faculty;
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Faculty Schedule
export interface FacultyScheduleProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
    deanName: string;
}

//Faculty Workload
export interface FacultyWorkloadProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
    departments: {
        data: Department[];
    };
    period_name: string;
}

//Curriculum
export interface AcademicProgram {
    id: number;
    academic_type: string;
    department_id: number;
    program_code: string;
    program_name: string;
}

export interface Curriculum extends Record<string, unknown> {
    id: number;
    curriculum_year: number;
    period: string;
    level: string;
    program_code: string;
    program_name: string;
    control_code: string;
    course_code: string;
    course_name: string;
    lec: number;
    lab: number;
    units: number;
    is_complab: boolean;
    pre_reqs: string;
}

export interface CurriculumProps {
    auth: {
        user: User;
    };
    academic_programs: {
        data: AcademicProgram[];
    };
    periods: {
        data: Period[];
    };
    levels: {
        data: Level[];
    };
    curriculums: Curriculum[];
    curriculum_year: number;
    program_name: string;
    program_code: string;
    period_name: string;
    level_name: string;
    breadcrumbs: BreadcrumbItemProps[];
}

//Settings
export interface SettingsProps {
    auth: {
        user: User;
    };
    departments: {
        data: Department[];
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Help Center
export interface HelpCenterProps {
    auth: {
        user: User;
    };
    departments: {
        data: Department[];
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Section Management
export interface SectionManagementProps {
    auth: {
        user: User;
    };
    academic_programs: {
        data: AcademicProgram[];
    };
    levels: {
        data: Level[];
    };
    sections: {
        data: Section[];
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Academic Entity Management
export interface AcademicEntityManagementProps {
    auth: {
        user: User;
    };
    departments: {
        data: Department[];
    };
    positions: {
        data: Position[];
    };
    periods: {
        data: Period[];
    };
    levels: {
        data: Level[];
    };
    academic_years: {
        data: AcademicYear[];
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//////////////////////////////////////////////////////////////////////////////

//Components
//For Select Component
export interface SelectDepartmentProps {
    departments: {
        data: Department[];
    };
    program_name: string;
    breadcrumbs: BreadcrumbItemProps[];
}

//Academic Entity Management
export interface DepartmentManagementTabsProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    departments: {
        data: Department[];
    };
    userRole: "user" | "admin" | "super-admin";
    userDepartmentId: number;
}

export interface PositionManagementTabsProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    positions: {
        data: Position[];
    };
}

export interface AcademicYearManagementTabsProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    academic_years: {
        data: AcademicYear[];
    };
}

export interface PeriodManagementTabsProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    periods: {
        data: Period[];
    };
}

export interface LevelManagementTabsProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    levels: {
        data: Level[];
    };
}
//End of Academic Entity Management

//Room Management
export interface RoomManagementProps {
    auth: {
        user: User;
    };
    buildings: {
        data: Building[];
    };
    floors: {
        data: Floor[];
    };
    academic_programs: {
        data: AcademicProgram[];
    };
    floor_plans: FloorPlan[];
    breadcrumbs: BreadcrumbItemProps[];
}

//Floor Plan
export interface FloorPlan {
    id: number;
    building: string;
    floor: string;
    floor_plan_map: File | null;
    rectangles: Rectangle[];
    is_active: number;
}

export interface Rectangle {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    borderColor: string;
    locked: boolean;
    room_number: string;
    room_type: string;
    department_priority: string | string[];
    description: string;
    room_image: File | null;
    is_active: number;
    updated_at: string;
    created_at: string;
}

//Floor Management
export interface Floor {
    id: number;
    floor_name: string;
    is_active: number;
}

export interface FloorManagementProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    floors: {
        data: Floor[];
    };
}

//Building Management
export interface Building {
    id: number;
    building_name: string;
    is_active: number;
}

export interface BuildingManagementProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    buildings: {
        data: Building[];
    };
}
//End of Room Management

export interface TimeSchedulingSettings {
    dayFormat: "long" | "short" | "narrow";
    isWeekdaysOnly: boolean;
    timeRange: string;
    timeFormat: boolean;
    timeSnap: string;
}

//Course Scheduling
export interface CourseSchedulingProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
    departments: {
        data: Department[];
    };
    level_name: string;
    period_name: string;
}
//TimeTableFunction.tsx
export interface TimeTableFunctionProps {
    userRole: "user" | "admin" | "super-admin";
    userDepartmentId: number;
    departments: {
        data: Department[];
    };
    level_name: string;
    period_name: string;

    course: string;
    setCourse: React.Dispatch<React.SetStateAction<string>>;
    level: string;
    setLevel: React.Dispatch<React.SetStateAction<string>>;
    section: string;
    setSection: React.Dispatch<React.SetStateAction<string>>;
    year: string;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    semester: string;
    setSemester: React.Dispatch<React.SetStateAction<string>>;
    academic: string;
    setAcademic: React.Dispatch<React.SetStateAction<string>>;
}

//Reports
//Faculty Reports
export interface FacultyReportsProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Rooms Schedule
export interface RoomsScheduleProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
    floor_plans: FloorPlan[];
    period_name: string;
}

//Curriculums Update
export interface CurriculumsUpdateProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Customize Curriculum PDF
// Index PDF
export interface IndexPDFPageProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Customize NOTA
export interface EditNOTAPageProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
}

//Header Footer
export interface HeaderFooterProps {
    userTheme: "dark" | "light" | "system";
}

//End of Customize Curriculum PDF

//BackupDatabase
export interface BackupDatabaseProps {
    auth: {
        user: User;
    };
    breadcrumbs: BreadcrumbItemProps[];
}

export interface DatabaseBackup {
    id: number;
    user_id: number;
    path: string;
    created_at: string;
    updated_at: string;
}
