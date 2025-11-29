import React, { useState, useRef, useEffect } from "react";
import { FloorPlan, TimeSchedulingSettings } from "@/types/my_types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import { cn } from "@/lib/utils";
import { Slider } from "@/Components/ui/slider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import SelectYearAndSemester from "./select_year_semester";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import "@/Pages/CourseScheduling/FullCalendarCustom.css";
import "@/Components/CustomizedComponents/room_management/floor_plan.css";
import { Button } from "@/Components/ui/button";
import { CalendarCog, ImageDown, TriangleAlert } from "lucide-react";
import * as htmlToImage from "html-to-image";
import * as XLSX from "xlsx-js-style";
import useTour from "@/Composables/useTour";
import { FaFileExcel } from "react-icons/fa";
import { Label } from "@/Components/ui/label";
import { Toggle } from "@/Components/ui/toggle";
import { toast_error, toast_info } from "@/types/my_types/mytoast";
import { Link } from "@inertiajs/react";

interface PreviewFloorPlanRoomScheduleProps {
    floor_plans: FloorPlan[];
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    userRole: "user" | "admin" | "super-admin";
    userDepartmentId: number;
    period_name: string;
    user: string;
}

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

export function PreviewFloorPlanRoomSchedule({
    userTheme,
    systemTheme,
    floor_plans,
    userRole,
    userDepartmentId,
    period_name,
    user,
}: PreviewFloorPlanRoomScheduleProps) {
    const baseUrl = import.meta.env.VITE_APP_URL;
    const [zoom, setZoom] = useState(() => floor_plans.map(() => 1));
    const [isPanning, setIsPanning] = useState(false);
    const [translate, setTranslate] = useState(() =>
        floor_plans.map(() => ({ x: 0, y: 0 }))
    );
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const [selectedRoomNumber, setSelectedRoomNumber] = useState<string | null>(
        null
    );
    const calendarRef = useRef<FullCalendar>(null);

    useTour({
        user: user,
        name: "showRoomScheduleTour",
        steps: () => [
            {
                title: "🏢 Welcome to Facility Schedule",
                intro: `This page helps you view and manage room schedules efficiently using an <b>interactive floor plan</b>.<br><br>  
                        Let's take a quick tour of the key features.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `📅 <b>Select Academic Year</b><br>  
                        Choose the academic year you want to view. This ensures you are working with the correct schedules and room assignments.`,
                element: document.querySelector("#select-sy") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `⏳ <b>Select Period</b><br>  
                        Pick a specific time period to filter schedules and see which rooms are occupied or available during that timeframe.`,
                element: document.querySelector(
                    "#select-period"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🗺️ <b>Interactive Floor Plan</b><br>  
                        Click on a floor to view detailed room schedules. This feature provides a visual way to check the schedules on this room.`,
                element: document.querySelector(
                    "#facility-floor-plan"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 You're All Set!",
                intro: `That's it! You now know how to use the <b>Facility Schedule</b> page.<br><br>  
                        <b>Explore the interactive floor plan</b> and manage room schedules with ease.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });

    const handleZoomChange = (value: number[], index: number) => {
        const newZoom = value[0] / 100;
        setZoom((prevZoom) => {
            const updatedZoom = [...prevZoom];
            updatedZoom[index] = newZoom;
            return updatedZoom;
        });

        if (newZoom === 1) {
            setTranslate((prevTranslate) => {
                const updatedTranslate = [...prevTranslate];
                updatedTranslate[index] = { x: 0, y: 0 };
                return updatedTranslate;
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        if (zoom[index] > 1) {
            setIsPanning(true);
            lastMousePosition.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e: React.MouseEvent, index: number) => {
        if (!isPanning) return;

        const deltaX = e.clientX - lastMousePosition.current.x;
        const deltaY = e.clientY - lastMousePosition.current.y;

        setTranslate((prev) => {
            const updatedTranslate = [...prev];
            updatedTranslate[index] = {
                x: prev[index].x + deltaX,
                y: prev[index].y + deltaY,
            };
            return updatedTranslate;
        });

        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleMouseLeave = () => {
        setIsPanning(false);
    };

    // Select Component
    const [year, setYear] = useState<string>("");
    const [semester, setSemester] = useState<string>("");

    // Full Calendar
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    // Default settings
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

    // Get schedules
    const areFieldsEmpty = !year || !semester || !selectedRoomNumber;

    const fetchEvents = async () => {
        if (areFieldsEmpty) {
            setEvents([]);
            return;
        }

        try {
            setEventsLoading(true);
            //used axios
            const response = await axios.get(
                `/room_schedule/get_schedules?year=${year}&semester=${semester}&room=${selectedRoomNumber}`
            );

            setEvents(response.data);
            // handleWeekendsVisibility(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setEventsLoading(false);
        }
    };

    // const handleWeekendsVisibility = (events: CalendarEvent[]) => {
    //     const hasWeekendEvents = events.some(
    //         (event) =>
    //             event.daysOfWeek?.includes(0) || event.daysOfWeek?.includes(6)
    //     );
    //     setIsWeekdaysOnly(!hasWeekendEvents);
    // };

    useEffect(() => {
        fetchEvents();
    }, [year, semester, selectedRoomNumber]);

    const formatFacultyName = (name: string): string => {
        const nameParts = name.split(" ");

        if (nameParts.length === 3) {
            // Case: Engr. Raymund Pedro
            return `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2]}`;
        } else if (nameParts.length > 3) {
            // Case: Engr. Raymund Jan Pedro or any other name with more than 3 parts
            return `${nameParts[0]} ${nameParts[1][0]}. ${
                nameParts[nameParts.length - 1]
            }`;
        }

        // Default case: return the name as is
        return name;
    };

    function renderEventContent(eventInfo: any) {
        return (
            <div className="relative flex flex-col overflow-hidden text-small">
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
                                        This schedule conflicts with another
                                        class in this room.
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : null}
                <div className="font-bold text-s">
                    {eventInfo.event.title}
                    {eventInfo.event.extendedProps.label &&
                        ` - ${eventInfo.event.extendedProps.label}`}
                </div>
                <div className="mb-1 text-s">
                    {formatFacultyName(eventInfo.event.extendedProps.teacher)}
                </div>
                <div className="text-s">{eventInfo.timeText}</div>
                <div className="text-s">
                    {eventInfo.event.extendedProps.room}
                </div>
            </div>
        );
    }

    //download schedule as excel
    const downloadSchedule = () => {
        if (!year || !semester || events.length === 0) {
            toast_info({
                message: `No schedule found for ${selectedRoomNumber}.`,
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
            narrow: ["M", "T", "W", "T", "F", "Sat", "Sun"],
        };

        const days = isWeekdaysOnly
            ? dayFormats[dayFormat].slice(0, 5)
            : dayFormats[dayFormat];

        const wsData: any[][] = [
            [`Schedule for ${selectedRoomNumber} `],
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

        events.forEach((event: CalendarEvent) => {
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

                // Clamp to last slot if not found
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

                // Clamp to last slot if not found
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

        const sheetName = `${selectedRoomNumber || "Schedule"}`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const fileName = `${
            selectedRoomNumber || "Schedule"
        }_${semester}_${year}-${Number(year) + 1}.xlsx`;
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
        <div className="w-full max-w-[1280px] mx-auto">
            {floor_plans.length === 0 ? (
                <div className="my-4 text-center">
                    <p className="font-thin text-red-500 text-md">
                        No floor plan are currently available.
                    </p>
                </div>
            ) : (
                <>
                    <SelectYearAndSemester
                        userRole={userRole}
                        userDepartmentId={userDepartmentId}
                        year={year}
                        setYear={setYear}
                        semester={semester}
                        setSemester={setSemester}
                        period_name={period_name}
                    />

                    <Carousel
                        className="w-full h-full max-w-full sm:max-w-[1280px] mx-auto"
                        id="floor_plan_occupied"
                    >
                        <CarouselContent id="floor_plan_occupied_content">
                            {floor_plans.map((floor_plan, index) => {
                                const {
                                    floor_plan_map,
                                    rectangles,
                                    building,
                                    floor,
                                } = floor_plan;

                                const imagePath = floor_plan_map
                                    ? `${baseUrl}/storage/${floor_plan_map}`
                                    : undefined;

                                return (
                                    <CarouselItem key={index}>
                                        {/* building and floor label */}
                                        <span className="block mb-2 text-lg text-center font-small">
                                            {building} - {floor}
                                        </span>
                                        <div
                                            className={cn(
                                                "floor-plan-container",
                                                zoom[index] > 1
                                                    ? "cursor-grab"
                                                    : "cursor-default"
                                            )}
                                            style={{
                                                transform: `translate(${translate[index].x}px, ${translate[index].y}px) scale(${zoom[index]})`,
                                                transition: isPanning
                                                    ? "none"
                                                    : "transform 0.3s ease-in-out",
                                            }}
                                            onMouseDown={(e) =>
                                                handleMouseDown(e, index)
                                            }
                                            onMouseMove={(e) =>
                                                handleMouseMove(e, index)
                                            }
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <img
                                                src={imagePath}
                                                alt={`${building} - Floor ${floor}`}
                                                className="floor-plan-image w-full h-auto mx-auto"
                                            />

                                            <div
                                                className="absolute top-0 left-0 w-full h-full"
                                                id="facility-floor-plan"
                                            >
                                                {rectangles.map((rect) =>
                                                    rect.room_type !==
                                                    "Faculty Room" ? (
                                                        <Dialog key={rect.id}>
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <div
                                                                    className={`absolute flex items-center justify-center text-black text-md border-2 rounded-lg h-12 w-30 touch-none z-10 transition duration-300
                                                                    ${
                                                                        rect.is_active ===
                                                                        0
                                                                            ? "rect_is_not_active border-red-500 bg-red-100 hover:border-red-700 hover:bg-red-300"
                                                                            : "absolute border-2"
                                                                    }
                                                                    ${
                                                                        !year ||
                                                                        !semester
                                                                            ? "cursor-not-allowed opacity-80"
                                                                            : "cursor-pointer"
                                                                    }`}
                                                                    style={{
                                                                        width: `${
                                                                            (rect.width /
                                                                                1280) *
                                                                            100
                                                                        }%`,
                                                                        height: `${
                                                                            (rect.height /
                                                                                720) *
                                                                            100
                                                                        }%`,
                                                                        left: `calc(50% + ${
                                                                            (rect.x /
                                                                                1280) *
                                                                            100
                                                                        }% - ${
                                                                            (rect.width /
                                                                                1280) *
                                                                            50
                                                                        }%)`,
                                                                        top: `calc(${
                                                                            (rect.y /
                                                                                720) *
                                                                            100
                                                                        }% + 1vh)`,
                                                                        position:
                                                                            "absolute",
                                                                        backgroundColor:
                                                                            rect.color,
                                                                        borderColor:
                                                                            rect.borderColor,
                                                                        pointerEvents:
                                                                            !year ||
                                                                            !semester
                                                                                ? "none"
                                                                                : "auto",
                                                                    }}
                                                                    onClick={() =>
                                                                        !year ||
                                                                        !semester
                                                                            ? null
                                                                            : setSelectedRoomNumber(
                                                                                  rect.room_number
                                                                              )
                                                                    }
                                                                >
                                                                    <div className="p-2 text-center">
                                                                        <p
                                                                            className="font-medium text-center"
                                                                            style={{
                                                                                fontSize: `${Math.max(
                                                                                    (rect.height /
                                                                                        720) *
                                                                                        16,
                                                                                    16
                                                                                )}px`,
                                                                            }}
                                                                        >
                                                                            {
                                                                                rect.room_number
                                                                            }
                                                                        </p>
                                                                        {rect.room_type !==
                                                                            "Faculty Room" && (
                                                                            <p
                                                                                className={`text-xs underline text-blue-600 hover:text-blue-800 
                                                                                ${
                                                                                    !year ||
                                                                                    !semester
                                                                                        ? "cursor-not-allowed text-gray-400"
                                                                                        : "cursor-pointer"
                                                                                }
                                                                            `}
                                                                            >
                                                                                View
                                                                                Details
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </DialogTrigger>
                                                            <DialogContent className="w-[90%] sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        <p className="text-2xl text-center sm:text-left">
                                                                            {
                                                                                rect.room_number
                                                                            }
                                                                        </p>
                                                                    </DialogTitle>
                                                                    <div className="flex flex-col lg:flex-row  lg:flex-initial gap-2 lg:gap-0 lg:justify-between">
                                                                        <DialogDescription className="text-center sm:text-left">
                                                                            Details
                                                                            of
                                                                            the
                                                                            scheduled
                                                                            classes
                                                                            in{" "}
                                                                            {
                                                                                building
                                                                            }
                                                                            ,{" "}
                                                                            {
                                                                                floor
                                                                            }{" "}
                                                                            for
                                                                            AY{" "}
                                                                            {
                                                                                year
                                                                            }
                                                                            -
                                                                            {Number(
                                                                                year
                                                                            ) +
                                                                                1}
                                                                            .
                                                                        </DialogDescription>

                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                !events.some(
                                                                                                    (
                                                                                                        eventInfo
                                                                                                    ) =>
                                                                                                        eventInfo.conflict
                                                                                                )
                                                                                            ) {
                                                                                                downloadSchedule();
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center gap-2 ${
                                                                                            events.some(
                                                                                                (
                                                                                                    eventInfo
                                                                                                ) =>
                                                                                                    eventInfo.conflict
                                                                                            )
                                                                                                ? "opacity-50 cursor-not-allowed"
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        <FaFileExcel />
                                                                                        <span>
                                                                                            Download
                                                                                            Excel
                                                                                        </span>
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top">
                                                                                    <p>
                                                                                        {events.some(
                                                                                            (
                                                                                                eventInfo
                                                                                            ) =>
                                                                                                eventInfo.conflict
                                                                                        ) ? (
                                                                                            userRole ===
                                                                                            "user" ? (
                                                                                                <>
                                                                                                    Conflicting
                                                                                                    schedules
                                                                                                    have
                                                                                                    been
                                                                                                    detected.
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    Conflicting
                                                                                                    schedules
                                                                                                    detected.
                                                                                                    Kindly
                                                                                                    resolve
                                                                                                    them
                                                                                                    first
                                                                                                    on
                                                                                                    the{" "}
                                                                                                    <Link
                                                                                                        href={route(
                                                                                                            "course_scheduling.index"
                                                                                                        )}
                                                                                                        className="text-blue-500 underline"
                                                                                                    >
                                                                                                        Course
                                                                                                        Scheduling
                                                                                                        Page
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
                                                                </DialogHeader>
                                                                <div
                                                                    className="overflow-auto"
                                                                    id="rooms_occupied_calendar"
                                                                >
                                                                    <div
                                                                        id="room_title"
                                                                        className="mb-4"
                                                                    >
                                                                        <p className="text-xl lg:text-2xl font-bold text-center">
                                                                            {
                                                                                building
                                                                            }
                                                                            ,{" "}
                                                                            {
                                                                                floor
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                rect.room_number
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex justify-end mb-2 mr-2">
                                                                        <Dialog>
                                                                            <DialogTrigger className="ml-auto">
                                                                                <div
                                                                                    className={`${
                                                                                        userTheme ===
                                                                                        "dark"
                                                                                            ? "hover:bg-gray-700"
                                                                                            : "hover:bg-gray-200"
                                                                                    } p-2 rounded-full hover:bg-gray-100`}
                                                                                >
                                                                                    <CalendarCog />
                                                                                </div>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="w-[90%] lg:w-full">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>
                                                                                        Time
                                                                                        Scheduling
                                                                                        Setting
                                                                                    </DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Customize
                                                                                        Time
                                                                                        Table
                                                                                    </DialogDescription>
                                                                                </DialogHeader>
                                                                                <div>
                                                                                    <div>
                                                                                        <Label htmlFor="day-header-format">
                                                                                            Day
                                                                                            Header
                                                                                            Format
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex gap-2">
                                                                                        <Toggle
                                                                                            id="day-header-format"
                                                                                            variant="outline"
                                                                                            pressed={
                                                                                                dayFormat ===
                                                                                                "long"
                                                                                            }
                                                                                            onPressedChange={() =>
                                                                                                setDayFormat(
                                                                                                    "long"
                                                                                                )
                                                                                            }
                                                                                            className={
                                                                                                dayFormat ===
                                                                                                "long"
                                                                                                    ? "outline-dark"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            Long
                                                                                        </Toggle>
                                                                                        <Toggle
                                                                                            variant="outline"
                                                                                            pressed={
                                                                                                dayFormat ===
                                                                                                "narrow"
                                                                                            }
                                                                                            onPressedChange={() =>
                                                                                                setDayFormat(
                                                                                                    "narrow"
                                                                                                )
                                                                                            }
                                                                                            className={
                                                                                                dayFormat ===
                                                                                                "narrow"
                                                                                                    ? "outline-dark"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            Narrow
                                                                                        </Toggle>
                                                                                        <Toggle
                                                                                            variant="outline"
                                                                                            pressed={
                                                                                                dayFormat ===
                                                                                                "short"
                                                                                            }
                                                                                            onPressedChange={() =>
                                                                                                setDayFormat(
                                                                                                    "short"
                                                                                                )
                                                                                            }
                                                                                            className={
                                                                                                dayFormat ===
                                                                                                "short"
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
                                                                                            Day
                                                                                            View
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex gap-2">
                                                                                        <Toggle
                                                                                            id="day-view"
                                                                                            variant={
                                                                                                "outline"
                                                                                            }
                                                                                            pressed={
                                                                                                isWeekdaysOnly
                                                                                            }
                                                                                            onPressedChange={() =>
                                                                                                handleToggle(
                                                                                                    "weekdays"
                                                                                                )
                                                                                            }
                                                                                            className={
                                                                                                isWeekdaysOnly
                                                                                                    ? "outline-dark"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            Weekdays
                                                                                            Only
                                                                                        </Toggle>
                                                                                        <Toggle
                                                                                            variant={
                                                                                                "outline"
                                                                                            }
                                                                                            pressed={
                                                                                                !isWeekdaysOnly
                                                                                            }
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
                                                                                            Weekdays
                                                                                            And
                                                                                            Weekends
                                                                                        </Toggle>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div>
                                                                                        <Label htmlFor="time-range">
                                                                                            Time
                                                                                            Range
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
                                                                                            6:00
                                                                                            AM
                                                                                            -
                                                                                            9:00
                                                                                            PM
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
                                                                                            8:00
                                                                                            AM
                                                                                            -
                                                                                            5:00
                                                                                            PM
                                                                                        </Toggle>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div>
                                                                                        <Label htmlFor="time-format">
                                                                                            Time
                                                                                            Format
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex gap-2">
                                                                                        <Toggle
                                                                                            id="time-format"
                                                                                            variant="outline"
                                                                                            pressed={
                                                                                                timeFormat ===
                                                                                                false
                                                                                            }
                                                                                            onPressedChange={() =>
                                                                                                setTimeFormat(
                                                                                                    false
                                                                                                )
                                                                                            }
                                                                                            className={
                                                                                                timeFormat ===
                                                                                                false
                                                                                                    ? "outline-dark"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            H:M
                                                                                        </Toggle>
                                                                                        <Toggle
                                                                                            variant="outline"
                                                                                            pressed={
                                                                                                timeFormat ===
                                                                                                true
                                                                                            }
                                                                                            onPressedChange={() =>
                                                                                                setTimeFormat(
                                                                                                    true
                                                                                                )
                                                                                            }
                                                                                            className={
                                                                                                timeFormat ===
                                                                                                true
                                                                                                    ? "outline-dark"
                                                                                                    : ""
                                                                                            }
                                                                                        >
                                                                                            H:M
                                                                                            -
                                                                                            H:M
                                                                                        </Toggle>
                                                                                    </div>
                                                                                </div>
                                                                                <DialogFooter>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        onClick={
                                                                                            resetSettings
                                                                                        }
                                                                                    >
                                                                                        Reset
                                                                                        to
                                                                                        Default
                                                                                    </Button>
                                                                                </DialogFooter>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    </div>

                                                                    <div
                                                                        id="course_scheduling_calendar"
                                                                        className="w-[1000px] lg:w-full mx-auto"
                                                                    >
                                                                        <FullCalendar
                                                                            ref={
                                                                                calendarRef
                                                                            }
                                                                            plugins={[
                                                                                timeGridPlugin,
                                                                                interactionPlugin,
                                                                                listPlugin,
                                                                            ]}
                                                                            initialView="timeGridWeek"
                                                                            headerToolbar={
                                                                                false
                                                                            }
                                                                            eventResizableFromStart={
                                                                                true
                                                                            }
                                                                            allDaySlot={
                                                                                false
                                                                            }
                                                                            stickyHeaderDates={
                                                                                true
                                                                            }
                                                                            expandRows={
                                                                                true
                                                                            }
                                                                            height="100%"
                                                                            slotLabelFormat={{
                                                                                hour: "numeric",
                                                                                minute: "2-digit",
                                                                                omitZeroMinute:
                                                                                    false,
                                                                                meridiem:
                                                                                    "short",
                                                                            }}
                                                                            events={events.map(
                                                                                (
                                                                                    event
                                                                                ) => ({
                                                                                    ...event,
                                                                                    display:
                                                                                        "block",
                                                                                })
                                                                            )}
                                                                            eventContent={
                                                                                renderEventContent
                                                                            }
                                                                            eventOverlap={
                                                                                false
                                                                            }
                                                                            scrollTime="06:00:00"
                                                                            contentHeight="auto"
                                                                            slotEventOverlap={
                                                                                false
                                                                            }
                                                                            dayHeaderFormat={{
                                                                                weekday:
                                                                                    dayFormat,
                                                                            }}
                                                                            slotMaxTime={
                                                                                timeRange.split(
                                                                                    "-"
                                                                                )[1]
                                                                            }
                                                                            slotMinTime={
                                                                                timeRange.split(
                                                                                    "-"
                                                                                )[0]
                                                                            }
                                                                            slotDuration={
                                                                                timeFormat
                                                                                    ? "00:30:00"
                                                                                    : "00:30:00"
                                                                            }
                                                                            slotLabelInterval={
                                                                                timeFormat
                                                                                    ? "00:30:00"
                                                                                    : "01:00:00"
                                                                            }
                                                                            slotLabelContent={
                                                                                timeFormat
                                                                                    ? (
                                                                                          info
                                                                                      ) => {
                                                                                          const start =
                                                                                              info.date.toLocaleTimeString(
                                                                                                  "en-US",
                                                                                                  {
                                                                                                      hour: "numeric",
                                                                                                      minute: "2-digit",
                                                                                                      hour12: true,
                                                                                                  }
                                                                                              );
                                                                                          const endDate =
                                                                                              new Date(
                                                                                                  info.date.getTime() +
                                                                                                      30 *
                                                                                                          60 *
                                                                                                          1000
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
                                                                            hiddenDays={
                                                                                isWeekdaysOnly
                                                                                    ? [
                                                                                          0,
                                                                                          6,
                                                                                      ]
                                                                                    : []
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    ) : (
                                                        <div
                                                            key={rect.id}
                                                            className={`absolute flex items-center justify-center text-black text-md border-2 rounded-lg h-12 w-30 touch-none z-10 transition duration-300
                                                            ${
                                                                rect.is_active ===
                                                                0
                                                                    ? "rect_is_not_active border-red-500 bg-red-100 hover:border-red-700 hover:bg-red-300"
                                                                    : "absolute border-2"
                                                            }
                                                            ${
                                                                !year ||
                                                                !semester
                                                                    ? "cursor-not-allowed opacity-80"
                                                                    : "cursor-default"
                                                            }`}
                                                            style={{
                                                                width: `${
                                                                    (rect.width /
                                                                        1280) *
                                                                    100
                                                                }%`,
                                                                height: `${
                                                                    (rect.height /
                                                                        720) *
                                                                    100
                                                                }%`,
                                                                left: `calc(50% + ${
                                                                    (rect.x /
                                                                        1280) *
                                                                    100
                                                                }% - ${
                                                                    (rect.width /
                                                                        1280) *
                                                                    50
                                                                }%)`,
                                                                top: `calc(${
                                                                    (rect.y /
                                                                        720) *
                                                                    100
                                                                }% + 1vh)`,
                                                                position:
                                                                    "absolute",
                                                                backgroundColor:
                                                                    rect.color,
                                                                borderColor:
                                                                    rect.borderColor,
                                                                pointerEvents:
                                                                    "none",
                                                            }}
                                                        >
                                                            <div className="p-2 text-center">
                                                                <p className="font-medium text-md">
                                                                    {
                                                                        rect.room_number
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* zoom slider */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="w-full max-w-[1280px] mx-auto p-2 rounded-lg shadow-md">
                                                <p className="font-medium">
                                                    Legend:
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                                                        <p>Faculty Room</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                                                        <p>Lecture Room</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-green-500 mr-2"></div>
                                                        <p>Laboratory Room</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-gray-500 mr-2"></div>
                                                        <p>
                                                            Custom Room
                                                            (User-Defined)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end mt-3 mb-1">
                                                <Slider
                                                    defaultValue={[100]}
                                                    max={150}
                                                    min={100}
                                                    step={5}
                                                    onValueChange={(value) =>
                                                        handleZoomChange(
                                                            value,
                                                            index
                                                        )
                                                    }
                                                    className={cn("w-[150px]")}
                                                />
                                                <div className="ml-2">
                                                    {(
                                                        zoom[index] * 100
                                                    ).toFixed(0)}
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </>
            )}
        </div>
    );
}
