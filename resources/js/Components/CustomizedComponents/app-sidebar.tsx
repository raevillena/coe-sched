import * as React from "react";
import {
    Bell,
    BookOpen,
    Cog,
    Database,
    FileCog,
    LibraryBig,
    MessageCircleQuestion,
    Settings2,
    Users,
} from "lucide-react";

import { NavMain } from "@/Components/CustomizedComponents/nav-main";
import { NavUser } from "@/Components/CustomizedComponents/nav-user";
import { NavSecondary } from "@/Components/CustomizedComponents/nav-secondary";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/Components/ui/sidebar";
// import logo from "/Images/favicon_logo_2/favicon-96x96.png";
//C:\Users\niele\OneDrive\Desktop\thesis new\coe_scheduler\Images\coe.png
import logo from "/Images/coe.png";
import { NavTour } from "./nav-tour";

interface User {
    name: string;
    email: string;
    profile_picture: string;
    role: "super-admin" | "admin" | "user";
    theme: "dark" | "light" | "system";
}

const data = {
    navMain: [
        {
            title: "Faculty Loading",
            url: "#",
            icon: LibraryBig,
            items: [
                {
                    title: "Faculty Schedule",
                    url: route("faculty_schedule.index"),
                    className: "text-white",
                },
                {
                    title: "Faculty Workload",
                    url: route("faculty_workload.index"),
                    className: "text-white",
                },
                {
                    title: "Room Schedule",
                    url: route("rooms_schedule.index"),
                    className: "text-white",
                },
                {
                    title: "Search Schedule",
                    url: route("search_schedule.index"),
                    className: "text-white",
                },
            ],
        },
        {
            title: "Faculty Members",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "Add Faculty",
                    url: route("faculties.create"),
                    className: "text-white",
                },
                {
                    title: "View Faculty",
                    url: route("faculties.index"),
                    className: "text-white",
                },
            ],
        },
        {
            title: "Course Management",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Curriculum",
                    url: route("curriculum.index"),
                    className: "text-white",
                },
                {
                    title: "Course Scheduling",
                    url: route("course_scheduling.index"),
                    className: "text-white",
                },
            ],
        },
        {
            title: "Maintenance Management",
            url: "#",
            icon: Cog,
            items: [
                {
                    title: "Room Management",
                    url: route("room_management.index"),
                    className: "text-white",
                },
                {
                    title: "Section Management",
                    url: route("section_management.index"),
                    className: "text-white",
                },
                {
                    title: "Academic Management",
                    url: route("academic_entity_management.index"),
                    className: "text-white",
                },
            ],
        },
        {
            title: "Document Management",
            url: "#",
            icon: FileCog,
            items: [
                {
                    title: "NOTA Content Settings",
                    url: route("edit_nota.index"),
                    className: "text-white",
                },
                {
                    title: "Header & Footer Settings",
                    url: route("customize_pdf.index"),
                    className: "text-white",
                },
            ],
        },
        // {
        //     title: "Reports",
        //     url: "#",
        //     icon: Bell,
        //     items: [
        //         {
        //             title: "Faculty Reports",
        //             url: route("faculty_reports.index"),
        //         },
        //         {
        //             title: "Curriculum Updates",
        //             url: route("curriculums_update.index"),
        //         },
        //     ],
        // },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: route("settings.index"),
            icon: Settings2,
        },
        // {
        //     title: "Notifications",
        //     url: "#",
        //     icon: Bell,
        // },
        {
            title: "Help Center",
            url: route("help_center.index"),
            icon: MessageCircleQuestion,
        },
        {
            title: "System Maintenance",
            url: route("database_backup.index"),
            icon: Database,
        },
    ],
};

export function AppSidebar({
    user,
    ...props
}: { user: User } & React.ComponentProps<typeof Sidebar>) {
    const { role } = user;

    const navMain = data.navMain.filter((item) => {
        if (role === "user") {
            return item.title === "Faculty Loading";
        } else if (role === "admin") {
            //option to filter
            // if (item.title === "System Maintenance") {
            //     item.items = item.items.filter(
            //         (subItem) => subItem.title !== "Curriculum Changes"
            //     );
            // }
            return [
                "Faculty Loading",
                "Faculty Members",
                "Course Management",
                "Maintenance Management",
                "Document Management",
            ].includes(item.title);
        }

        return true;
    });

    const navSecondary = data.navSecondary.filter((item) => {
        if (role === "user" || role === "admin") {
            return ["Settings", "Help Center"].includes(item.title);
        }
        return true;
    });

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex items-center justify-center p-4">
                <div className="flex items-center justify-center rounded-lg aspect-square size-12">
                    <img src={logo} />
                </div>
                <div className="grid flex-1 text-sm leading-tight text-left">
                    <span className="font-semibold truncate">
                        College of Engineering Scheduler
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain userRole={role} items={navMain} />
                {/* <div className="mt-auto">
                    <NavTour user={user} />
                </div> */}
                <NavSecondary items={navSecondary} className="mt-auto" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
