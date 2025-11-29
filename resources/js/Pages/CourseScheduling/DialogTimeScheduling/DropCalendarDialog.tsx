import React from "react";
import { toast_error, toast_success } from "@/types/my_types/mytoast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import ClockIcon from "../iconforcalendar/ClockIcon";
import { Button } from "@/Components/ui/button";
import DynamicSearchBarRoom from "../inputForAvailableClassesDialog/SearchBarRoom";
import Checkbox from "@/Components/Checkbox";
import DynamicSearchBarTeacher from "../inputForAvailableClassesDialog/SearchBarTeacher";
import { CalendarEvent } from "../Timetable";
import ColorPicker from "../iconforcalendar/color_picker";
import axios from "axios";
import InputForLabel from "../inputForAvailableClassesDialog/InputForLabel";

interface DropCalendarDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    dropInfo: {
        date: Date;
        title: string;
        id: string;
        SubjectName: string;
        color: string;
    };
    section: string;
    year: string;
    semester: string;
    course: string;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
}

export default function DropCalendarDialog({
    isOpen,
    onClose,
    onSave,
    dropInfo,
    section,
    year,
    semester,
    course,
    userTheme,
    systemTheme,
}: DropCalendarDialogProps) {
    const [teacher, setteacher] = React.useState<string>("");
    const [room, setRoom] = React.useState<string>("");
    const [label, setLabel] = React.useState<string>("");
    const [days, setDays] = React.useState<number[]>([dropInfo.date.getDay()]);
    const [color, setColor] = React.useState<string>(dropInfo.color);
    const [isLoading, setIsLoading] = React.useState(false);

    // Time state
    const [startHour, setStartHour] = React.useState(() => {
        const hour = dropInfo.date.getHours() % 12 || 12;
        return String(hour);
    });
    const [startMinute, setStartMinute] = React.useState(() => {
        return String(dropInfo.date.getMinutes()).padStart(2, "0");
    });
    const [startPeriod, setStartPeriod] = React.useState(() => {
        return dropInfo.date.getHours() >= 12 ? "PM" : "AM";
    });

    const endDate = new Date(dropInfo.date.getTime() + 60 * 60 * 1000); // Default 1 hour duration
    const [endHour, setEndHour] = React.useState(() => {
        const hour = endDate.getHours() % 12 || 12;
        return String(hour);
    });
    const [endMinute, setEndMinute] = React.useState(() => {
        return String(endDate.getMinutes()).padStart(2, "0");
    });
    const [endPeriod, setEndPeriod] = React.useState(() => {
        return endDate.getHours() >= 12 ? "PM" : "AM";
    });

    const [errors, setErrors] = React.useState({
        teacher: false,
        room: false,
        time: false,
        days: false,
        timeValidity: "",
    });

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

    const validateTime = (start: string, end: string): string => {
        const startDate = new Date(`2023-01-01 ${start}`);
        const endDate = new Date(`2023-01-01 ${end}`);

        if (startDate.getTime() === endDate.getTime()) {
            return "Start time and end time cannot be the same";
        }
        if (startDate.getTime() > endDate.getTime()) {
            return "End time cannot be before start time";
        }
        return "";
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

            // Create the event object with all selected days
            const newEvent = {
                id: `${dropInfo.id}-${Date.now()}-${days[0]}`,
                title: dropInfo.title,
                SubjectName: dropInfo.SubjectName,
                startTime: setstartTime,
                endTime: setendTime,
                daysOfWeek: days,
                color: color,
                teacher: teacher,
                room: room,
                section: section,
                course: course,
                year: year,
                semester: semester,
                label: label,
            };

            // Send data to backend
            const response = await axios.post(
                "/course-scheduling/save",
                newEvent
            );

            if (response.data.success) {
                // Handle the case where multiple schedules are returned
                if (response.data.schedules) {
                    // Call onSave with each returned schedule
                    response.data.schedules.forEach(
                        (schedule: CalendarEvent) => {
                            onSave(schedule);
                        }
                    );
                }

                toast_success({
                    message: `Successfully added ${dropInfo.title}`,
                    userTheme: userTheme,
                });
                onClose();
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

    const checkForRoomConflicts = async (
        roomToCheck: string,
        daysToCheck: number[],
        startTimeToCheck: string,
        endTimeToCheck: string
    ): Promise<boolean> => {
        try {
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
            if (!dbEvents || dbEvents.length === 0) return false;

            const startMinutes = convertTimeToMinutes(startTimeToCheck);
            const endMinutes = convertTimeToMinutes(endTimeToCheck);

            for (const event of dbEvents) {
                if (!event.daysOfWeek) continue;

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

                const hasOverlappingDays = daysToCheck.some((day) =>
                    eventDays.includes(day)
                );

                if (!hasOverlappingDays) continue;

                const existingStartMinutes = convertTimeToMinutes(
                    event.startTime
                );
                const existingEndMinutes = convertTimeToMinutes(event.endTime);

                if (
                    (startMinutes < existingEndMinutes &&
                        endMinutes > existingStartMinutes) ||
                    (existingStartMinutes < endMinutes &&
                        existingEndMinutes > startMinutes)
                ) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error checking for room conflicts:", error);
            return false;
        }
    };

    const convertTimeToMinutes = (timeStr: string): number => {
        if (!timeStr) return 0;
        if (timeStr && typeof timeStr === "string" && timeStr.includes(":")) {
            const parts = timeStr.split(":");
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            return hours * 60 + minutes;
        }
        try {
            const date = new Date(timeStr);
            if (!isNaN(date.getTime())) {
                return date.getHours() * 60 + date.getMinutes();
            }
        } catch (e) {
            console.error("Could not parse time:", timeStr);
        }
        return 0;
    };

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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[90%] lg:w-full p-7">
                <DialogHeader>
                    <DialogTitle>{dropInfo.title}</DialogTitle>
                    <DialogDescription>
                        {dropInfo.SubjectName}
                    </DialogDescription>
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
                                    <Label
                                        htmlFor={day}
                                        className="text-xs font-medium"
                                    >
                                        {day}
                                    </Label>
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
                                        <Label
                                            htmlFor="hour-select"
                                            className="text-xs font-medium"
                                        >
                                            Hour
                                        </Label>
                                        <Select
                                            value={startHour}
                                            onValueChange={setStartHour}
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
                                                        { length: 12 },
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
                                        <Label
                                            htmlFor="minute-select"
                                            className="text-xs font-medium"
                                        >
                                            Minutes
                                        </Label>
                                        <Select
                                            value={startMinute}
                                            onValueChange={setStartMinute}
                                        >
                                            <SelectTrigger
                                                id="minute-select"
                                                className="w-fit"
                                            >
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
                                        <Label
                                            htmlFor="period-select"
                                            className="text-xs font-medium"
                                        >
                                            Period
                                        </Label>
                                        <Select
                                            value={startPeriod}
                                            onValueChange={setStartPeriod}
                                        >
                                            <SelectTrigger
                                                className="w-fit"
                                                id="period-select"
                                            >
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
                                        <Label
                                            htmlFor="hour-select"
                                            className="text-xs font-medium"
                                        >
                                            Hour
                                        </Label>
                                        <Select
                                            value={endHour}
                                            onValueChange={setEndHour}
                                        >
                                            <SelectTrigger className="w-fit">
                                                <SelectValue placeholder="0" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Array.from(
                                                        { length: 12 },
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
                                        <Label
                                            htmlFor="minute-select"
                                            className="text-xs font-medium"
                                        >
                                            Minutes
                                        </Label>
                                        <Select
                                            value={endMinute}
                                            onValueChange={setEndMinute}
                                        >
                                            <SelectTrigger
                                                className="w-fit"
                                                id="minute-select"
                                            >
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
                                        <Label
                                            htmlFor="period-select"
                                            className="text-xs font-medium"
                                        >
                                            Period
                                        </Label>
                                        <Select
                                            value={endPeriod}
                                            onValueChange={setEndPeriod}
                                        >
                                            <SelectTrigger
                                                className="w-fit"
                                                id="period-select"
                                            >
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
                    </div>

                    {errors.time && (
                        <span className="text-sm text-red-500">
                            Please select a valid start and end time
                        </span>
                    )}
                    {errors.timeValidity && (
                        <span className="text-sm text-red-500">
                            {errors.timeValidity}
                        </span>
                    )}

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
