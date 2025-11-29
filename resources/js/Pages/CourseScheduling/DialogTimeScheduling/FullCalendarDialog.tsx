import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { EventContentArg } from "@fullcalendar/core/index.js";
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
import ClockIcon from "../iconforcalendar/ClockIcon";
import { Button } from "@/Components/ui/button";
import Checkbox from "@/Components/Checkbox";
import { CalendarEvent } from "../Timetable";
import DynamicSearchBarRoom from "../inputForAvailableClassesDialog/SearchBarRoom";
import DynamicSearchBarTeacherFullCalendar from "../inputForFullCalendarDialog/FullCalendarSearchBarTeacher";
import ColorPicker from "../iconforcalendar/color_picker";
import { useToast } from "@/hooks/use-toast";
import { toast_error, toast_success } from "@/types/my_types/mytoast";
import axios from "axios";
import { TriangleAlert } from "lucide-react";
import { ClockAlert } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Input } from "@/Components/ui/input";
import InputForLabel from "@/Pages/CourseScheduling/inputForAvailableClassesDialog/InputForLabel";

interface FullCalendarDialogProps {
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    eventInfo: EventContentArg;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    hoverCheckForConflicts: (
        roomToCheck: string,
        dayToCheck: number,
        startTime: string,
        endTime: string,
        eventId: string
    ) => Promise<CalendarEvent[]>;
}

