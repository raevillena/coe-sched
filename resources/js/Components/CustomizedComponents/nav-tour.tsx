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
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { MoreVertical } from "lucide-react";

export function NavTour({
    user,
}: {
    user: {
        name: string;
        email: string;
        profile_picture: string;
    };
}) {
    const { isMobile } = useSidebar();
    const baseUrl = import.meta.env.VITE_APP_URL;
    const [progress, setProgress] = useState(75);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-center relative"
                        >
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                {/* Circular Progress */}
                                <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                    size={45}
                                    thickness={3}
                                    className="absolute"
                                    style={{ color: "green" }}
                                />

                                {/* Profile Image inside the circle */}
                                <Avatar className="h-9 w-9 rounded-lg">
                                    <AvatarImage
                                        src={`${baseUrl}/${user.profile_picture}`}
                                    />
                                    <AvatarFallback>
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    Tour
                                </span>
                                <span className="truncate text-xs">
                                    {progress} % Complete
                                </span>
                            </div>
                            <MoreVertical />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem>
                            <Button onClick={() => setProgress(0)}>
                                Reset Tour
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
