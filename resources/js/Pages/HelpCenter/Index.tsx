import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { HelpCenterProps } from "@/types/my_types";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import useTour from "@/Composables/useTour";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import MagnifyingGlass from "@/Components/icons/MagnifyingGlass";

//image
import create_faculty_tour from "/Images/help_center/create_faculty_tour.png";
import index_faculty_tour from "/Images/help_center/index_faculty_tour.png";
import room_management_index_tour from "/Images/help_center/room_management_index_tour.png";
import add_floor_plan_tour from "/Images/help_center/add_floor_plan_tour.png";
import edit_floor_plan_tour from "/Images/help_center/edit_floor_plan_tour.png";
import facility_management_tour from "/Images/help_center/facility_management_tour.png";
import section_management_tour from "/Images/help_center/section_management_tour.png";
import academic_management_tour from "/Images/help_center/academic_management_tour.png";
import curriculum_management_tour from "/Images/help_center/curriculum_management_tour.png";
import room_schedule_tour from "/Images/help_center/room_schedule_tour.png";
import faculty_schedule_tour from "/Images/help_center/faculty_schedule_tour.png";
import course_scheduling_tour from "/Images/help_center/course_scheduling_tour.png";
import search_schedule_tour from "/Images/help_center/search_schedule_tour.png";
import faculty_workload_tour from "/Images/help_center/faculty_workload_tour.png";
import customize_header_footer_tour from "/Images/help_center/customize_header_footer_tour.png";
import nota_management_tour from "/Images/help_center/nota_management_tour.png";

