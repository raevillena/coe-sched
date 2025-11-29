import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { AcademicEntityManagementProps } from "@/types/my_types";
import { DepartmentManagementTabs } from "@/Components/CustomizedComponents/academic_entity_management/department_management_tabs";
import { PositionManagementTabs } from "@/Components/CustomizedComponents/academic_entity_management/position_management_tabs";
import { PeriodManagementTabs } from "@/Components/CustomizedComponents/academic_entity_management/period_management_tabs";
import { LevelManagementTabs } from "@/Components/CustomizedComponents/academic_entity_management/level_management_tabs";
import { LayoutPanelTop } from "lucide-react";
import useTour from "@/Composables/useTour";
import { AcademicYearManagementTabs } from "@/Components/CustomizedComponents/academic_entity_management/academic_year_management_tabs";

export default function AcademicEntityManagement({
    auth,
    breadcrumbs,
    departments,
    positions,
    periods,
    levels,
    academic_years,
}: AcademicEntityManagementProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const userDepartmentId = auth?.user?.department_id;
    const userRole = auth?.user?.role;

    useTour({
        user: auth.user,
        name: "showAcademicManagementTalk",
        steps: () => [
            {
                title: "Welcome to Academic Management!",
                intro: `Manage your institution with ease! <br><br>
                                  Here, you can efficiently organize <b>Academic Year</b>, <b>Departments</b>, <b>Positions</b>, <b>Periods</b>, and <b>Levels</b>.  
                                  Add new entries, update details, and enable or disable functionalities, all in one place!<br><br>
                                  <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `📚 <b>Academic Year Management</b><br>
                            Set up and organize academic years for your institution. 
                            You can easily add new entries, make updates, or toggle their status as needed.`,
                element: document.querySelector(
                    "#academic-year-management"
                ) as HTMLElement,

                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🏫 <b>Department Management</b><br>
                                  Easily add, edit, or manage departments. You can also activate or deactivate them as needed.`,
                element: document.querySelector(
                    "#department-management"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🧑‍💼 <b>Position Management</b><br>
                                  Define roles within departments. Add new positions, modify existing ones, and control their availability.`,
                element: document.querySelector(
                    "#position-management"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📅 <b>Period Management</b><br>
                                  Manage academic periods efficiently. Create new terms, adjust details, and oversee their statuses.`,
                element: document.querySelector(
                    "#period-management"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📚 <b>Level Management</b><br>
                                  Organize academic levels effortlessly. Add new levels, make modifications, and manage their availability.`,
                element: document.querySelector(
                    "#level-management"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
        ],
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="container mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                        <h2 className="text-xl lg:text-3xl font-semibold text-center flex items-center justify-center">
                            Academic Entity Management{" "}
                            <LayoutPanelTop size={36} className="ml-2" />
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Academic Management" />
            <div className="container mt-5 space-y-6 mx-auto px-4 sm:px-6 lg:px-4">
                <div className="container mx-auto px-0">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        <div
                            className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col"
                            id="academic-year-management"
                        >
                            <h2 className="text-center mt-2 text-lg sm:text-xl font-semibold leading-tight">
                                Academic Year Management
                            </h2>
                            <div className="flex justify-center mt-3 mb-4">
                                <AcademicYearManagementTabs
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                    academic_years={academic_years}
                                />
                            </div>
                        </div>

                        <div
                            className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col"
                            id="department-management"
                        >
                            <h2 className="text-center mt-2 text-lg sm:text-xl font-semibold leading-tight">
                                Department Management
                            </h2>
                            <div className="flex justify-center mt-3 mb-4">
                                <DepartmentManagementTabs
                                    departments={departments}
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                    userRole={userRole}
                                    userDepartmentId={userDepartmentId}
                                />
                            </div>
                        </div>

                        <div
                            className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col"
                            id="position-management"
                        >
                            <h2 className="text-center mt-2 text-lg sm:text-xl font-semibold leading-tight">
                                Position Management
                            </h2>
                            <div className="flex justify-center mt-3 mb-4">
                                <PositionManagementTabs
                                    positions={positions}
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                />
                            </div>
                        </div>

                        <div
                            className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col"
                            id="period-management"
                        >
                            <h2 className="text-center mt-2 text-lg sm:text-xl font-semibold leading-tight">
                                Semester Management
                            </h2>
                            <div className="flex justify-center mt-3 mb-4">
                                <PeriodManagementTabs
                                    periods={periods}
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                />
                            </div>
                        </div>

                        <div
                            className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col"
                            id="level-management"
                        >
                            <h2 className="text-center mt-2 text-lg sm:text-xl font-semibold leading-tight">
                                Level Management
                            </h2>
                            <div className="flex justify-center mt-3 mb-4">
                                <LevelManagementTabs
                                    levels={levels}
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
