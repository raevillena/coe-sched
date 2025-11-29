import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { FacultyWorkloadProps } from "@/types/my_types";
import SearchScheduleFunction from "@/Pages/FacultyLoading/SearchSchedulesComponents/SearchScheduleFunction";
import TimeTableForSearch from "@/Pages/FacultyLoading/SearchSchedulesComponents/TimeTableForSearch";
import useTour from "@/Composables/useTour";

export default function SearchSchedule({
    auth,
    breadcrumbs,
}: FacultyWorkloadProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const userRole = auth?.user?.role;

    const [semester, setSemester] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    useTour({
        user: auth.user,
        name: "showSearchScheduleTour",
        steps: () => [
            {
                title: "👋 Welcome to Search Schedule",
                intro: `
                    <i>Quickly find faculty schedules by Academic Year, Semester, Instructor, Room, or Section.</i><br><br>
                    Let's get started! 🚀<br><br>
                    <b>RN DevWorks</b> 💻</div>`,
                tooltipClass: "four-fifty-tool-tip",
            },
            {
                title: "📅 Select Academic Year",
                intro: `
                    First, choose the <b>Academic Year</b> to filter schedules.<br><br>
                    <i>Example: 2024-2025</i>`,
                element: document.querySelector("#select-cy") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🗓️ Select Semester",
                intro: `
                    Then, pick the <b>Semester</b> you want to view.<br><br>
                    <i>Example: 1st Semester or 2nd Semester</i>`,
                element: document.querySelector("#select-sem") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🔍 Use the Search Bar",
                intro: `
        Type an <b>Instructor's Name</b>, <b>Room</b>, or <b>Section</b> to quickly find schedules.<br><br>
        Then, click the <b>search icon</b> to view the results.<br><br>
        <i>Example: BSCPE 4-A</i>`,
                element: document.querySelector("#search-bar") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 You're All Set!",
                intro: `
                    That's it! You can now explore and search for schedules easily.<br><br>
                    <b>RN DevWorks</b> 💻</div>`,
                tooltipClass: "four-fifty-tool-tip",
            },
        ],
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="flex items-center justify-center p-4 mb-3 text-2xl font-semibold leading-tight rounded-lg bg-muted/50">
                    Search Schedule
                    {/* <FaMapMarkedAlt fontSize="x-large" className="ml-2" /> */}
                </h2>
            }
        >
            <Head title="Faculty Workload" />
            <div className="w-full max-w-[1280px] mx-auto">
                <SearchScheduleFunction
                    semester={semester}
                    setSemester={setSemester}
                    year={year}
                    setYear={setYear}
                    search={search}
                    setSearch={setSearch}
                />
                <TimeTableForSearch
                    year={year}
                    semester={semester}
                    search={search}
                    userTheme={userTheme}
                    systemTheme={false}
                    userRole={userRole}
                />
            </div>
        </AuthenticatedLayout>
    );
}
