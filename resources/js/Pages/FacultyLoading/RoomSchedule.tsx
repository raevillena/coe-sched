import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { RoomsScheduleProps } from "@/types/my_types";
import { PreviewFloorPlanRoomSchedule } from "@/Pages/FacultyLoading/RoomSchedulesComponents/preview_floor_plan_rooms_schedule";

export default function RoomsSchedule({
    auth,
    breadcrumbs,
    floor_plans,
    period_name,
}: RoomsScheduleProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const userRole = auth?.user?.role;
    const userDepartmentId = auth?.user?.department_id;
    const userName = auth?.user.name

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl font-semibold leading-tight justify-center items-center flex bg-muted/50 p-4 rounded-lg mb-3">
                    Room Schedule
                    {/* <FaMapMarkedAlt fontSize="x-large" className="ml-2" /> */}
                </h2>
            }
        >
            <Head title="Room Schedule" />
            <div className="overflow-hidden" id="preview-floor-plan-occupied">
                <PreviewFloorPlanRoomSchedule 
                    floor_plans={floor_plans} 
                    userTheme={userTheme}
                    systemTheme={systemTheme}
                    userRole={userRole}
                    userDepartmentId={userDepartmentId}
                    period_name={period_name}
                    user={userName}
                />
            </div>
        </AuthenticatedLayout>
    );
}