export default function Index({ auth, breadcrumbs }: HelpCenterProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const [searchQuery, setSearchQuery] = useState("");

    const createFacultyTour = useTour({
        user: auth.user,
        name: "showCreateFacultyTalk",
        steps: () => [],
    });

    const indexFacultyTour = useTour({
        user: auth.user,
        name: "showIndexFacultyTalk",
        steps: () => [],
    });

    const roomScheduleTour = useTour({
        user: auth.user,
        name: "showRoomScheduleTour",
        steps: () => [],
    });

    const indexRoomManagementTour = useTour({
        user: auth.user,
        name: "showRoomManagementTour",
        steps: () => [],
    });

    const addFloorPlanTour = useTour({
        user: auth.user,
        name: "showAddFloorPlanTour",
        steps: () => [],
    });

    const editFloorPlanTour = useTour({
        user: auth.user,
        name: "showEditFloorPlanTour",
        steps: () => [],
    });

    const facilityManagementTour = useTour({
        user: auth.user,
        name: "showFacilityManagementTalk",
        steps: () => [],
    });

    const sectionManagementTour = useTour({
        user: auth.user,
        name: "showSectionManagementTalk",
        steps: () => [],
    });

    const academicManagementTour = useTour({
        user: auth.user,
        name: "showAcademicManagementTalk",
        steps: () => [],
    });

    const curriculumManagementTour = useTour({
        user: auth.user,
        name: "showIndexCurriculumTour",
        steps: () => [],
    });

    const viewCurriculumTour = useTour({
        user: auth.user,
        name: "showViewCurriculumTour",
        steps: () => [],
    });

    const curriculumListTour = useTour({
        user: auth.user,
        name: "showListCurriculumTour",
        steps: () => [],
    });

    const editCurriculumTour = useTour({
        user: auth.user,
        name: "showEditCurriculumListTour",
        steps: () => [],
    });

    const facultyScheduleTour = useTour({
        user: auth.user,
        name: "showFacultyScheduleTour",
        steps: () => [],
    });

    const courseSchedulingTour = useTour({
        user: auth.user,
        name: "showIndexCourseSchedulingTour",
        steps: () => [],
    });

    const searchScheduleTour = useTour({
        user: auth.user,
        name: "showSearchScheduleTour",
        steps: () => [],
    });

    const facultyWorkloadTour = useTour({
        user: auth.user,
        name: "showFacultyWorkloadTour",
        steps: () => [],
    });

    const customizeHeaderFooterTour = useTour({
        user: auth.user,
        name: "showCustomizeHeaderFooterTour",
        steps: () => [],
    });

    const notaSettingsTour = useTour({
        user: auth.user,
        name: "showNOTASettingsTour",
        steps: () => [],
    });

    //////////////////////////////////////////////////////////

    const startCreateFacultyTour = async () => {
        await createFacultyTour.resetTour();

        router.get(
            route("faculties.create"),
            {},
            {
                onFinish: () => {
                    createFacultyTour.start();
                },
            }
        );
    };

    const startIndexFacultyTour = async () => {
        await indexFacultyTour.resetTour();

        router.get(
            route("faculties.index"),
            {},
            {
                onFinish: () => {
                    indexFacultyTour.start();
                },
            }
        );
    };

    const startRoomScheduleTour = async () => {
        await roomScheduleTour.resetTour();

        router.get(
            route("rooms_schedule.index"),
            {},
            {
                onFinish: () => {
                    roomScheduleTour.start();
                },
            }
        );
    };

    const startIndexRoomManagementTour = async () => {
        await indexRoomManagementTour.resetTour();

        router.get(
            route("room_management.index"),
            {},
            {
                onFinish: () => {
                    indexRoomManagementTour.start();
                },
            }
        );
    };

    const startAddFloorPlanTour = async () => {
        await addFloorPlanTour.resetTour();

        router.get(
            route("room_management.add_floor_plan"),
            {},
            {
                onFinish: () => {
                    addFloorPlanTour.start();
                },
            }
        );
    };

    const startEditFloorPlanTour = async () => {
        await editFloorPlanTour.resetTour();

        router.get(
            route("room_management.edit_floor_plan"),
            {},
            {
                onFinish: () => {
                    editFloorPlanTour.start();
                },
            }
        );
    };

    const startFacilityManagementTour = async () => {
        await facilityManagementTour.resetTour();

        router.get(
            route("room_management.manage_facilities"),
            {},
            {
                onFinish: () => {
                    facilityManagementTour.start();
                },
            }
        );
    };

    const startSectionManagementTour = async () => {
        await sectionManagementTour.resetTour();

        router.get(
            route("section_management.index"),
            {},
            {
                onFinish: () => {
                    sectionManagementTour.start();
                },
            }
        );
    };

    const startAcademicManagementTour = async () => {
        await academicManagementTour.resetTour();

        router.get(
            route("academic_entity_management.index"),
            {},
            {
                onFinish: () => {
                    academicManagementTour.start();
                },
            }
        );
    };

    const startCurriculumManagementTour = async () => {
        await curriculumManagementTour.resetTour();
        await viewCurriculumTour.resetTour();
        await curriculumListTour.resetTour();
        await editCurriculumTour.resetTour();

        router.get(
            route("curriculum.index"),
            {},
            {
                onFinish: () => {
                    curriculumManagementTour.start();
                    viewCurriculumTour.start();
                    curriculumListTour.start();
                    editCurriculumTour.start();
                },
            }
        );
    };

    const startFacultyScheduleTour = async () => {
        await facultyScheduleTour.resetTour();

        router.get(
            route("faculty_schedule.index"),
            {},
            {
                onFinish: () => {
                    facultyScheduleTour.start();
                },
            }
        );
    };

    const startCourseSchedulingTour = async () => {
        await courseSchedulingTour.resetTour();

        router.get(
            route("course_scheduling.index"),
            {},
            {
                onFinish: () => {
                    courseSchedulingTour.start();
                },
            }
        );
    };

    const startSearchScheduleTour = async () => {
        await searchScheduleTour.resetTour();

        router.get(
            route("search_schedule.index"),
            {},
            {
                onFinish: () => {
                    searchScheduleTour.start();
                },
            }
        );
    };

    const startFacultyWorkloadTour = async () => {
        await facultyWorkloadTour.resetTour();

        router.get(
            route("faculty_workload.index"),
            {},
            {
                onFinish: () => {
                    facultyWorkloadTour.start();
                },
            }
        );
    };

    const startCustomizeHeaderFooterTour = async () => {
        await customizeHeaderFooterTour.resetTour();

        router.get(
            route("customize_pdf.index"),
            {},
            {
                onFinish: () => {
                    customizeHeaderFooterTour.start();
                },
            }
        );
    };

    const startNotaSettingsTour = async () => {
        await notaSettingsTour.resetTour();

        router.get(
            route("edit_nota.index"),
            {},
            {
                onFinish: () => {
                    notaSettingsTour.start();
                },
            }
        );
    };

    const tours = [
        {
            id: "create-faculty-account",
            title: "Create a Faculty Account",
            description:
                "Create a faculty account for yourself or your colleagues and start scheduling with ease.",
            img: create_faculty_tour,
            onClick: startCreateFacultyTour,
            width: "600px",
        },
        {
            id: "index-faculty",
            title: "Managing Faculty Accounts",
            description:
                "Efficiently update faculty details, control account settings, and manage activation status with ease.",
            img: index_faculty_tour,
            onClick: startIndexFacultyTour,
            width: "600px",
        },
        {
            id: "faculty-schedule",
            title: "Faculty Schedule",
            description:
                "View your faculty schedule, check assigned classes, and download your Notice of Teaching Assignment in word format.",
            img: faculty_schedule_tour,
            onClick: startFacultyScheduleTour,
            width: "600px",
        },
        {
            id: "room-schedule",
            title: "Room Schedule",
            description:
                "Easily view and manage room schedules with an interactive floor plan. Select a school year and period to check room availability and ensure efficient facility usage.",
            img: room_schedule_tour,
            onClick: startRoomScheduleTour,
            width: "600px",
        },
        {
            id: "search-schedule",
            title: "Search Schedule",
            description:
                "Quickly find schedules by searching for instructors, rooms, or sections. Simplify your planning by accessing specific timetable details with ease and accuracy.",
            img: search_schedule_tour,
            onClick: startSearchScheduleTour,
            width: "600px",
        },
        {
            id: "faculty-workload",
            title: "Faculty Workload",
            description:
                "Easily search for schedules by instructors, rooms, or sections. Access timetable details quickly and accurately.",
            img: faculty_workload_tour,
            onClick: startFacultyWorkloadTour,
            width: "600px",
        },
        {
            id: "room-management",
            title: "Managing Room Details & Floor Plan",
            description:
                "Easily update room details, organize floor plans, and manage availability with efficiency.",
            img: room_management_index_tour,
            onClick: startIndexRoomManagementTour,
            width: "600px",
        },
        {
            id: "add-floor-plan",
            title: "Create a Floor Plan",
            description:
                "Easily design and customize floor plans to fit your needs.",
            img: add_floor_plan_tour,
            onClick: startAddFloorPlanTour,
            width: "600px",
        },
        {
            id: "edit-floor-plan",
            title: "Modify & Customize Floor Plans",
            description:
                "Edit floor plan. Adjust layouts, reassign rooms, and optimize space with full flexibility and control.",
            img: edit_floor_plan_tour,
            onClick: startEditFloorPlanTour,
            width: "600px",
        },
        {
            id: "facility-management",
            title: "Manage & Customize Facilities",
            description:
                "Add new buildings and floors. Take full control of your facility's structure with ease and flexibility.",
            img: facility_management_tour,
            onClick: startFacilityManagementTour,
            width: "600px",
        },
        {
            id: "section-management",
            title: "Manage & Organize Student Sections",
            description:
                "Easily add, organize, and activate student sections. Keep your sections structured and optimized for efficient scheduling.",
            img: section_management_tour,
            onClick: startSectionManagementTour,
            width: "600px",
        },
        {
            id: "academic-management",
            title: "Manage Academic Structure",
            description:
                "Add and edit departments, instructor positions, academic periods, and year levels. Keep your institution’s academic framework well-organized and up to date.",
            img: academic_management_tour,
            onClick: startAcademicManagementTour,
            width: "600px",
        },
        {
            id: "curriculum-management",
            title: "Curriculum & Course Management",
            description:
                "Easily manage and review your institution's curriculums and courses. Get detailed insights into academic programs, subjects, and curriculum structures to keep everything organized and up to date.",
            img: curriculum_management_tour,
            onClick: startCurriculumManagementTour,
            width: "600px",
        },
        {
            id: "course-scheduling",
            title: "Course Scheduling",
            description:
                "Plan, assign, and manage course schedules with clarity and precision. Utilize intuitive tools to organize subjects, align academic calendars, and ensure conflict-free timetables for every program.",
            img: course_scheduling_tour,
            onClick: startCourseSchedulingTour,
            width: "600px",
        },
        {
            id: "customize-header-footer",
            title: "Customize Header and Footer",
            description:
                "Update the header and footer of exported PDF or Word documents to reflect your school’s official name and logo. Maintain a consistent and professional appearance across all generated files.",
            img: customize_header_footer_tour,
            onClick: startCustomizeHeaderFooterTour,
            width: "600px",
        },
        {
            id: "customize-nota-settings",
            title: "Customize NOTA Content",
            description:
                "Edit the content of the Notice of Teaching Assignment (NOTA) to include important instructions, reminders, and official statements for faculty.",
            img: nota_management_tour, 
            onClick: startNotaSettingsTour, 
            width: "600px",
        },
    ];

    const filteredTours = tours.filter((tour) => {
        if (auth.user.role === "user") {
            return (
                [
                    "faculty-schedule",
                    "faculty-workload",
                    "room-schedule",
                    "search-schedule",
                ].includes(tour.id) &&
                (tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tour.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
            );
        }

        return (
            tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="px-4 text-2xl font-semibold leading-tight">
                    Help Center
                </h2>
            }
        >
            <Head title="Help Center" />
            <div>
                <p className="px-4 font-light text-s">
                    Access guides, FAQs, and resources to enhance your tour
                    experience and navigate the website with ease.
                </p>

                <div className="flex flex-col flex-1 gap-4 p-4">
                    <div className="relative col-span-3 text-sm">
                        <div className="absolute top-0 bottom-0 left-0 flex items-center pl-2 pointer-events-none">
                            <MagnifyingGlass />
                        </div>

                        <Input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            id="search_help"
                            type="text"
                            placeholder="Search..."
                            autoComplete="off"
                            className="py-2 pl-10 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="grid gap-4 auto-rows-min sm:grid-cols-1 md:grid-cols-1 2xl:grid-cols-2">
                        {filteredTours.map((tour) => (
                            <div key={tour.id} id={tour.id}>
                                <div
                                    className={`rounded-2xl ${
                                        userTheme === "dark"
                                            ? "bg-gray-400"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    <div className="p-5 mx-auto">
                                        <img
                                            className="w-full h-auto max-w-[400px] md:max-w-[600px] lg:max-w-[800px] object-contain border border-t-2 border-gray-500 rounded-2xl"
                                            src={tour.img}
                                            alt={tour.title}
                                        />
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-xl font-semibold">
                                        {tour.title}
                                    </p>
                                    <p>{tour.description}</p>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="ghost"
                                        onClick={tour.onClick}
                                    >
                                        <p className="text-blue-500">
                                            Start Tour
                                        </p>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