export default function FullCalendarDialog({
    eventInfo,
    events,
    setEvents,
    userTheme,
    systemTheme,
    hoverCheckForConflicts,
}: FullCalendarDialogProps) {
    const { toast } = useToast();
    const [isMainDialogOpen, setIsMainDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [teacher, setteacher] = React.useState<string>("");
    const [room, setRoom] = React.useState<string>("");
    const [label, setLabel] = React.useState<string>("");
    const [days, setDays] = React.useState<number[]>([]);
    const [startHour, setStartHour] = React.useState("00");
    const [startMinute, setStartMinute] = React.useState("00");
    const [startPeriod, setStartPeriod] = React.useState("AM");
    const [endHour, setEndHour] = React.useState("00");
    const [endMinute, setEndMinute] = React.useState("00");
    const [endPeriod, setEndPeriod] = React.useState("AM");
    const [color, setColor] = React.useState<string>(
        eventInfo.event.backgroundColor || ""
    );
    const [errors, setErrors] = React.useState({
        teacher: false,
        room: false,
        time: false,
        days: false,
        timeValidity: "",
    });

    const dayMapping: Record<number, string> = {
        0: "Sun",
        1: "Mon",
        2: "Tues",
        3: "Wed",
        4: "Thurs",
        5: "Fri",
        6: "Sat",
    };

    React.useEffect(() => {
        const ev = eventInfo.event;
        if (!ev) return;
        setteacher(ev.extendedProps.teacher || "");
        setRoom(ev.extendedProps.room || "");
        setLabel(ev.extendedProps.label || "");

        const startDate = ev.start;
        if (startDate) {
            let sHour = startDate.getHours();
            const sPeriod = sHour >= 12 ? "PM" : "AM";
            sHour = sHour % 12 || 12;
            setStartHour(String(sHour));
            setStartMinute(String(startDate.getMinutes()).padStart(2, "0"));
            setStartPeriod(sPeriod);
            setDays([startDate.getDay()]);
        }

        const endDate = ev.end;
        if (endDate) {
            let eHour = endDate.getHours();
            const ePeriod = eHour >= 12 ? "PM" : "AM";
            eHour = eHour % 12 || 12;
            setEndHour(String(eHour));
            setEndMinute(endDate.getMinutes().toString().padStart(2, "0"));
            setEndPeriod(ePeriod);
        }
    }, [eventInfo]);

    // Helper to format time as HH:MM:SS (24-hour)
    function formatTimeToServer(hour: string, minute: string, period: string) {
        let adjustedHour = parseInt(hour, 10);
        if (period === "AM") {
            if (adjustedHour === 12) adjustedHour = 0;
        } else {
            if (adjustedHour !== 12) adjustedHour += 12;
        }
        return `${String(adjustedHour).padStart(2, "0")}:${minute.padStart(
            2,
            "0"
        )}:00`;
    }

    function handleDayCheckboxChange(day: string, checked: boolean) {
        const dayIndex = Object.entries(dayMapping).find(
            ([, v]) => v === day
        )?.[0];
        if (!dayIndex) return;
        const numIndex = parseInt(dayIndex, 10);
        if (checked) {
            setDays((prev) => [...prev, numIndex]);
        } else {
            setDays((prev) => prev.filter((d) => d !== numIndex));
        }
    }

    const validateTime = (start: string, end: string): string => {
        const startDate = new Date(`2023-01-01 ${start}`);
        const endDate = new Date(`2023-01-01 ${end}`);

        const startHour = startDate.getHours();
        const endHour = endDate.getHours();

        // Check for times before 6 AM
        if (startHour < 6) {
            return "Classes cannot be scheduled before 6:00 AM";
        }

        // Check for times after 9 PM (21:00)
        if (endHour >= 21 || (endHour === 21 && endDate.getMinutes() > 0)) {
            return "Classes cannot be scheduled after 9:00 PM";
        }

        // Existing validations
        if (startDate.getTime() === endDate.getTime()) {
            return "Start time and end time cannot be the same";
        }
        if (startDate.getTime() > endDate.getTime()) {
            return "End time cannot be before start time";
        }

        return "";
    };

    async function handleSaveChanges() {
        const to24HourFormat = (h: string, m: string, period: string) => {
            let hourNum = parseInt(h, 10);
            const minuteNum = parseInt(m, 10);
            if (period === "PM" && hourNum < 12) hourNum += 12;
            if (period === "AM" && hourNum === 12) hourNum = 0;
            return `${hourNum.toString().padStart(2, "0")}:${minuteNum
                .toString()
                .padStart(2, "0")}:00`;
        };

        const newStartTime = to24HourFormat(
            startHour,
            startMinute,
            startPeriod
        );
        const newEndTime = to24HourFormat(endHour, endMinute, endPeriod);
        const timeValidityError = validateTime(newStartTime, newEndTime);

        const newErrors = {
            teacher: !teacher,
            room: !room,
            time: startHour === "00" || endHour === "00",
            days: days.length === 0,
            timeValidity: timeValidityError,
        };
        setErrors(newErrors);

        if (
            Object.values(newErrors).some((error) => error) ||
            timeValidityError
        ) {
            toast_error({
                message:
                    timeValidityError || "Please fill in all required fields",
                userTheme: userTheme,
            });
            return;
        }

        try {
            // First, check if teacher exists in database
            const teacherResponse = await axios.get("/check-teacher", {
                params: { teacher: teacher },
            });

            if (!teacherResponse.data.exists) {
                toast_error({
                    message:
                        "This faculty member does not exist in the system. Please register them first on the Add Faculty page.",
                    userTheme: userTheme,
                });
                return;
            }

            // Check if room exists in database before saving
            const roomResponse = await axios.get(route("check-room"), {
                params: { room: room },
            });
            if (!roomResponse.data.exists) {
                toast_error({
                    message:
                        "This room does not exist in the system. Please select a valid room.",
                    userTheme: userTheme,
                });
                return;
            }

            // Get the current day from the original event
            const currentDay = eventInfo.event.start?.getDay();

            // Create the base updated event object
            const baseEvent = {
                id: eventInfo.event.id,
                title: eventInfo.event.title,
                SubjectName: eventInfo.event.extendedProps.SubjectName,
                teacher: teacher,
                room: room,
                label: label,
                startTime: newStartTime,
                endTime: newEndTime,
                color: color,
                section: eventInfo.event.extendedProps.section,
                course: eventInfo.event.extendedProps.course,
                year: eventInfo.event.extendedProps.year,
                semester: eventInfo.event.extendedProps.semester,
            };

            // Store the original room for later conflict resolution
            const originalRoom = eventInfo.event.extendedProps.room;

            // First delete the existing event
            await axios.delete(
                route("course_scheduling.delete", { id: eventInfo.event.id })
            );

            // Then create a new schedule with the updated data
            const response = await axios.post("/course-scheduling/save", {
                ...baseEvent,
                id: `${baseEvent.id}-${Date.now()}`,
                daysOfWeek: days,
            });

            if (response.data.success && response.data.schedules) {
                // Remove the original event
                setEvents((prevEvents) => {
                    return prevEvents.filter(
                        (event) => event.id !== eventInfo.event.id
                    );
                });

                // Add the new events
                setEvents((prevEvents) => [
                    ...prevEvents,
                    ...response.data.schedules,
                ]);

                setIsMainDialogOpen(false);
                toast_success({
                    message: "Schedule has been updated",
                    userTheme: userTheme,
                });
            }
        } catch (error) {
            console.error("Error updating event:", error);
            toast_error({
                message: "Failed to update schedule",
                userTheme: userTheme,
            });
        }
    }

    function handleDeleteConfirm() {
        // Store event details before deletion for conflict resolution
        const deletedEventRoom = eventInfo.event.extendedProps.room;
        const deletedEventYear = eventInfo.event.extendedProps.year;
        const deletedEventSemester = eventInfo.event.extendedProps.semester;

        // Remove from local state
        setEvents((prevEvents) =>
            prevEvents.filter((e) => e.id !== eventInfo.event.id)
        );

        setIsDeleteDialogOpen(false);
        toast({
            title: "Deleted",
            description: `${eventInfo.event.title} has been removed`,
            variant: "destructive",
            duration: 2000,
        });

        // Delete from database and then resolve conflicts
        axios
            .delete(
                route("course_scheduling.delete", { id: eventInfo.event.id })
            )
            .then(() => {
                // After successful deletion, fetch updated schedules for conflict resolution
                return axios.get("/course_scheduling/get_schedules", {
                    params: {
                        year: deletedEventYear,
                        semester: deletedEventSemester,
                        room: deletedEventRoom,
                    },
                });
            })
            .then((response) => {
                // Update all events in the room with fresh conflict statuses
                setEvents((prevEvents) =>
                    prevEvents.map((event) => {
                        const updatedEvent = response.data.find(
                            (e: any) => e.id === event.id
                        );
                        if (updatedEvent) {
                            return {
                                ...event,
                                conflict: updatedEvent.conflict,
                            };
                        }
                        return event;
                    })
                );
            })
            .catch((error) => {
                console.error("Error during delete operation:", error);
            });
    }

    function handleStartPeriodChange(value: string) {
        console.log("handleStartPeriodChange called with value:", value);
        setStartPeriod(value);
        if (value === "PM") {
            setEndPeriod("PM");
        }
    }

    const handleDeleteClick = () => {
        setIsMainDialogOpen(false); // Close main dialog
        setIsDeleteDialogOpen(true); // Open delete dialog
    };

    //hover conflicts
    const [hoverConflicts, setHoverConflicts] = useState<CalendarEvent[]>([]);

    const handleHoverEventConflict = async (
        eventInfo: EventContentArg,
        hoverCheckForConflicts: (
            room: string,
            day: number,
            startTime: string,
            endTime: string,
            eventId: string
        ) => Promise<CalendarEvent[]>,
        setHoverConflicts: React.Dispatch<
            React.SetStateAction<CalendarEvent[]>
        >,
        userTheme: "dark" | "light" | "system",
        systemTheme: boolean
    ) => {
        const { extendedProps } = eventInfo.event;
        const room = extendedProps.room;
        const id = eventInfo.event.id;
        const start = eventInfo.event.start;
        const end = eventInfo.event.end;

        if (!room || !id || !start || !end) {
            console.warn("Missing event details for conflict check.");
            setHoverConflicts([]);
            return;
        }

        const startcdate = new Date(start);
        const endcdate = new Date(end);
        const startTime = `${startcdate.getHours()}:${
            startcdate.getMinutes() === 0 ? "00" : startcdate.getMinutes()
        }:00`;
        const endTime = `${endcdate.getHours()}:${
            endcdate.getMinutes() === 0 ? "00" : endcdate.getMinutes()
        }:00`;
        const day = start.getDay();

        try {
            const conflicts = await hoverCheckForConflicts(
                room,
                day,
                startTime,
                endTime,
                id
            );

            if (conflicts.length > 0) {
                console.log("Conflicts found:", conflicts);
                setHoverConflicts(conflicts);
            } else {
                console.log("No conflicts found.");
                setHoverConflicts([]);
            }
        } catch (error) {
            console.error("Error while checking hover conflicts:", error);
            setHoverConflicts([]);
        }
    };

    const handleMouseEnter = async (eventInfo: EventContentArg) => {
        await handleHoverEventConflict(
            eventInfo,
            hoverCheckForConflicts,
            setHoverConflicts,
            userTheme,
            systemTheme
        );
    };

    const formatTimeDisplay = (timeStr: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <>
            <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
                <DialogTrigger
                    asChild
                    onClick={() => setIsMainDialogOpen(true)}
                >
                    <div className="flex items-center space-x-2 ">
                        <div>
                            {eventInfo.event.extendedProps.conflict ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger
                                            asChild
                                            onMouseEnter={() =>
                                                handleMouseEnter(eventInfo)
                                            }
                                        >
                                            <div className="absolute top-0 right-0 flex p-1 text-red-600 bg-white rounded-full h-fit w-fit">
                                                <TriangleAlert fill="yellow" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="left"
                                            align="center"
                                            className="mt-2"
                                        >
                                            <div
                                                className={`max-w-xs space-y-2 ${
                                                    hoverConflicts.length > 2
                                                        ? "overflow-auto max-h-40"
                                                        : ""
                                                }`}
                                            >
                                                <h4 className="font-bold ">
                                                    Conflicting Schedules (
                                                    {hoverConflicts.length})
                                                </h4>
                                                <ul className="space-y-1">
                                                    {hoverConflicts
                                                        .slice(0, 5)
                                                        .map(
                                                            (
                                                                conflict,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="p-2 border border-red-200 rounded-md bg-red-50"
                                                                >
                                                                    <p className="font-semibold text-red-700">
                                                                        {
                                                                            conflict.title
                                                                        }
                                                                    </p>
                                                                    <div className="text-sm text-red-600">
                                                                        <p>
                                                                            Section:{" "}
                                                                            {
                                                                                conflict.section
                                                                            }
                                                                        </p>
                                                                        <p>
                                                                            Time:{" "}
                                                                            {typeof conflict.startTime ===
                                                                            "string"
                                                                                ? formatTimeDisplay(
                                                                                      conflict.startTime
                                                                                  )
                                                                                : ""}{" "}
                                                                            -{" "}
                                                                            {typeof conflict.endTime ===
                                                                            "string"
                                                                                ? formatTimeDisplay(
                                                                                      conflict.endTime
                                                                                  )
                                                                                : ""}
                                                                        </p>
                                                                        <p>
                                                                            Instructor:{" "}
                                                                            {
                                                                                conflict.teacher
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                ""
                            )}
                            <div className="font-bold text-s">
                                {eventInfo.event.title}
                                {eventInfo.event.extendedProps.label &&
                                    ` - ${eventInfo.event.extendedProps.label}`}
                            </div>
                            <div className="mb-1 text-s">
                                {eventInfo.event.extendedProps.teacher}
                            </div>

                            <div className="text-s">{eventInfo.timeText}</div>
                            <div className="text-s">
                                {eventInfo.event.extendedProps.room}
                            </div>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="w-[90%] lg:w-full p-7">
                    <DialogHeader>
                        <DialogTitle>{eventInfo.event.title}</DialogTitle>
                        <DialogDescription>
                            {eventInfo.event.extendedProps.SubjectName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-2">
                        <div className="grid items-center grid-cols-4 gap-1">
                            <DynamicSearchBarTeacherFullCalendar
                                teacherId="TeacherSearch"
                                className="col-span-4"
                                setteacher={setteacher}
                                teacher={teacher}
                            />
                            {errors.teacher && (
                                <span className="col-span-4 text-sm text-red-500">
                                    Please select a teacher
                                </span>
                            )}
                        </div>

                        <div>
                            <DialogDescription className="text-sm font-medium leading-none cursor-default text-white-500">
                                Day
                            </DialogDescription>
                            <div className="grid grid-cols-7 mt-1">
                                {[
                                    "Mon",
                                    "Tues",
                                    "Wed",
                                    "Thurs",
                                    "Fri",
                                    "Sat",
                                    "Sun",
                                ].map((day) => {
                                    const dayIndex = Object.entries(
                                        dayMapping
                                    ).find(([, v]) => v === day)?.[0];
                                    const numIndex = dayIndex
                                        ? parseInt(dayIndex, 10)
                                        : null;

                                    return (
                                        <div
                                            key={day}
                                            className="flex flex-col items-center"
                                        >
                                            <Label
                                                htmlFor={day}
                                                className="text-xs font-medium"
                                            >
                                                {day}
                                            </Label>
                                            {/* Checkbox */}
                                            <Checkbox
                                                id={day}
                                                className="w-5 h-5"
                                                checked={
                                                    numIndex !== null &&
                                                    days.includes(numIndex)
                                                }
                                                onChange={(e) => {
                                                    if (numIndex !== null) {
                                                        handleDayCheckboxChange(
                                                            day,
                                                            e.target.checked
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.days && (
                                <div className="mt-1">
                                    <span className="text-sm text-red-500">
                                        Please select at least one day
                                    </span>
                                </div>
                            )}
                        </div>

                        {/*/////////////////////////////// START TIME //////////////////////////////*/}
                        <div className="grid grid-cols-2 ">
                            <div>
                                <DialogDescription className="text-sm font-medium leading-none cursor-default text-white-500">
                                    Start Time
                                </DialogDescription>
                                <div className="grid items-center gap-4 mt-[-30px]">
                                    <div className="flex flex-col items-center gap-2">
                                        <Label
                                            htmlFor="hour-select"
                                            className="text-xs font-medium"
                                        >
                                            &nbsp;
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Hour */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                Hour
                                            </Label>

                                            {/* Hour Select */}
                                            <Select
                                                value={startHour}
                                                onValueChange={(v) =>
                                                    setStartHour(v)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="hour-select"
                                                    className="w-fit"
                                                >
                                                    <SelectValue placeholder="0" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Array.from(
                                                            {
                                                                length: 12,
                                                            },
                                                            (_, i) => (
                                                                <SelectItem
                                                                    key={i + 1}
                                                                    value={`${
                                                                        i + 1
                                                                    }`}
                                                                >
                                                                    {i + 1}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Hour */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                Minutes
                                            </Label>
                                            <Select
                                                value={startMinute}
                                                onValueChange={(v) =>
                                                    setStartMinute(v)
                                                }
                                            >
                                                <SelectTrigger className="w-fit">
                                                    <SelectValue placeholder="00" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {[
                                                            "15",
                                                            "30",
                                                            "45",
                                                            "00",
                                                        ].map((minute) => (
                                                            <SelectItem
                                                                key={minute}
                                                                value={minute}
                                                            >
                                                                {minute}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Hour */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                Period
                                            </Label>

                                            <Select
                                                value={startPeriod}
                                                onValueChange={(v) =>
                                                    handleStartPeriodChange(v)
                                                }
                                            >
                                                <SelectTrigger className="w-fit">
                                                    <SelectValue placeholder="AM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="AM">
                                                            AM
                                                        </SelectItem>
                                                        <SelectItem value="PM">
                                                            PM
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Clock */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                &nbsp;
                                            </Label>
                                            <ClockIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-auto">
                                {/*/////////////////////////////// END TIME //////////////////////////////*/}
                                <DialogDescription className="text-sm font-medium leading-none cursor-default text-white-500">
                                    End Time
                                </DialogDescription>
                                <div className="grid items-center gap-4 mt-[-30px]">
                                    <div className="flex flex-col items-center gap-2">
                                        <Label
                                            htmlFor="hour-select"
                                            className="text-xs font-medium"
                                        >
                                            &nbsp;
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Hour */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                Hour
                                            </Label>

                                            {/* Hour Select */}
                                            <Select
                                                value={endHour}
                                                onValueChange={(v) =>
                                                    setEndHour(v)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="hour-select"
                                                    className="w-fit"
                                                >
                                                    <SelectValue placeholder="0" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Array.from(
                                                            {
                                                                length: 12,
                                                            },
                                                            (_, i) => (
                                                                <SelectItem
                                                                    key={i + 1}
                                                                    value={`${
                                                                        i + 1
                                                                    }`}
                                                                >
                                                                    {i + 1}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Hour */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                Minutes
                                            </Label>
                                            <Select
                                                value={endMinute}
                                                onValueChange={(v) =>
                                                    setEndMinute(v)
                                                }
                                            >
                                                <SelectTrigger className="w-fit">
                                                    <SelectValue placeholder="00" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {[
                                                            "15",
                                                            "30",
                                                            "45",
                                                            "00",
                                                        ].map((minute) => (
                                                            <SelectItem
                                                                key={minute}
                                                                value={minute}
                                                            >
                                                                {minute}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Hour */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                Period
                                            </Label>

                                            <Select
                                                value={endPeriod}
                                                onValueChange={(v) =>
                                                    setEndPeriod(v)
                                                }
                                            >
                                                <SelectTrigger className="w-fit">
                                                    <SelectValue placeholder="AM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="AM">
                                                            AM
                                                        </SelectItem>
                                                        <SelectItem value="PM">
                                                            PM
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            {/* Label for Clock */}
                                            <Label
                                                htmlFor="hour-select"
                                                className="text-xs font-medium"
                                            >
                                                &nbsp;
                                            </Label>
                                            <ClockIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4 mt-2">
                                <div>
                                    {errors.time && (
                                        <span className="text-sm text-red-500">
                                            Please set valid start and end times
                                        </span>
                                    )}
                                </div>
                                <div>
                                    {errors.timeValidity && (
                                        <span className="text-sm text-red-500">
                                            {errors.timeValidity}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid items-center grid-cols-4 gap-1">
                            <DynamicSearchBarRoom
                                roomId="RoomSearch"
                                className="col-span-4 text-s"
                                room={room}
                                setRoom={setRoom}
                                selectedDays={days}
                                startTime={formatTimeToServer(
                                    startHour,
                                    startMinute,
                                    startPeriod
                                )}
                                endTime={formatTimeToServer(
                                    endHour,
                                    endMinute,
                                    endPeriod
                                )}
                                year={eventInfo.event.extendedProps.year}
                                semester={
                                    eventInfo.event.extendedProps.semester
                                }
                                course={eventInfo.event.extendedProps.course}
                            />
                            {errors.room && (
                                <span className="col-span-4 text-sm text-red-500">
                                    Please select a room
                                </span>
                            )}
                        </div>

                        {/* <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="label" className="text-left">
                                Label
                            </Label>
                            <Input
                                id="label"
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="col-span-4"
                                placeholder="Enter a label (optional)"
                                autoComplete="off"
                            />
                        </div> */}

                        <InputForLabel label={label} setLabel={setLabel} />
                    </div>

                    <div className="flex items-center">
                        <Label htmlFor="select_color_calendar" className="mr-2">
                            Color
                        </Label>
                        <ColorPicker
                            id="select_color_calendar"
                            value={color}
                            onChange={setColor}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Button>
                        <Button type="submit" onClick={handleSaveChanges}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            {eventInfo.event.title}? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            No, Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                        >
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
