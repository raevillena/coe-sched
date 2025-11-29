import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DashboardProps } from "@/types/my_types";
import FacultyOverloadUnderloadChart from "@/Components/CustomizedComponents/super_admin_dashboard/faculty_chart";
import RoomsChart from "@/Components/CustomizedComponents/super_admin_dashboard/rooms_chart";
import SubjectsChart from "@/Components/CustomizedComponents/super_admin_dashboard/subjects_chart";
import { Calendar } from "@heroui/calendar";
import CalendarApp from "@/Components/CustomizedComponents/super_admin_dashboard/dashboard-calendar";
import RecentUpdatesPanel from "@/Components/CustomizedComponents/super_admin_dashboard/recent_updates";
import { ModeToggle } from "@/Components/CustomizedComponents/mode-toggle";
import TotalFacultyData from "@/Components/CustomizedComponents/super_admin_dashboard/total_faculty_data";
import ScheduleConflictData from "@/Components/CustomizedComponents/super_admin_dashboard/schedule_conflict_data";
import useTour from "@/Composables/useTour";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function Dashboard({
    auth,
    breadcrumbs,
    departments,
}: DashboardProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const userDepartmentId = auth?.user?.department_id;
    const userRole = auth?.user?.role;

    useTour({
        user: auth.user,
        name: "showSuperAdminDashboardTalk",
        steps: () => [
            {
                title: "Welcome to the College of Engineering Scheduler!",
                intro: `We're delighted to have you here, <b>${auth?.user?.name}</b>!<br><br> 
                        This platform is designed to help you efficiently manage your academic schedule.  
                        Let's take a quick tour to familiarize you with all the features available.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `📚 <b>Subjects Chart</b><br>  
                        This chart displays the distribution of subjects across different departments, helping you understand subject allocation.`,
                element: document.querySelector(
                    "#subjects-chart"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📊 <b>Faculty Load Chart</b><br>  
                        This section provides an overview of faculty workload, highlighting those who are overloaded or underloaded.`,
                element: document.querySelector(
                    "#faculty-overload-underload-chart"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🌗 <b>Mode Toggle</b><br>  
                        Use this option to switch between light and dark mode based on your preference.`,
                element: document.querySelector("#mode-toggle") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            // {
            //     intro: `🔔 <b>Recent Updates Panel</b><br>
            //             This section provides the latest notifications and updates to keep you informed.`,
            //     element: document.querySelector(
            //         "#recent-updates-panel"
            //     ) as HTMLElement,
            //     tooltipClass: "steps-tool-tip",
            // },
            {
                intro: `🏢 <b>Rooms Chart</b><br>  
                        This chart shows the status of room utilization, displaying which rooms are in use and which are available.`,
                element: document.querySelector("#rooms-chart") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `👨‍🏫 <b>Total Faculty Data</b><br>  
                        This section gives you a summary of the total number of faculty members.`,
                element: document.querySelector(
                    "#total-faculty-data"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `⚠️ <b>Schedule Conflict Data</b><br>  
                        This section helps you identify and resolve scheduling conflicts to avoid overlaps.`,
                element: document.querySelector(
                    "#schedule-conflict-data"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },

            {
                title: "🎉 You're All Set!",
                intro: `That's it for the tour! You are now familiar with the key features of the <b>College of Engineering Scheduler</b> dashboard.<br><br>  
                        <b>Feel free to explore</b> and make the most of the platform. If you ever need assistance, we're here to help.<br><br>  
                        <i>Happy scheduling!</i> <b>- RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="flex justify-between">
                    <h2 className="flex px-6 text-3xl font-bold text-center text-primary">
                        {auth.user.role === "super-admin"
                            ? "Super Admin Dashboard"
                            : "An Error Occured Please Report to the Administrator"}
                    </h2>
                    <div className="px-6" id="mode-toggle">
                        <ModeToggle userTheme={userTheme} />
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className="px-6">
                <p className="text-xl font-semibold">
                    Welcome, {auth.user.name}!
                </p>
            </div>

            <div className="flex flex-col gap-4 lg:p-6 pt-4 ">
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-5">
                    {/* Subjects Chart */}
                    <div
                        className="p-6 shadow-lg rounded-2xl bg-muted/10 col-span-3 xl:col-span-6"
                        id="subjects-chart"
                    >
                        <SubjectsChart
                            userDepartmentId={userDepartmentId}
                            userRole={userRole}
                            departments={departments}
                            userTheme={userTheme}
                            systemTheme={systemTheme}
                        />
                    </div>

                    {/* Faculty Overload/Underload Chart */}
                </div>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-5">
                    <div
                        className="p-6 shadow-lg rounded-2xl bg-muted/10 col-span-2 xl:col-span-6"
                        id="faculty-overload-underload-chart"
                    >
                        <FacultyOverloadUnderloadChart
                            userDepartmentId={userDepartmentId}
                            userRole={userRole}
                            departments={departments}
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:col-span-2 xl:col-span-2 ">
                    <div id="schedule-conflict-data">
                        <ScheduleConflictData
                            userDepartmentId={userDepartmentId}
                            userRole={userRole}
                            departments={departments}
                        />
                    </div>
                </div>
                <div
                    className="flex flex-col lg:col-span-2 xl:col-span-2 "
                    id="total-faculty-data"
                >
                    <TotalFacultyData userTheme={userTheme} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Recent Updates Panel */}
                    {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-5"> */}
                    <div>
                        {/* Rooms Chart */}
                        <div
                            className="flex items-center justify-center p-6 text-lg font-medium shadow-lg aspect-video rounded-2xl bg-muted/10 lg:col-span-2 xl:col-span-3"
                            id="rooms-chart"
                        >
                            <RoomsChart />
                        </div>
                    </div>

                    <div
                        className="flex flex-col items-center justify-center p-6 text-lg font-medium shadow-lg rounded-2xl bg-muted/10 lg:h-[460px] xl:h-[auto]"
                        id="calendar-app"
                    >
                        {/* Calendar component */}
                        <CalendarApp />

                        {/* Description below the calendar */}
                        <p className="mt-5 text-sm text-center text-gray-500">
                            "Make time for work, but don't forget to make time
                            for yourself too."
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
