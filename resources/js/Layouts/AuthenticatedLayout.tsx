import { router, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/CustomizedComponents/app-sidebar";
import { ThemeProvider } from "@/Components/CustomizedComponents/theme-provider";
import { Separator } from "@/Components/ui/separator";
import MyBreadCrumbs from "@/Components/CustomizedComponents/main-breadcrumbs";
import { Theme } from "@/Components/CustomizedComponents/theme-provider";
import toast, { Toaster } from "react-hot-toast";
import { toast_success } from "@/types/my_types/mytoast";
import mmsu_logo from "../../../Images/mmsu.png";

interface BreadcrumbItemProps {
    title: string;
    link: string;
}

interface AuthenticatedLayoutProps {
    header?: ReactNode;
    user: {
        id: number;
        name: string;
        email: string;
        department_id: number;
        role: "super-admin" | "admin" | "user";
        profile_picture: string;
        theme: Theme;
    };
    breadcrumbs?: BreadcrumbItemProps[];
}

interface EventResponse {
    user_id: number;
    message: string;
    backup_file: string;
}

export default function AuthenticatedLayout({
    header,
    breadcrumbs,
    children,
}: PropsWithChildren<AuthenticatedLayoutProps>) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role;
    const loggedInUser = {
        ...auth?.user,
        theme: (auth?.user?.theme as Theme) ?? "light",
    } as const;

    const userTheme = loggedInUser?.theme as Theme;

    //clean up toast
    useEffect(() => {
        return () => {
            toast.dismiss();
            toast.remove();
        };
    }, []);

    return (
        <ThemeProvider theme={userTheme || "light"} storageKey="vite-ui-theme">
            {/* toaster */}
            <div>
                <Toaster position="top-right" />
            </div>

            {/* sidebar */}
            <SidebarProvider>
                <AppSidebar role={userRole} user={loggedInUser} />
                <SidebarInset className="hide_scrollbar">
                    <header className="flex items-center h-16 gap-2 px-4 shrink-0">
                        <SidebarTrigger className="-ml-1" />

                        <Separator
                            orientation="vertical"
                            className="h-4 mr-2"
                        />

                        {breadcrumbs && (
                            <MyBreadCrumbs breadcrumbs={breadcrumbs} />
                        )}

                        <Separator
                            orientation="vertical"
                            className="h-4 mr-2"
                        />

                        <div
                            className="ml-auto flex items-center h-10 px-5 rounded-l-xl"
                            style={{
                                background:
                                    "linear-gradient(90deg, #00743B 0%, #FFD700 100%)",
                                minWidth: "180px",
                                maxWidth: "250px",
                                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
                                opacity: 0.95,
                            }}
                        >
                            {/* MMSU logo */}
                            <img
                                src={mmsu_logo}
                                alt="MMSU Logo"
                                className="mr-3 w-8 h-8 object-contain drop-shadow-md bg-white rounded-full p-1"
                                style={{ background: "white" }}
                            />
                            <span className="text-white font-extrabold text-lg tracking-widest drop-shadow-sm">
                                MMSU
                            </span>
                        </div>
                    </header>
                    <div className="flex flex-col flex-1 gap-0 p-10 pt-10">
                        {header}
                        <div className="w-full h-full">{children}</div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
