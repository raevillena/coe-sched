import React from "react";
import { Toggle } from "@/Components/ui/toggle";
import { TbTableOptions } from "react-icons/tb";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import "@/Pages/FacultyLoading/FacultySchedulesComponents/FacultyCalendar.css";

interface TableSettingsProps {
    userTheme: "dark" | "light" | "system";
    dayFormat: "long" | "short" | "narrow";
    setDayFormat: (format: "long" | "short" | "narrow") => void;
    resetSettings?: () => void;
    disabled?: boolean;
}

export default function TableSettings({
    userTheme,
    dayFormat,
    setDayFormat,
    resetSettings,
    disabled = false,
}: TableSettingsProps) {
    return (
        <div>
            <Dialog>
                <DialogTrigger
                    className="ml-auto"
                    disabled={disabled}
                    id="edit-workload-settings"
                >
                    <div
                        className={`${
                            userTheme === "dark"
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-200"
                        } p-2 rounded-full ${
                            disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <TbTableOptions size={24} />
                    </div>
                </DialogTrigger>
                <DialogContent className="w-[90%] lg:w-full">
                    <DialogHeader>
                        <DialogTitle>Workload Table Setting</DialogTitle>
                        <DialogDescription>
                            Customize Workload Table
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <div>
                            <Label htmlFor="day-header-format">
                                Day Header Format
                            </Label>
                        </div>
                        <div className="flex gap-2">
                            <Toggle
                                id="day-header-format"
                                variant="outline"
                                pressed={dayFormat === "long"}
                                onPressedChange={() => setDayFormat("long")}
                                className={
                                    dayFormat === "long" ? "outline-dark" : ""
                                }
                            >
                                Long
                            </Toggle>
                            <Toggle
                                variant="outline"
                                pressed={dayFormat === "narrow"}
                                onPressedChange={() => setDayFormat("narrow")}
                                className={
                                    dayFormat === "narrow" ? "outline-dark" : ""
                                }
                            >
                                Narrow
                            </Toggle>
                            <Toggle
                                variant="outline"
                                pressed={dayFormat === "short"}
                                onPressedChange={() => setDayFormat("short")}
                                className={
                                    dayFormat === "short" ? "outline-dark" : ""
                                }
                            >
                                Short
                            </Toggle>
                        </div>
                    </div>
                    {resetSettings && (
                        <DialogFooter>
                            <Button variant="outline" onClick={resetSettings}>
                                Reset to Default
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
