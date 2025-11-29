"use client";

import { LogOut } from "lucide-react";
import { Method } from "@inertiajs/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/Components/ui/sidebar";
import { Link } from "@inertiajs/react";

export function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        profile_picture: string;
        theme: "dark" | "light" | "system";
    };
}) {
    const { isMobile } = useSidebar();
    const baseUrl = import.meta.env.VITE_APP_URL;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {/* <Avatar className="w-8 h-8 text-gray-900 rounded-lg"> */}
                            <Avatar className={`w-8 h-8 rounded-lg ${user.theme === 'dark' ? '' : 'text-gray-900'}`}>
                                {user.profile_picture ? (
                                    <AvatarImage
                                        src={`${baseUrl}/storage/${user.profile_picture}`}
                                        alt={user.name}
                                    />
                                ) : (
                                    <AvatarFallback className="rounded-lg">
                                        {(() => {
                                            const nameParts =
                                                user.name.split(" ");
                                            const firstInitial =
                                                nameParts[1]
                                                    ?.charAt(0)
                                                    .toUpperCase() || ""; // e.g., "N" (from Nathaniel)
                                            const secondInitial =
                                                nameParts[2]
                                                    ?.charAt(0)
                                                    .toUpperCase() || ""; // e.g., "T" (from T.)

                                            return `${firstInitial}${secondInitial}`;
                                        })()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="grid flex-1 text-sm leading-tight text-left">
                                <span className="font-semibold truncate">
                                    {user.name}
                                </span>
                                <span className="text-xs truncate">
                                    {user.email}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem>
                            <Link
                                href={route("logout")}
                                method={Method.POST}
                                as="button"
                                className="flex items-center space-x-2"
                            >
                                <LogOut />
                                <span>Log Out</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
