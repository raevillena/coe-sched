import React, { useState } from "react";
import { Card } from "@/Components/ui/card";
import Timetable from "./Timetable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CourseSchedulingProps } from "@/types/my_types";
import TimetableFuntion from "./TimetableFuntion";
import { Head } from "@inertiajs/react";
import { RiCalendarScheduleLine } from "react-icons/ri";
import useTour from "@/Composables/useTour";

interface FilterCriteria {
    year: string;
    semester: string;
    searchTerm: string;
}

export default function Index({
    auth,
    breadcrumbs,
    departments,
    level_name,
    period_name,
}: CourseSchedulingProps) {
    const userRole = auth?.user?.role;
    const userDepartmentId = auth?.user?.department_id;
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const [course, setCourse] = useState<string>("");
    const [level, setLevel] = useState<string>("");
    const [section, setSection] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [academic, setAcademic] = useState<string>("");

    const defaultFilterCriteria: FilterCriteria = {
        year: "",
        semester: "",
        searchTerm: "",
    };

    useTour({
        user: auth.user,
        name: "showIndexCourseSchedulingTour",
        steps: () => [
            {
                title: "📅 Course Scheduling",
                intro: `Hello, <b>${auth?.user?.name}</b>! 👋<br><br>
                            Welcome to the <b>Course Scheduling</b> page. This tool helps you assign schedules and manage course timings with clarity and convenience.<br><br>
                            Let's walk through the essential parts of this section.<br><br>
                            <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `🎯 <b>Required Selection Components</b><br>
                            Before assigning a schedule, make sure to select the <b>Department, Semester, Year Level, Academic Year,Section and Curriculum</b>. These filters ensure you're scheduling within the correct context.`,
                element: document.querySelector(
                    "#timetable-function"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🗂️ <b>Available Courses</b><br>
                            This panel displays all the courses that need to be scheduled.<br><br>
                            Simply <b>drag and drop</b> a course into the calendar or <b>click</b> on it to assign a time slot. The system helps ensure your assignments are free of conflicts and aligned with the selected filters.`,
                element: document.querySelector(
                    "#available-classes"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📅 <b>Scheduling Calendar</b><br>
                            This is where all selected courses will be scheduled.<br><br>
                            Use the interactive calendar to <b>drag and drop</b> courses into time slots, or <b>resize</b> them to adjust the start and end times as needed.`,
                element: document.querySelector(
                    "#scheduling-calendar"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "✅ Course Scheduling Complete",
                intro: `You're now ready to manage and finalize course schedules with ease and confidence.<br><br>
                            Explore the scheduling tools to create well-structured timetables tailored to your program's needs.<br><br>
                            <b>Wishing you a smooth and efficient scheduling experience!</b> <br><br>
                            <b>RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="flex items-center justify-center text-2xl font-semibold text-center">
                    Course Scheduling
                    <RiCalendarScheduleLine
                        fontSize="x-large"
                        className="ml-2"
                    />
                </h2>
            }
        >
            <Head title="Course Scheduler" />
            <div className="p-6">
                <Card className="p-3 mt-1 mb-2" id="timetable-function">
                    <TimetableFuntion
                        userRole={userRole}
                        userDepartmentId={userDepartmentId}
                        departments={departments}
                        level_name={level_name}
                        period_name={period_name}
                        course={course}
                        setCourse={setCourse}
                        level={level}
                        setLevel={setLevel}
                        section={section}
                        setSection={setSection}
                        year={year}
                        setYear={setYear}
                        semester={semester}
                        setSemester={setSemester}
                        academic={academic}
                        setAcademic={setAcademic}
                    />
                </Card>
                <Card className="p-6 shadow-md">
                    <Timetable
                        academic={academic}
                        level={level}
                        year={year}
                        semester={semester}
                        course={course}
                        section={section}
                        // searchEvent=""
                        // filterCriteria={defaultFilterCriteria}
                        userTheme={userTheme}
                        systemTheme={systemTheme}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
