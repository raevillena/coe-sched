import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DashboardProps } from "@/types/my_types";
import { DashboardSelectYear } from "@/Components/CustomizedComponents/user_dashboard/DashboardSelectYear";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect, useCallback } from "react";
import "@/Pages/CourseScheduling/FullCalendarCustom.css";
import { PinIcon, CalendarCog } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Toggle } from "@/Components/ui/toggle";
import { ModeToggle } from "@/Components/CustomizedComponents/mode-toggle";
import axios from "axios";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import useTour from "@/Composables/useTour";

interface CalendarSettings {
    dayFormat: "long" | "short" | "narrow";
    isWeekdaysOnly: boolean;
    timeRange: string;
    timeFormat: boolean;
}

interface SavedSettings {
    [semester: string]: CalendarSettings;
}

export default function Dashboard({
    auth,
    breadcrumbs,
    period_name,
}: DashboardProps) {
    const userTheme = auth?.user.theme;

    useTour({
        user: auth.user,
        name: "showUserDashboardTalk",
        steps: () => [
            {
                title: "Welcome to the College of Engineering Scheduler!",
                intro: `We're delighted to have you here, <b>${auth?.user?.name}</b>!<br><br> 
                            This platform is designed to help you efficiently manage your academic schedule.  
                            Let's take a quick tour to familiarize you with all the features available.<br><br>  
                            <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `🔽 <b>Select Academic Year</b><br>  
                        View your schedule by choosing the appropriate academic year. Make sure to select the correct year to avoid any confusion.`,
                element: document.querySelector("#select-ay") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📅 <b>Schedule Calendar</b><br>
                       Access a calendar view of your daily subject schedule for the selected academic year and semester. This section provides a clear overview of your class timetable.`,
                element: document.querySelector(
                    "#view-schedule"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🌗 <b>Mode Toggle</b><br>  
                        Use this option to switch between light and dark mode based on your preference.`,
                element: document.querySelector("#mode-toggle") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 You're All Set!",
                intro: `That's it for the tour! You are now familiar with the key features of the <b>College of Engineering Scheduler</b> dashboard.<br><br>  
                            <b>Feel free to explore</b> and make the most of the platform. If you ever need assistance, we're here to help.<br><br>  
                            <i>Happy scheduling!</i> <b>- RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });

    const [selectedYear, setSelectedYear] = useState<string>("");
    const [periods, setPeriods] = useState<any[]>([]);
    const [events, setEvents] = useState<{ [key: string]: any[] }>({});
    const [loading, setLoading] = useState(false);
    const [pinnedCalendar, setPinnedCalendar] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>(
        {}
    );
    const formatTime = (timeStr: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // --- Hover conflict state for dashboard tooltips ---
    const [hoverConflicts, setHoverConflicts] = useState<any[]>([]);
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

    // --- Hover conflict check logic (copied/adapted from FullCalendarDialog) ---
    const handleDashboardHoverConflict = async (eventInfo: any) => {
        setHoveredEventId(eventInfo.event.id);
        setHoverConflicts([]);
        const ext = eventInfo.event.extendedProps;
        const room = ext.room;
        const id = eventInfo.event.id;
        const start = eventInfo.event.start;
        const end = eventInfo.event.end;
        const year = ext.year;
        const semester = ext.semester;
        if (!room || !id || !start || !end) return;
        const startcdate = new Date(start);
        const endcdate = new Date(end);
        const startTime = `${startcdate.getHours()}:${startcdate
            .getMinutes()
            .toString()
            .padStart(2, "0")}:00`;
        const endTime = `${endcdate.getHours()}:${endcdate
            .getMinutes()
            .toString()
            .padStart(2, "0")}:00`;
        const day = startcdate.getDay();
        try {
            const response = await axios.get(
                "/course_scheduling/get_schedules",
                {
                    params: { year, semester, room },
                }
            );
            const roomEvents = response.data;
            // Find conflicts (same logic as Timetable hoverCheckForConflicts)
            const conflicts = roomEvents.filter((event: any) => {
                if (event.id === id) return false;
                let eventDays: number[] = Array.isArray(event.daysOfWeek)
                    ? event.daysOfWeek
                    : typeof event.daysOfWeek === "string"
                    ? JSON.parse(event.daysOfWeek)
                    : [];
                if (!eventDays.includes(day)) return false;
                const [sh, sm] = event.startTime.split(":").map(Number);
                const [eh, em] = event.endTime.split(":").map(Number);
                const [csh, csm] = startTime.split(":").map(Number);
                const [ceh, cem] = endTime.split(":").map(Number);
                const startMin = sh * 60 + sm;
                const endMin = eh * 60 + em;
                const cstartMin = csh * 60 + csm;
                const cendMin = ceh * 60 + cem;
                return (
                    (cstartMin < endMin && cendMin > startMin) ||
                    (startMin < cendMin && endMin > cstartMin)
                );
            });
            setHoverConflicts(conflicts);
        } catch (error) {
            setHoverConflicts([]);
        }
    };

    // Calendar settings state
    const defaultSettings: CalendarSettings = {
        dayFormat: "long",
        isWeekdaysOnly: false,
        timeRange: "08:00:00-17:00:00",
        timeFormat: true,
    };

    const [calendarSettings, setCalendarSettings] = useState<SavedSettings>({});

    useEffect(() => {
        axios
            .get(route("control.get_periods", { period_name }))
            .then((response) => {
                setPeriods(response.data);

                setCalendarSettings((prevSettings) => {
                    const newSettings = { ...prevSettings };
                    response.data.forEach((period: any) => {
                        if (!newSettings[period.period_name]) {
                            newSettings[period.period_name] = defaultSettings;
                        }
                    });
                    return newSettings;
                });
            })
            .catch((error) => console.error("Error fetching periods:", error));
    }, []);

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem("dashboardCalendarSettings");
        if (savedSettings) {
            setCalendarSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Save settings to localStorage when they change
    useEffect(() => {
        localStorage.setItem(
            "dashboardCalendarSettings",
            JSON.stringify(calendarSettings)
        );
    }, [calendarSettings]);

    const updateCalendarSettings = (
        semester: string,
        settings: CalendarSettings
    ) => {
        setCalendarSettings((prev) => ({
            ...prev,
            [semester]: settings,
        }));
    };

    const handleDialogOpen = (semester: string, open: boolean) => {
        setDialogOpen((prev) => ({
            ...prev,
            [semester]: open,
        }));
    };

    const memoizedHandleFormatChange = useCallback(
        (semester: string, format: "long" | "short" | "narrow") => {
            updateCalendarSettings(semester, {
                ...calendarSettings[semester],
                dayFormat: format,
            });
        },
        [calendarSettings]
    );

    const memoizedHandleToggle = useCallback(
        (semester: string, toggleType: string) => {
            updateCalendarSettings(semester, {
                ...calendarSettings[semester],
                isWeekdaysOnly: toggleType === "weekdays",
            });
        },
        [calendarSettings]
    );

    const memoizedHandleTimeRangeToggle = useCallback(
        (semester: string, range: string) => {
            updateCalendarSettings(semester, {
                ...calendarSettings[semester],
                timeRange: range,
            });
        },
        [calendarSettings]
    );

    const memoizedHandleTimeFormatToggle = useCallback(
        (semester: string, format: boolean) => {
            updateCalendarSettings(semester, {
                ...calendarSettings[semester],
                timeFormat: format,
            });
        },
        [calendarSettings]
    );

    const memoizedResetSettings = useCallback(
        (semester: string) => {
            updateCalendarSettings(semester, defaultSettings);
        },
        [defaultSettings]
    );

    // Add effect to fetch and select latest year on mount
    useEffect(() => {
        axios
            .get(route("rooms_schedule.get_curriculum_year"))
            .then((response) => {
                const years = response.data;
                if (years && years.length > 0) {
                    // Sort years in descending order and get the latest
                    const latestYear = Math.max(...years);
                    setSelectedYear(latestYear.toString());
                }
            })
            .catch((error) => {
                console.error("Error fetching years:", error);
            });
    }, []); // Empty dependency array means this runs once on mount

    // Load pinned calendar preference on mount
    useEffect(() => {
        axios
            .get(route("preferences.pinned-calendar.get"))
            .then((response) => {
                if (response.data.pinnedCalendar) {
                    setPinnedCalendar(response.data.pinnedCalendar);
                }
            })
            .catch((error) =>
                console.error(
                    "Error loading pinned calendar preference:",
                    error
                )
            );
    }, []);

    // Handle pinning/unpinning calendar
    const handlePinCalendar = (semester: string | null) => {
        const newPinnedCalendar = pinnedCalendar === semester ? null : semester;
        setPinnedCalendar(newPinnedCalendar);

        axios
            .post(route("preferences.pinned-calendar.update"), {
                pinnedCalendar: newPinnedCalendar,
            })
            .catch((error) =>
                console.error("Error saving pinned calendar preference:", error)
            );
    };

    // Calendar display settings
    const calendarSettingsConfig = {
        plugins: [timeGridPlugin],
        initialView: "timeGridWeek",
        headerToolbar: {
            left: "",
            center: "title",
            right: "",
        },
        editable: false,
        selectable: false,
        height: "auto",
        allDaySlot: false,
        slotMinTime: "06:00:00",
        slotMaxTime: "21:00:00",
        slotDuration: "00:30:00",
        slotLabelInterval: "00:30",
        slotLabelFormat: {
            hour: "numeric" as const,
            minute: "2-digit" as const,
            meridiem: "short" as const,
        },
    };

    // Fetch events dynamically for all periods
    useEffect(() => {
        if (selectedYear) {
            setLoading(true);
            Promise.all(
                periods.map((period) =>
                    axios.get("/getSearchedSchedules", {
                        params: {
                            year: selectedYear,
                            semester: period.period_name,
                            search: auth.user.name,
                        },
                    })
                )
            )
                .then((responses) => {
                    const fetchedEvents = responses.reduce(
                        (acc: any, response, index) => ({
                            ...acc,
                            [periods[index].period_name]: response.data,
                        }),
                        {}
                    );
                    setEvents(fetchedEvents);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching schedules:", error);
                    setLoading(false);
                });
        }
    }, [selectedYear, periods, auth.user.name]);

    const renderEventContent = (eventInfo: any) => (
        <div className="relative flex flex-col overflow-hidden text-small">
            {eventInfo.event.extendedProps.conflict ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="absolute top-0 right-0 flex p-1 text-red-600 bg-white rounded-full cursor-pointer h-fit w-fit"
                                onMouseEnter={() =>
                                    handleDashboardHoverConflict(eventInfo)
                                }
                            >
                                <TriangleAlert fill="yellow" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent
                            side="left"
                            align="center"
                            className="mt-2"
                        >
                            {hoveredEventId === eventInfo.event.id && (
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
                                        {hoverConflicts.map(
                                            (conflict, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 border border-red-200 rounded-md bg-red-50"
                                                >
                                                    <p className="font-semibold text-red-700">
                                                        {conflict.title}
                                                    </p>
                                                    <div className="text-sm text-red-600">
                                                        <p>
                                                            Section:{" "}
                                                            {conflict.section}
                                                        </p>
                                                        <p>
                                                            Time:{" "}
                                                            {typeof conflict.startTime ===
                                                            "string"
                                                                ? formatTime(
                                                                      conflict.startTime
                                                                  )
                                                                : ""}{" "}
                                                            -{" "}
                                                            {typeof conflict.endTime ===
                                                            "string"
                                                                ? formatTime(
                                                                      conflict.endTime
                                                                  )
                                                                : ""}
                                                        </p>
                                                        <p>
                                                            Instructor:{" "}
                                                            {conflict.teacher}
                                                        </p>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : null}
            <div className="font-bold text-s">
                {eventInfo.event.title}
                {eventInfo.event.extendedProps.label &&
                    ` - ${eventInfo.event.extendedProps.label}`}
            </div>
            <div className="text-s">
                {eventInfo.event.extendedProps.section}
            </div>
            <div className="text-s">{eventInfo.event.extendedProps.room}</div>
        </div>
    );

    const getOrderedCalendars = () => {
        const calendars = periods.map((period) => ({
            title: `${period.period_name} Schedule`,
            events: events[period.period_name] || [],
            semester: period.period_name,
        }));

        if (pinnedCalendar) {
            const pinnedIndex = calendars.findIndex(
                (cal) => cal.semester === pinnedCalendar
            );
            if (pinnedIndex !== -1) {
                const [pinnedCal] = calendars.splice(pinnedIndex, 1);
                calendars.unshift(pinnedCal);
            }
        }

        return calendars;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="flex justify-between">
                    <h2 className="flex px-6 text-3xl font-bold text-center text-primary">
                        {auth.user.role === "user"
                            ? "Dashboard"
                            : "This is not a bug its' a feature!"}
                    </h2>
                    <div className="px-6" id="mode-toggle">
                        <ModeToggle userTheme={userTheme} />
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className="px-6">
                <p className="text-xl font-semibold">
                    Welcome, {auth.user.name}!
                </p>
            </div>

            <div className="p-6">
                <div className="flex gap-4 mb-6">
                    <div className="w-[200px]" id="select-ay">
                        <DashboardSelectYear
                            value={selectedYear}
                            onChange={setSelectedYear}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
                    </div>
                ) : selectedYear ? (
                    <div className="grid gap-6" id="view-schedule">
                        {getOrderedCalendars().map((calendar) => (
                            <div
                                key={calendar.semester}
                                className="p-4 border rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        {calendar.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handlePinCalendar(
                                                    calendar.semester
                                                )
                                            }
                                            className={`${
                                                userTheme === "dark"
                                                    ? "hover:bg-gray-500"
                                                    : "hover:bg-gray-200"
                                            } p-2 rounded-full transition-colors ${
                                                pinnedCalendar ===
                                                calendar.semester
                                                    ? "text-blue-600"
                                                    : ""
                                            }`}
                                            title={
                                                pinnedCalendar ===
                                                calendar.semester
                                                    ? "Unpin calendar"
                                                    : "Pin calendar to top"
                                            }
                                        >
                                            <PinIcon
                                                className={`h-5 w-5 transform transition-transform ${
                                                    pinnedCalendar ===
                                                    calendar.semester
                                                        ? "rotate-45"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                        <div
                                            className={`p-2 rounded-full hover:bg-gray-100 ${
                                                userTheme === "dark"
                                                    ? "hover:bg-gray-500"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            onClick={() =>
                                                handleDialogOpen(
                                                    calendar.semester,
                                                    true
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <CalendarCog className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <div id="course_scheduling_calendar">
                                    {calendar.events.length > 0 ? (
                                        <FullCalendar
                                            {...calendarSettingsConfig}
                                            headerToolbar={false}
                                            events={calendar.events}
                                            dayHeaderFormat={{
                                                weekday:
                                                    calendarSettings[
                                                        calendar.semester
                                                    ].dayFormat,
                                            }}
                                            hiddenDays={
                                                calendarSettings[
                                                    calendar.semester
                                                ].isWeekdaysOnly
                                                    ? [0, 6]
                                                    : []
                                            }
                                            slotMinTime={
                                                calendarSettings[
                                                    calendar.semester
                                                ].timeRange.split("-")[0]
                                            }
                                            slotMaxTime={
                                                calendarSettings[
                                                    calendar.semester
                                                ].timeRange.split("-")[1]
                                            }
                                            slotDuration="00:30:00"
                                            slotLabelInterval={
                                                calendarSettings[
                                                    calendar.semester
                                                ].timeFormat
                                                    ? "00:30:00"
                                                    : "01:00:00"
                                            }
                                            slotLabelContent={(info) => {
                                                if (
                                                    !calendarSettings[
                                                        calendar.semester
                                                    ].timeFormat &&
                                                    info.date.getMinutes() !== 0
                                                ) {
                                                    return "";
                                                }

                                                const start =
                                                    info.date.toLocaleTimeString(
                                                        "en-US",
                                                        {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    );

                                                if (
                                                    calendarSettings[
                                                        calendar.semester
                                                    ].timeFormat
                                                ) {
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
                                                return start;
                                            }}
                                            eventContent={renderEventContent}
                                        />
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No schedules found for{" "}
                                            {calendar.title}
                                        </div>
                                    )}
                                </div>
                                <Dialog
                                    open={!!dialogOpen[calendar.semester]}
                                    onOpenChange={(open) =>
                                        handleDialogOpen(
                                            calendar.semester,
                                            open
                                        )
                                    }
                                >
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Calendar Settings -{" "}
                                                {calendar.title}
                                            </DialogTitle>
                                            <DialogDescription>
                                                Customize calendar display
                                                options
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Day Header Format</Label>
                                                <div className="flex gap-2 mt-2">
                                                    <Toggle
                                                        pressed={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].dayFormat ===
                                                            "long"
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleFormatChange(
                                                                calendar.semester,
                                                                "long"
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].dayFormat ===
                                                            "long"
                                                                ? "outline-dark"
                                                                : ""
                                                        }
                                                    >
                                                        Long
                                                    </Toggle>
                                                    <Toggle
                                                        pressed={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].dayFormat ===
                                                            "short"
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleFormatChange(
                                                                calendar.semester,
                                                                "short"
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].dayFormat ===
                                                            "short"
                                                                ? "outline-dark"
                                                                : ""
                                                        }
                                                    >
                                                        Short
                                                    </Toggle>
                                                    <Toggle
                                                        pressed={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].dayFormat ===
                                                            "narrow"
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleFormatChange(
                                                                calendar.semester,
                                                                "narrow"
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].dayFormat ===
                                                            "narrow"
                                                                ? "outline-dark"
                                                                : ""
                                                        }
                                                    >
                                                        Narrow
                                                    </Toggle>
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Day View</Label>
                                                <div className="flex gap-2 mt-2">
                                                    <Toggle
                                                        pressed={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].isWeekdaysOnly
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleToggle(
                                                                calendar.semester,
                                                                "weekdays"
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].isWeekdaysOnly
                                                                ? "outline-dark"
                                                                : ""
                                                        }
                                                    >
                                                        Weekdays Only
                                                    </Toggle>
                                                    <Toggle
                                                        pressed={
                                                            !calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].isWeekdaysOnly
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleToggle(
                                                                calendar.semester,
                                                                "weekdaysAndWeekends"
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].isWeekdaysOnly
                                                                ? ""
                                                                : "outline-dark"
                                                        }
                                                    >
                                                        Weekdays And Weekends
                                                    </Toggle>
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Time Range</Label>
                                                <div className="flex gap-2 mt-2">
                                                    <Toggle
                                                        pressed={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeRange ===
                                                            "06:00:00-21:00:00"
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleTimeRangeToggle(
                                                                calendar.semester,
                                                                "06:00:00-21:00:00"
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeRange ===
                                                            "06:00:00-21:00:00"
                                                                ? "outline-dark"
                                                                : ""
                                                        }
                                                    >
                                                        6:00 AM - 9:00 PM
                                                    </Toggle>
                                                    <Toggle
                                                        pressed={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeRange ===
                                                            "08:00:00-17:00:00"
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleTimeRangeToggle(
                                                                calendar.semester,
                                                                "08:00:00-17:00:00"
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeRange ===
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
                                                <Label>Time Format</Label>
                                                <div className="flex gap-2 mt-2">
                                                    <Toggle
                                                        pressed={
                                                            !calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeFormat
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleTimeFormatToggle(
                                                                calendar.semester,
                                                                false
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeFormat ===
                                                            false
                                                                ? "outline-dark"
                                                                : ""
                                                        }
                                                    >
                                                        H:M
                                                    </Toggle>
                                                    <Toggle
                                                        pressed={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeFormat
                                                        }
                                                        onPressedChange={() =>
                                                            memoizedHandleTimeFormatToggle(
                                                                calendar.semester,
                                                                true
                                                            )
                                                        }
                                                        className={
                                                            calendarSettings[
                                                                calendar
                                                                    .semester
                                                            ].timeFormat ===
                                                            true
                                                                ? "outline-dark"
                                                                : ""
                                                        }
                                                    >
                                                        H:M - H:M
                                                    </Toggle>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    memoizedResetSettings(
                                                        calendar.semester
                                                    )
                                                }
                                            >
                                                Reset to Default
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center border rounded-lg">
                        Please select an academic year to view your schedules
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
