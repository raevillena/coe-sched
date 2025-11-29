import { Monitor, Moon, Sun } from "lucide-react";
import { BsFillSunFill } from "react-icons/bs";
import { RiMoonFill } from "react-icons/ri";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useTheme } from "@/Components/CustomizedComponents/theme-provider";
import { Theme } from "@/Components/CustomizedComponents/theme-provider";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRef, useState } from "react";
import { toast_error } from "@/types/my_types/mytoast";
import { router } from "@inertiajs/react";

interface ModeToggleProps {
    userTheme: "dark" | "light" | "system";
}

export function ModeToggle({ userTheme }: ModeToggleProps) {
    const { theme, setTheme } = useTheme();
    const lastChangeTime = useRef(0);
    const cooldownTime = 2000;

    const saveThemeToDatabase = (theme: Theme) => {
        axios
            .post(route("settings.update_theme"), { theme })
            .then((response) => {
                router.reload();
                setTimeout(() => {
                    toast.dismiss();
                    // window.location.reload();
                }, 1000); 
            })
            .catch((error) => {
                toast_error({
                    message: "Error updating theme",
                    userTheme: userTheme,
                });
            });
    };

    const handleThemeChange = (theme: Theme) => {
        // const currentTime = Date.now();
        // if (currentTime - lastChangeTime.current < cooldownTime) {
        //     toast_error({
        //         message:
        //             "Please wait a moment before changing the theme again.",
        //         userTheme: userTheme,
        //     });
        //     return;
        // }
        // lastChangeTime.current = currentTime;

        setTheme(theme);
        saveThemeToDatabase(theme);

        toast.success(
            `${theme.charAt(0).toUpperCase() + theme.slice(1)} mode activated!`,
            {
                icon: theme === "light" ? "🌞" : theme === "dark" ? "🌙" : "🖥️",
                style: {
                    background:
                        theme === "light"
                            ? "#fff"
                            : theme === "dark"
                            ? "#333"
                            : "#e0e0e0",
                    color:
                        theme === "light"
                            ? "#000"
                            : theme === "dark"
                            ? "#fff"
                            : "#000",
                },
            }
        );
    };

    return (
        //old drop down 
        // <div>
        //     <h2 className="text-lg font-semibold text-center flex items-center justify-center">
        //         Theme
        //         <div className="ml-3">
        //             <DropdownMenu>
        //                 <DropdownMenuTrigger asChild>
        //                     <Button variant="outline" size="icon">
        //                         <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        //                         <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        //                         <span className="sr-only">Toggle theme</span>
        //                     </Button>
        //                 </DropdownMenuTrigger>
        //                 <DropdownMenuContent align="end">
        //                     <DropdownMenuItem
        //                         onClick={() => {
        //                             handleThemeChange("light");
        //                         }}
        //                     >
        //                         Light
        //                     </DropdownMenuItem>

        //                     <DropdownMenuItem
        //                         onClick={() => {
        //                             handleThemeChange("dark");
        //                         }}
        //                     >
        //                         Dark
        //                     </DropdownMenuItem>

        //                     <DropdownMenuItem
        //                         onClick={() => {
        //                             handleThemeChange("system");
        //                         }}
        //                     >
        //                         System
        //                     </DropdownMenuItem>
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         </div>
        //     </h2>
        // </div>

        <div className="flex gap-2 p-2 dark:bg-slate-800 bg-gray-100 rounded-xl">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleThemeChange("light")}
                className={`${
                    theme === "light" ? "text-yellow-400" : "dark:text-white text-black"
                } hover:bg-gray-200 dark:hover:bg-slate-700`}
            >
                <BsFillSunFill className="h-5 w-5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleThemeChange("dark")}
                className={`${
                    theme === "dark" ? "text-blue-400" : "dark:text-white text-black"
                } hover:bg-gray-200 dark:hover:bg-slate-700`}
            >
                <RiMoonFill className="h-5 w-5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleThemeChange("system")}
                className={`${
                    theme === "system" ? "text-green-400" : "dark:text-white text-black"
                } hover:bg-gray-200 dark:hover:bg-slate-700`}
            >
                <Monitor className="h-5 w-5" />
            </Button>
        </div>
    );
}
