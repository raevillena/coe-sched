import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { FacultyScheduleProps } from "@/types/my_types";
import FacultyBox from "./FacultySchedulesComponents/Facultybox";
import React, { useState, useRef, useEffect } from "react";

export default function FacultySchedule({
    auth,
    breadcrumbs,
    deanName,
}: FacultyScheduleProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const userName = auth?.user.name;
    const userDepartmentId = auth?.user?.department_id;
    const userRole = auth?.user.role;

    // Select Component
    const [year, setYear] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [period_name, setPeriodName] = useState<string>("");
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="flex items-center justify-center p-4 mb-3 text-2xl font-semibold leading-tight rounded-lg bg-muted/50">
                    Faculty Schedule
                    {/* <FaMapMarkedAlt fontSize="x-large" className="ml-2" /> */}
                </h2>
            }
        >
            <Head title="Faculty Schedule" />
            <div id="select-department-view">
                <FacultyBox
                    year={year}
                    setYear={setYear}
                    semester={semester}
                    setSemester={setSemester}
                    period_name={period_name}
                    userTheme={userTheme}
                    systemTheme={systemTheme}
                    user={userName}
                    userDepartmentId={userDepartmentId}
                    userRole={userRole}
                    deanName={deanName}
                />
            </div>
        </AuthenticatedLayout>
    );
}
