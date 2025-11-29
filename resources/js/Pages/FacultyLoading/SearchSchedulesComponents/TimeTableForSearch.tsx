import React, { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "@/Pages/CourseScheduling/FullCalendarCustom.css";
import { Button } from "@/Components/ui/button";

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
import { CalendarCog, Printer, TriangleAlert } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import { TimeSchedulingSettings } from "@/types/my_types";
import { Label } from "@/Components/ui/label";
import { Toggle } from "@/Components/ui/toggle";
import axios from "axios";
import debounce from "lodash.debounce";
import { toast_info } from "@/types/my_types/mytoast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import FullCalendarDialog from "@/Pages/CourseScheduling/DialogTimeScheduling/FullCalendarDialog";
import { FaFileExcel } from "react-icons/fa";
import { Link } from "@inertiajs/react";

type TimetableProps = {
    year: string;
    semester: string;
    search: string;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    userRole: "user" | "admin" | "super-admin";
};

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string | Date;
    endTime: string | Date;
    SubjectName: string;
    color: string;
    room: string;
    teacher: string;
    daysOfWeek?: number[];
    section: string;
    course: string;
    year: string;
    semester: string;
    conflict: boolean;
    label: string;
}

export default function TimeTableForSearch({
    year,
    semester,
    search,
    userTheme,
    systemTheme,
    userRole,
}: TimetableProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const searchRef = useRef(search);

    const areFieldsEmpty = !year || !semester;

    // Debounced search handler
    const fetchEvents = useCallback(
        debounce(async () => {
            if (areFieldsEmpty || !searchRef.current) {
                setEvents([]);
                return;
            }

            try {
                setEventsLoading(true);

                const response = await axios.get("getSearchedSchedules", {
                    params: {
                        year,
                        semester,
                        search: searchRef.current,
                    },
                });

                setEvents(response.data);
                // console.log("Fetched events:", response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents([]);
            } finally {
                setEventsLoading(false);
            }
        }, 300),
        [year, semester, areFieldsEmpty]
    );

    //trigger debounce
    useEffect(() => {
        searchRef.current = search; //keep search term in sync with the latest input
        fetchEvents();

        //cleanup function to cancel debounce on unmount
        return () => fetchEvents.cancel();
    }, [year, semester, search, fetchEvents]);

    //////////////////toggle logic///////////////////////
    const defaultSettings: TimeSchedulingSettings = {
        dayFormat: "long",
        isWeekdaysOnly: false,
        timeRange: "06:00:00-21:00:00",
        timeFormat: false,
        timeSnap: "00:30:00",
    };

    const loadSettings = (): TimeSchedulingSettings => {
        const savedSettings = localStorage.getItem("timeSchedulingSettings");
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    };

    const [dayFormat, setDayFormat] = useState<"long" | "short" | "narrow">(
        loadSettings().dayFormat
    );
    const [isWeekdaysOnly, setIsWeekdaysOnly] = useState<boolean>(
        loadSettings().isWeekdaysOnly
    );
    const [timeRange, setTimeRange] = useState<string>(
        loadSettings().timeRange
    );
    const [timeFormat, setTimeFormat] = useState<boolean>(
        loadSettings().timeFormat
    );
    const [timeSnap, setTimeSnap] = useState<string>(loadSettings().timeSnap);

    useEffect(() => {
        const settings: TimeSchedulingSettings = {
            dayFormat,
            isWeekdaysOnly,
            timeRange,
            timeFormat,
            timeSnap,
        };
        localStorage.setItem(
            "timeSchedulingSettings",
            JSON.stringify(settings)
        );
    }, [dayFormat, isWeekdaysOnly, timeRange, timeFormat, timeSnap]);

    const handleToggle = (toggleType: string) => {
        setIsWeekdaysOnly(toggleType === "weekdays");
    };

    const handleTimeRangeToggle = (range: string) => {
        setTimeRange(range);
    };

    const resetSettings = () => {
        setDayFormat(defaultSettings.dayFormat);
        setIsWeekdaysOnly(defaultSettings.isWeekdaysOnly);
        setTimeRange(defaultSettings.timeRange);
        setTimeFormat(defaultSettings.timeFormat);
        setTimeSnap(defaultSettings.timeSnap);
    };

    const formatFacultyName = (name: string): string => {
        const nameParts = name.split(" ");

        if (nameParts.length === 3) {
            return `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2]}`;
        } else if (nameParts.length > 3) {
            return `${nameParts[0]} ${nameParts[1][0]}. ${
                nameParts[nameParts.length - 1]
            }`;
        }
        return name;
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <div className="flex flex-col overflow-hidden text-small">
                {eventInfo.event.extendedProps.conflict ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="absolute top-0 right-0 flex p-1 text-red-600 bg-white rounded-full h-fit w-fit">
                                    <TriangleAlert fill="yellow" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                side="left"
                                align="center"
                                className="mt-2"
                            >
                                <div className="max-w-xs space-y-2">
                                    <h4 className="font-bold">
                                        Conflicting Schedule
                                    </h4>
                                    <div className="text-sm">
                                        {userRole === "user" ? (
                                            <>
                                                This schedule conflicts with
                                                another class in the same room.
                                            </>
                                        ) : (
                                            <>
                                                This schedule conflicts with
                                                another class in the same room.
                                            </>
                                        )}
                                    </div>
                                    {userRole !== "user" && (
                                        <div>
                                            Kindly resolve them first on the{" "}
                                            <Link
                                                href={route(
                                                    "course_scheduling.index"
                                                )}
                                                className="text-blue-500 underline"
                                            >
                                                Course Scheduling Page
                                            </Link>
                                            .
                                        </div>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : null}
                <div className="font-bold text-s">{eventInfo.event.title}</div>
                <div className="text-s">
                    {eventInfo.event.extendedProps.section}{" "}
                    {eventInfo.event.extendedProps.label &&
                        `(${eventInfo.event.extendedProps.label})`}
                </div>

                <div className="mb-1 font-sans font-bold text-s">
                    {formatFacultyName(eventInfo.event.extendedProps.teacher)}
                </div>
                <div className="text-s">
                    {eventInfo.event.extendedProps.room}
                </div>
            </div>
        );
    };

    //download schedule as excel
    const downloadScheduleAsExcel = () => {
        if (!year || !semester) {
            toast_info({
                message: `Kindly verify that the schedule data is available and the search criteria have been entered correctly.`,
                userTheme: userTheme,
            });
            return;
        } else if (events.length === 0) {
            toast_info({
                message: `No schedule data available.`,
                userTheme: userTheme,
            });
            return;
        }

        const workbook = XLSX.utils.book_new();

        const [startHour, startMinute] = timeRange
            .split("-")[0]
            .split(":")
            .map(Number);
        const [endHour, endMinute] = timeRange
            .split("-")[1]
            .split(":")
            .map(Number);

        const timeSlots: { timeSlot24: string; timeSlotAMPM: string }[] = [];
        let hour = startHour;
        let minute = startMinute;

        while (hour < endHour || (hour === endHour && minute < endMinute)) {
            const nextMinute = (minute + 30) % 60;
            const nextHour = minute + 30 >= 60 ? hour + 1 : hour;

            const formattedTime24 = (h: number, m: number) => {
                const paddedHour = h.toString().padStart(2, "0");
                const paddedMinute = m.toString().padStart(2, "0");
                return `${paddedHour}:${paddedMinute}`;
            };

            const formattedTimeAMPM = (h: number, m: number) => {
                const period = h >= 12 ? "PM" : "AM";
                const adjustedHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
                const paddedMinute = m.toString().padStart(2, "0");
                return `${adjustedHour}:${paddedMinute} ${period}`;
            };

            const timeSlot24 = `${formattedTime24(
                hour,
                minute
            )}-${formattedTime24(nextHour, nextMinute)}`;
            const timeSlotAMPM = `${formattedTimeAMPM(
                hour,
                minute
            )}-${formattedTimeAMPM(nextHour, nextMinute)}`;

            timeSlots.push({ timeSlot24, timeSlotAMPM });
            hour = nextHour;
            minute = nextMinute;
        }

        const dayFormats = {
            long: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            short: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            narrow: ["M", "T", "W", "T", "F", "S", "Sun"],
        };

        const days = isWeekdaysOnly
            ? dayFormats[dayFormat].slice(0, 5)
            : dayFormats[dayFormat];

        const wsData: any[][] = [
            ["Schedule for " + (searchRef.current || "Searched Schedule")],
            [`${semester}, Academic Year ${year} - ${Number(year) + 1}`],
            ["Time", ...days],
        ];

        timeSlots.forEach((slot) => {
            const timeSlot = timeFormat
                ? slot.timeSlotAMPM
                : slot.timeSlotAMPM.split("-")[0];
            wsData.push([timeSlot, ...new Array(days.length).fill("")]);
        });

        function isTimeInRange(time: string, slot: string, isEnd = false) {
            const [slotStart, slotEnd] = slot.split("-");
            if (isEnd) {
                return time > slotStart && time <= slotEnd;
            }
            return time >= slotStart && time < slotEnd;
        }

        events.forEach((event: any) => {
            const daysArray = Array.isArray(event.daysOfWeek)
                ? event.daysOfWeek
                : JSON.parse(event.daysOfWeek || "[]");

            daysArray.forEach((dayNum: number) => {
                let col: number | undefined = undefined;
                if (isWeekdaysOnly) {
                    if (dayNum >= 1 && dayNum <= 5) {
                        col = dayNum - 1;
                    } else {
                        return;
                    }
                } else {
                    col = dayNum === 0 ? 6 : dayNum - 1;
                }
                if (col === undefined || col < 0 || col >= days.length) return;

                const rowIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(event.startTime.toString(), slot.timeSlot24)
                );
                const endIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(
                        event.endTime.toString(),
                        slot.timeSlot24,
                        true
                    )
                );

                const safeRowIndex =
                    rowIndexRaw !== -1 ? rowIndexRaw + 3 : timeSlots.length + 2;
                const safeEndIndex =
                    endIndexRaw !== -1 ? endIndexRaw + 3 : timeSlots.length + 3;

                if (safeRowIndex > 0) {
                    const cellText = `${event.title}\n  ${event.section} ${
                        event.label ? ` (${event.label})` : ""
                    }\n  ${event.room}`;
                    wsData[safeRowIndex][col + 1] = cellText;

                    for (let r = safeRowIndex + 1; r < safeEndIndex; r++) {
                        wsData[r][col + 1] = "";
                    }
                }
            });
        });

        const worksheet = XLSX.utils.aoa_to_sheet(wsData);

        wsData[2].forEach((_, colIndex) => {
            const headerCell = XLSX.utils.encode_cell({ r: 2, c: colIndex });
            if (!worksheet[headerCell]) worksheet[headerCell] = {};
            worksheet[headerCell].s = {
                font: { bold: true, sz: 12 },
                alignment: { vertical: "center", horizontal: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        });

        worksheet["!merges"] = worksheet["!merges"] || [];
        worksheet["!merges"].push({
            s: { r: 0, c: 0 },
            e: { r: 0, c: days.length },
        });
        worksheet["!merges"].push({
            s: { r: 1, c: 0 },
            e: { r: 1, c: days.length },
        });

        timeSlots.forEach((_, rowIndex) => {
            const timeCell = XLSX.utils.encode_cell({ r: rowIndex + 3, c: 0 });
            if (!worksheet[timeCell]) worksheet[timeCell] = {};
            worksheet[timeCell].s = {
                font: { bold: true, sz: 12 },
                alignment: { vertical: "center", horizontal: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        });

        Object.keys(worksheet).forEach((key) => {
            if (key[0] === "!") return;
            if (!worksheet[key].s) worksheet[key].s = {};
            worksheet[key].s.border = {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            };
        });

        ["A1", "A2"].forEach((cellAddress) => {
            if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
            worksheet[cellAddress].s = {
                font: { bold: true, sz: 16 },
                alignment: { vertical: "center", horizontal: "center" },
            };
        });

        events.forEach((event: any) => {
            const daysArray = Array.isArray(event.daysOfWeek)
                ? event.daysOfWeek
                : JSON.parse(event.daysOfWeek || "[]");

            daysArray.forEach((dayNum: number) => {
                let col: number | undefined = undefined;
                if (isWeekdaysOnly) {
                    if (dayNum >= 1 && dayNum <= 5) {
                        col = dayNum - 1;
                    } else {
                        return;
                    }
                } else {
                    col = dayNum === 0 ? 6 : dayNum - 1;
                }
                if (col === undefined || col < 0 || col >= days.length) return;

                const rowIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(event.startTime.toString(), slot.timeSlot24)
                );
                const endIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(
                        event.endTime.toString(),
                        slot.timeSlot24,
                        true
                    )
                );

                const safeRowIndex =
                    rowIndexRaw !== -1 ? rowIndexRaw + 3 : timeSlots.length + 2;
                const safeEndIndex =
                    endIndexRaw !== -1 ? endIndexRaw + 3 : timeSlots.length + 3;

                if (safeRowIndex > 0) {
                    const cellColor = event.color?.replace("#", "") || "FFFFFF";
                    const numberOfRows = safeEndIndex - safeRowIndex;
                    if (numberOfRows > 1) {
                        if (!worksheet["!merges"]) worksheet["!merges"] = [];
                        worksheet["!merges"].push({
                            s: { r: safeRowIndex, c: col + 1 },
                            e: { r: safeEndIndex - 1, c: col + 1 },
                        });

                        for (let r = safeRowIndex; r < safeEndIndex; r++) {
                            const cellAddress = XLSX.utils.encode_cell({
                                r,
                                c: col + 1,
                            });
                            if (!worksheet[cellAddress])
                                worksheet[cellAddress] = {};
                            worksheet[cellAddress].s = {
                                fill: {
                                    patternType: "solid",
                                    fgColor: { rgb: cellColor },
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center",
                                    wrapText: true,
                                },
                                font: {
                                    name: "Calibri",
                                    sz: 12,
                                    bold: true,
                                    color: { rgb: "FFFFFF" },
                                },
                                border: {
                                    top: {
                                        style: "thin",
                                        color: { rgb: "000000" },
                                    },
                                    bottom: {
                                        style: "thin",
                                        color: { rgb: "000000" },
                                    },
                                    left: {
                                        style: "thin",
                                        color: { rgb: "000000" },
                                    },
                                    right: {
                                        style: "thin",
                                        color: { rgb: "000000" },
                                    },
                                },
                            };
                        }
                    }
                }
            });
        });

        worksheet["!cols"] = Array(8).fill({ wch: 25 });
        worksheet["!rows"] = wsData.map(() => ({ hpx: 35 }));

        const sheetName = `${searchRef.current} Schedule`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const fileName = `${searchRef.current}_Schedule_${semester}_${year}-${
            Number(year) + 1
        }.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    const isTimeInRange = (time: string, range: string): boolean => {
        const [start, end] = range.split("-").map(formatTimeToMinutes);
        const timeMinutes = formatTimeToMinutes(time);
        return timeMinutes >= start && timeMinutes < end;
    };

    const formatTimeToMinutes = (timeStr: string): number => {
        const [hour, minutes] = timeStr.split(":").map(Number);
        return hour * 60 + minutes;
    };
    //end of download schedule

    return (
        <div className="w-full">
            <div className="w-full">
                <div className="flex items-center justify-end gap-2">
                    <div className="flex mb-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={() => {
                                            if (
                                                !events.some(
                                                    (eventInfo) =>
                                                        eventInfo.conflict
                                                )
                                            ) {
                                                downloadScheduleAsExcel();
                                            }
                                        }}
                                        className={
                                            events.some(
                                                (eventInfo) =>
                                                    eventInfo.conflict
                                            )
                                                ? "opacity-50 cursor-not-allowed"
                                                : "flex items-center gap-2 mt-4 lg:mt-0"
                                        }
                                    >
                                        <FaFileExcel />
                                        Download Excel
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>
                                        {events.some(
                                            (eventInfo) => eventInfo.conflict
                                        ) ? (
                                            userRole === "user" ? (
                                                <>
                                                    Conflicting schedules have
                                                    been detected.
                                                </>
                                            ) : (
                                                <>
                                                    Conflicting schedules
                                                    detected. Kindly resolve
                                                    them first on the{" "}
                                                    <Link
                                                        href={route(
                                                            "course_scheduling.index"
                                                        )}
                                                        className="text-blue-500 underline"
                                                    >
                                                        Course Scheduling Page
                                                    </Link>
                                                    .
                                                </>
                                            )
                                        ) : (
                                            "Schedule Calendar Template"
                                        )}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex lg:mb-3">
                        <Dialog>
                            <DialogTrigger className="ml-auto">
                                <div
                                    className={`${
                                        userTheme === "dark"
                                            ? "hover:bg-gray-700"
                                            : "hover:bg-gray-200"
                                    } p-2 rounded-full`}
                                >
                                    <CalendarCog />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Time Scheduling Setting
                                    </DialogTitle>
                                    <DialogDescription>
                                        Customize Time Table
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
                                            onPressedChange={() =>
                                                setDayFormat("long")
                                            }
                                            className={
                                                dayFormat === "long"
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            Long
                                        </Toggle>
                                        <Toggle
                                            variant="outline"
                                            pressed={dayFormat === "narrow"}
                                            onPressedChange={() =>
                                                setDayFormat("narrow")
                                            }
                                            className={
                                                dayFormat === "narrow"
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            Narrow
                                        </Toggle>
                                        <Toggle
                                            variant="outline"
                                            pressed={dayFormat === "short"}
                                            onPressedChange={() =>
                                                setDayFormat("short")
                                            }
                                            className={
                                                dayFormat === "short"
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            Short
                                        </Toggle>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Label htmlFor="day-view">
                                            Day View
                                        </Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Toggle
                                            id="day-view"
                                            variant={"outline"}
                                            pressed={isWeekdaysOnly}
                                            onPressedChange={() =>
                                                handleToggle("weekdays")
                                            }
                                            className={
                                                isWeekdaysOnly
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            Weekdays Only
                                        </Toggle>
                                        <Toggle
                                            variant={"outline"}
                                            pressed={!isWeekdaysOnly}
                                            onPressedChange={() =>
                                                handleToggle(
                                                    "weekdaysAndWeekends"
                                                )
                                            }
                                            className={
                                                isWeekdaysOnly
                                                    ? ""
                                                    : "outline-dark"
                                            }
                                        >
                                            Weekdays And Weekends
                                        </Toggle>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Label htmlFor="time-range">
                                            Time Range
                                        </Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Toggle
                                            id="time-range"
                                            variant="outline"
                                            pressed={
                                                timeRange ===
                                                "06:00:00-21:00:00"
                                            }
                                            onPressedChange={() =>
                                                handleTimeRangeToggle(
                                                    "06:00:00-21:00:00"
                                                )
                                            }
                                            className={
                                                timeRange ===
                                                "06:00:00-21:00:00"
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            6:00 AM - 9:00 PM
                                        </Toggle>
                                        <Toggle
                                            variant="outline"
                                            pressed={
                                                timeRange ===
                                                "08:00:00-17:00:00"
                                            }
                                            onPressedChange={() =>
                                                handleTimeRangeToggle(
                                                    "08:00:00-17:00:00"
                                                )
                                            }
                                            className={
                                                timeRange ===
                                                "08:00:00-17:00:00"
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            8:00 AM - 5:00 PM
                                        </Toggle>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Label htmlFor="time-format">
                                            Time Format
                                        </Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Toggle
                                            id="time-format"
                                            variant="outline"
                                            pressed={timeFormat === false}
                                            onPressedChange={() =>
                                                setTimeFormat(false)
                                            }
                                            className={
                                                timeFormat === false
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            H:M
                                        </Toggle>
                                        <Toggle
                                            variant="outline"
                                            pressed={timeFormat === true}
                                            onPressedChange={() =>
                                                setTimeFormat(true)
                                            }
                                            className={
                                                timeFormat === true
                                                    ? "outline-dark"
                                                    : ""
                                            }
                                        >
                                            H:M - H:M
                                        </Toggle>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={resetSettings}
                                    >
                                        Reset to Default
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div>
                    {eventsLoading ? (
                        <div className="flex items-center justify-center h-[600px]">
                            <div className="flex items-center justify-center h-48">
                                <div className="w-12 h-12 border-b-2 border-blue-700 rounded-full animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-auto">
                            <div
                                id="course_scheduling_calendar"
                                className="w-[1000px] lg:w-full mx-auto"
                            >
                                <FullCalendar
                                    plugins={[
                                        timeGridPlugin,
                                        interactionPlugin,
                                        listPlugin,
                                    ]}
                                    initialView="timeGridWeek"
                                    editable={false}
                                    droppable={false}
                                    selectable={false}
                                    headerToolbar={false}
                                    snapDuration={timeSnap}
                                    events={events.map((event) => ({
                                        ...event,
                                        display: "block",
                                        editable: false,
                                    }))}
                                    eventContent={renderEventContent}
                                    slotMinTime={timeRange.split("-")[0]}
                                    slotMaxTime={timeRange.split("-")[1]}
                                    allDaySlot={false}
                                    dayHeaderFormat={{
                                        weekday: dayFormat,
                                    }}
                                    slotDuration={
                                        timeFormat ? "00:30:00" : "00:30:00"
                                    }
                                    slotLabelInterval={
                                        timeFormat ? "00:30:00" : "01:00:00"
                                    }
                                    slotLabelContent={
                                        timeFormat
                                            ? (info) => {
                                                  const start =
                                                      info.date.toLocaleTimeString(
                                                          "en-US",
                                                          {
                                                              hour: "numeric",
                                                              minute: "2-digit",
                                                              hour12: true,
                                                          }
                                                      );
                                                  const endDate = new Date(
                                                      info.date.getTime() +
                                                          30 * 60 * 1000
                                                  );
                                                  const end =
                                                      endDate.toLocaleTimeString(
                                                          "en-US",
                                                          {
                                                              hour: "numeric",
                                                              minute: "2-digit",
                                                              hour12: true,
                                                          }
                                                      );
                                                  return `${start} - ${end}`;
                                              }
                                            : null
                                    }
                                    slotLabelFormat={{
                                        hour: "numeric",
                                        minute: "2-digit",
                                        omitZeroMinute: false,
                                        meridiem: "short",
                                    }}
                                    eventOverlap={false}
                                    height="auto"
                                    scrollTime="06:00:00"
                                    contentHeight="auto"
                                    hiddenDays={isWeekdaysOnly ? [0, 6] : []}
                                    listDaySideFormat={false}
                                    slotEventOverlap={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
