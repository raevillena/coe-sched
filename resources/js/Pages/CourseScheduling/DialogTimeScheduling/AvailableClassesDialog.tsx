import React from "react";
import { toast_error, toast_success } from "@/types/my_types/mytoast";
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
import DynamicSearchBarRoom from "../inputForAvailableClassesDialog/SearchBarRoom";
import Checkbox from "@/Components/Checkbox";
import DynamicSearchBarTeacher from "../inputForAvailableClassesDialog/SearchBarTeacher";
import { CalendarEvent } from "../Timetable";
import ColorPicker from "../iconforcalendar/color_picker";
import axios from "axios"; // Import axios for making HTTP requests
import { Input } from "@/Components/ui/input";
import InputForLabel from "../inputForAvailableClassesDialog/InputForLabel";

interface Class {
    id: string;
    title: string;
    SubjectName: string;
    color: string;
}

interface AvailableClassesDialogProps {
    cls: Class;
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    section: string;
    year: string;
    semester: string;
    course: string;
    children: React.ReactNode; // Add this line
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
}

export default function AvailableClassesDialog({
    cls,
    events,
    setEvents,
    section,
    year,
    semester,
    course,
    children, // Add this line
    userTheme,
    systemTheme,
}: AvailableClassesDialogProps) {
    const [teacher, setteacher] = React.useState<string>(""); // Store teacher
    const [room, setRoom] = React.useState<string>(""); // Store room
    const [label, setLabel] = React.useState<string>(""); // Store label
    const [days, setDays] = React.useState<number[]>([]); // Store days
    const [isOpen, setIsOpen] = React.useState(false);
    const [color, setColor] = React.useState<string>(cls.color); // Store color

    // Add useEffect to sync color when cls.color changes
    React.useEffect(() => {
        setColor(cls.color);
    }, [cls.color]);

    // Store start and end time as separate state
    const [startHour, setStartHour] = React.useState("00");
    const [startMinute, setStartMinute] = React.useState("00");
    const [startPeriod, setStartPeriod] = React.useState("AM");
    const [endHour, setEndHour] = React.useState("00");
    const [endMinute, setEndMinute] = React.useState("00");
    const [endPeriod, setEndPeriod] = React.useState("AM");

    const [errors, setErrors] = React.useState({
        teacher: false,
        room: false,
        time: false,
        days: false,
        timeValidity: "", // Add this new error state
    });

    const [isLoading, setIsLoading] = React.useState(false); // Add loading state

    // Modify the validateTime function
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

    // Helper function to convert time string (HH:MM:SS) to minutes for easy comparison
    const convertTimeToMinutes = (timeStr: string): number => {
        // Handle various time formats
        let hours = 0;
        let minutes = 0;

        // Handle "HH:MM:SS" format
        if (timeStr && typeof timeStr === "string" && timeStr.includes(":")) {
            const parts = timeStr.split(":");
            hours = parseInt(parts[0], 10);
            minutes = parseInt(parts[1], 10);
        }
        // If it's not a string with colons, try to parse as Date
        else if (timeStr) {
            try {
                const date = new Date(timeStr);
                if (!isNaN(date.getTime())) {
                    hours = date.getHours();
                    minutes = date.getMinutes();
                }
            } catch (e) {
                console.error("Could not parse time:", timeStr);
            }
        }

        return hours * 60 + minutes;
    };

    // Check for room conflicts with events from database
    const checkForRoomConflicts = async (
        roomToCheck: string,
        daysToCheck: number[],
        startTimeToCheck: string,
        endTimeToCheck: string
    ): Promise<boolean> => {
        try {
            // Fetch all events with the same year, semester, and room from the database
            const response = await axios.get(
                "/course_scheduling/get_schedules",
                {
                    params: {
                        year: year,
                        semester: semester,
                        room: roomToCheck,
                    },
                }
            );

            const dbEvents = response.data;

            // If no events with this room, there's no conflict
            if (!dbEvents || dbEvents.length === 0) return false;

            // Convert times to minutes for the new event
            const startMinutes = convertTimeToMinutes(startTimeToCheck);
            const endMinutes = convertTimeToMinutes(endTimeToCheck);

            // Check each existing event for conflicts
            for (const event of dbEvents) {
                // Skip if it's comparing with itself or if the event has no daysOfWeek
                if (!event.daysOfWeek) continue;

                // Parse daysOfWeek from database (which might be stored as a string)
                let eventDays: number[];
                if (typeof event.daysOfWeek === "string") {
                    try {
                        eventDays = JSON.parse(event.daysOfWeek);
                    } catch (e) {
                        console.error(
                            "Failed to parse daysOfWeek:",
                            event.daysOfWeek
                        );
                        continue;
                    }
                } else {
                    eventDays = event.daysOfWeek;
                }

                // Check if there's any day overlap
                const hasOverlappingDays = daysToCheck.some((day) =>
                    eventDays.includes(day)
                );

                if (!hasOverlappingDays) continue;

                // Get start and end time in minutes for the existing event
                const existingStartMinutes = convertTimeToMinutes(
                    event.startTime
                );
                const existingEndMinutes = convertTimeToMinutes(event.endTime);

                // Check for time overlap
                if (
                    (startMinutes < existingEndMinutes &&
                        endMinutes > existingStartMinutes) ||
                    (existingStartMinutes < endMinutes &&
                        existingEndMinutes > startMinutes)
                ) {
                    return true; // Conflict found
                }
            }

            // No conflicts found
            return false;
        } catch (error) {
            console.error("Error checking for room conflicts:", error);
            // In case of error, assume there might be a conflict to be safe
            return false;
        }
    };

    const handleSave = async () => {
        const setstartTime = formatTime(startHour, startMinute, startPeriod);
        const setendTime = formatTime(endHour, endMinute, endPeriod);
        const timeValidityError = validateTime(setstartTime, setendTime);

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

        setIsLoading(true);

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
                setIsLoading(false);
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

            // If teacher exists, proceed with saving the event
            const newEvent = {
                id: `${cls.id}-${Date.now()}-${days[0]}`,
                title: cls.title,
                SubjectName: cls.SubjectName,
                startTime: setstartTime,
                endTime: setendTime,
                daysOfWeek: days,
                color: color,
                teacher: teacher,
                room: room,
                section: section,
                course: course,
                year: String(year),
                semester: semester,
                label: label,
            };

            const response = await axios.post(
                "/course-scheduling/save",
                newEvent
            );

            if (response.data.success) {
                if (response.data.schedules) {
                    setEvents((prevEvents) => [
                        ...prevEvents,
                        ...response.data.schedules,
                    ]);
                }

                toast_success({
                    message: `Successfully added ${cls.title}`,
                    userTheme: userTheme,
                });

                // Reset form fields
                setStartHour("00");
                setStartMinute("00");
                setStartPeriod("AM");
                setEndHour("00");
                setEndMinute("00");
                setEndPeriod("AM");
                setteacher("");
                setRoom("");
                setDays([]);
                setIsOpen(false);
            }
        } catch (error: any) {
            console.error("Error saving schedule:", error);
            let errorMsg = "Failed to save schedule";

            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }

            toast_error({
                message: errorMsg,
                userTheme: userTheme,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to format time as HH:MM:SS (24-hour)
    function formatTime(hour: string, minute: string, period: string) {
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

    const dayMapping: Record<string, number> = {
        Mon: 1,
        Tues: 2,
        Wed: 3,
        Thurs: 4,
        Fri: 5,
        Sat: 6,
        Sun: 0,
    };

    function handleDayCheckboxChange(day: string, checked: boolean) {
        const dayIndex = dayMapping[day];
        if (checked) {
            setDays((prevDays) => [...prevDays, dayIndex]);
        } else {
            setDays((prevDays) => prevDays.filter((d) => d !== dayIndex));
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} key={cls.id}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-[90%] lg:w-full p-7">
                <DialogHeader>
                    <DialogTitle>{cls.title}</DialogTitle>
                    <DialogDescription>{cls.SubjectName}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-2">
                    <div className="grid items-center grid-cols-4 gap-1">
                        <DynamicSearchBarTeacher
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

                    {/* //////////////////////Day///////////////////// */}
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
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="flex flex-col items-center"
                                >
                                    {/* Day Label */}
                                    <Label
                                        htmlFor={day}
                                        className="text-xs font-medium"
                                    >
                                        {day}
                                    </Label>
                                    {/* Checkbox */}
                                    <Checkbox
                                        id={day}
                                        checked={days.includes(dayMapping[day])}
                                        onChange={(e) =>
                                            handleDayCheckboxChange(
                                                day,
                                                e.target.checked
                                            )
                                        }
                                        className="w-5 h-5"
                                    />
                                </div>
                            ))}
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
                    <div className="grid grid-cols-2">
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
                                            onValueChange={(val) =>
                                                setStartHour(val)
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
                                            onValueChange={(val) =>
                                                setStartMinute(val)
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
                                                setStartPeriod(v)
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
                                            className="text-xs font-medium "
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
                                        className="text-xs font-medium "
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
                                            onValueChange={(val) =>
                                                setEndHour(val)
                                            }
                                        >
                                            <SelectTrigger
                                                id="hour-select"
                                                className="w-fit "
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
                                            onValueChange={(val) =>
                                                setEndMinute(val)
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
                                            onValueChange={(val) =>
                                                setEndPeriod(val)
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
                            startTime={formatTime(
                                startHour,
                                startMinute,
                                startPeriod
                            )}
                            endTime={formatTime(endHour, endMinute, endPeriod)}
                            year={year}
                            semester={semester}
                            course={course}
                        />
                        {errors.room && (
                            <span className="col-span-4 text-sm text-red-500">
                                Please select a room
                            </span>
                        )}
                    </div>

                    <InputForLabel label={label} setLabel={setLabel} />
                </div>

                <div className="flex items-center">
                    <Label htmlFor="select_color" className="mr-2">
                        Color
                    </Label>
                    <ColorPicker
                        id="select_color"
                        value={color}
                        onChange={setColor}
                    />
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Add"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
