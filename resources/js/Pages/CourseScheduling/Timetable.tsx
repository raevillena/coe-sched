import React, { useState, useRef, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Input } from "@/Components/ui/input";
import "./FullCalendarCustom.css";
import { Button } from "@/Components/ui/button";
import { EventContentArg } from "@fullcalendar/core/index.js";
import { Toggle } from "@/Components/ui/toggle";
import { FaFileExcel } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { CalendarCog, Palette, CopyPlus } from "lucide-react";
import FullCalendarDialog from "./DialogTimeScheduling/FullCalendarDialog";
import AvailableClassesDialog from "./DialogTimeScheduling/AvailableClassesDialog";
import { Label } from "@/Components/ui/label";
import { TimeSchedulingSettings } from "@/types/my_types";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { SelectYearForDuplicate } from "./SelectYearForDuplicate";
import { Badge } from "@/Components/ui/badge";
import DropCalendarDialog from "./DialogTimeScheduling/DropCalendarDialog";
import * as XLSX from "xlsx-js-style";

// Add interface for available classes
interface AvailableClass {
    id: string;
    title: string; //course_code
    SubjectName: string; //course_name
    color: string;
    lec: number;
    lab: number;
    unit: number;
    course: string;
}

interface FilterCriteria {
    year: string;
    semester: string;
    searchTerm: string;
}

type TimetableProps = {
    academic: string;
    level: string;
    year: string;
    semester: string;
    course: string;
    section: string;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
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

interface DropInfo {
    date: Date;
    title: string;
    id: string;
    SubjectName: string;
    color: string;
    lec?: number;
    lab?: number;
    course: string;
}

const generateRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    const isLightColor = (color: string): boolean => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return luminance > 186;
    };
    while (isLightColor(color)) {
        color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    }

    return color;
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

const showConflictToast = (
    conflicts: CalendarEvent[],
    userTheme: "dark" | "light" | "system",
    systemTheme: boolean
) => {
    const isDarkMode =
        userTheme === "dark" || (userTheme === "system" && systemTheme);

    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full ${
                    isDarkMode
                        ? "bg-gray-800 text-white ring-gray-700"
                        : "bg-white text-black ring-black"
                } shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-1 ml-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <p
                                    className={`text-sm font-medium ${
                                        isDarkMode
                                            ? "text-gray-100"
                                            : "text-gray-900"
                                    }`}
                                >
                                    Schedule Conflicts Detected (
                                    {conflicts.length})
                                </p>
                            </div>
                            <div className="mt-1 overflow-auto max-h-48">
                                {conflicts.map((conflict, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 mt-2 border rounded-md ${
                                            isDarkMode
                                                ? "border-red-800 bg-red-900/50"
                                                : "border-red-100 bg-red-50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p
                                                className={`text-sm font-semibold ${
                                                    isDarkMode
                                                        ? "text-red-400"
                                                        : "text-red-800"
                                                }`}
                                            >
                                                {conflict.title}
                                            </p>
                                            <span
                                                className={`px-2 text-xs font-medium rounded-full ${
                                                    isDarkMode
                                                        ? "bg-red-800 text-red-300"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                Conflict {index + 1}
                                            </span>
                                        </div>

                                        <div
                                            className={`mt-1 space-y-1 text-xs ${
                                                isDarkMode
                                                    ? "text-red-300"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            <p>
                                                Section: {conflict.section}
                                                {conflict.label &&
                                                    ` - ${conflict.label}`}
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
                                                Instructor: {conflict.teacher}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            duration: 3000,
            position: "top-right",
        }
    );
};

////////////////////// data in the full calendar///////////////////////
export default function Timetable({
    academic,
    level,
    year,
    semester,
    course,
    section,
    userTheme,
    systemTheme,
}: TimetableProps) {
    const [duplicateYear, setDuplicateYear] = useState<string>("");
    const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const updateTimeoutRef = useRef<NodeJS.Timeout>();

    const [dropDialogOpen, setDropDialogOpen] = useState(false);
    const [dropInfo, setDropInfo] = useState<DropInfo | null>(null);

    // Track preview event id
    const [previewEventId, setPreviewEventId] = useState<string | null>(null);

    // Add new state for year change callback
    const [yearChangeCallback, setYearChangeCallback] = useState<
        ((year: string) => void) | null
    >(null);

    // Add helper function to check if required fields are present - moved up
    const areFieldsEmpty = !academic || !semester || !course || !section;

    // Fetch events data when component mounts or when selection criteria changes
    useEffect(() => {
        const fetchEvents = async () => {
            if (areFieldsEmpty) {
                setEvents([]);
                return;
            }

            try {
                setEventsLoading(true);
                const response = await fetch(
                    `/course_scheduling/get_schedules?year=${year}&semester=${semester}&course=${course}&section=${section}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents([]);
            } finally {
                setEventsLoading(false);
            }
        };

        fetchEvents();
    }, [year, semester, course, section]);

    // Fetch curriculum data when component mounts or when selection criteria changes
    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                // Get color mappings from cache
                const colorMapKey = `color-map-${course}-${level}`;
                const cachedColors = localStorage.getItem(colorMapKey);
                const colorMap = cachedColors ? JSON.parse(cachedColors) : {};

                if (year && semester && course) {
                    const response = await axios.get(
                        route("course_scheduling.get_courses_offered"),
                        {
                            params: {
                                program_code: course,
                                level: level,
                                curriculum_year: academic,
                                period: semester,
                                section_name: section,
                            },
                        }
                    );

                    // Apply existing colors or generate new ones
                    const data: AvailableClass[] = response.data.map(
                        (item: AvailableClass) => ({
                            ...item,
                            color: colorMap[item.id] || generateRandomColor(),
                        })
                    );

                    // Update color map with any new colors
                    const newColorMap = { ...colorMap };
                    data.forEach((item: AvailableClass) => {
                        newColorMap[item.id] = item.color;
                    });

                    // Only save color mappings
                    localStorage.setItem(
                        colorMapKey,
                        JSON.stringify(newColorMap)
                    );

                    setAvailableClasses(data);
                } else {
                    setAvailableClasses([]);
                }
            } catch (error) {
                console.error("Error fetching curriculum:", error);
                setAvailableClasses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurriculum();
    }, [level, course, academic, semester]);

    const [filteredClasses, setFilteredClasses] = useState<AvailableClass[]>(
        []
    );
    const [searchTerm, setSearchTerm] = useState("");
    const externalEventContainerRef = useRef<HTMLDivElement>(null);

    // Alt key press tracking (temporarily disabled)
    const [altIsPressed, setAltIsPressed] = useState(false);

    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (e.altKey) {
    //             setAltIsPressed(true);
    //         }
    //     };
    //     const handleKeyUp = (e: KeyboardEvent) => {
    //         if (!e.altKey) {
    //             setAltIsPressed(false);
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyDown);
    //     window.addEventListener("keyup", handleKeyUp);

    //     return () => {
    //         window.removeEventListener("keydown", handleKeyDown);
    //         window.removeEventListener("keyup", handleKeyUp);
    //     };
    // }, []);

    // Update the external draggable initialization useEffect to also depend on the selection criteria
    useEffect(() => {
        if (externalEventContainerRef.current && !areFieldsEmpty) {
            const draggable = new Draggable(externalEventContainerRef.current, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    return {
                        title: eventEl.getAttribute("data-title"),
                        id: eventEl.getAttribute("data-id"),
                        SubjectName: eventEl.getAttribute("data-subject-name"),
                        color: eventEl.getAttribute("data-color"),
                        unit: eventEl.getAttribute("data-unit"),
                        lec: eventEl.getAttribute("data-lec"),
                        lab: eventEl.getAttribute("data-lab"),
                    };
                },
            });

            return () => {
                draggable.destroy();
            };
        }
    }, [filteredClasses, areFieldsEmpty, year, semester, course, section]);

    useEffect(() => {
        // Filter the classes based on the search term
        setFilteredClasses(
            availableClasses.filter(
                (cls) =>
                    cls.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    cls.SubjectName.toLowerCase().includes(
                        searchTerm.toLowerCase()
                    )
            )
        );
    }, [searchTerm, availableClasses]);

    //dialog for when dropping to the table
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(
        null
    );

    const handleClassDrop = async (info: any) => {
        // Generate a unique id for the preview event
        const previewId = `preview-${info.draggedEl.getAttribute(
            "data-id"
        )}-${Date.now()}`;
        setPreviewEventId(previewId);
        // Create a preview event (minimal info, just for display)
        const previewEvent: CalendarEvent = {
            id: previewId,
            title: info.draggedEl.getAttribute("data-title"),
            SubjectName: info.draggedEl.getAttribute("data-subject-name"),
            color: info.draggedEl.getAttribute("data-color"),
            startTime: info.date,
            endTime: new Date(info.date.getTime() + 60 * 60 * 1000), // 1 hour default
            room: "",
            teacher: "",
            daysOfWeek: [info.date.getDay()],
            section,
            course,
            year,
            semester,
            conflict: false,
            label: "",
        };
        setEvents((prev) => [...prev, previewEvent]);
        setDropInfo({
            date: info.date,
            title: info.draggedEl.getAttribute("data-title"),
            id: info.draggedEl.getAttribute("data-id"),
            SubjectName: info.draggedEl.getAttribute("data-subject-name"),
            color: info.draggedEl.getAttribute("data-color"),
            lec: info.draggedEl.getAttribute("data-lec"),
            lab: info.draggedEl.getAttribute("data-lab"),
            course: info.draggedEl.getAttribute("data-course"),
        });
        setDropDialogOpen(true);
    };

    // Remove preview event on dialog close
    const handleDropDialogClose = () => {
        setDropDialogOpen(false);
        setDropInfo(null);
        if (previewEventId) {
            setEvents((prev) => prev.filter((e) => e.id !== previewEventId));
            setPreviewEventId(null);
        }
    };

    // When saving, replace preview with real event
    const handleDropSave = (newEvent: CalendarEvent) => {
        setEvents((prevEvents) => {
            let filtered = prevEvents;
            if (previewEventId) {
                filtered = prevEvents.filter((e) => e.id !== previewEventId);
            }
            return [...filtered, newEvent];
        });
        setPreviewEventId(null);
    };

    // Helper function to save event to the database
    const saveEventToDatabase = async (event: CalendarEvent) => {
        try {
            // Create a copy of the event with daysOfWeek properly stringified
            const eventData = {
                ...event,
                daysOfWeek: JSON.stringify(event.daysOfWeek || []),
            };

            const response = await axios.post(
                route("course-scheduling.save"),
                eventData
            );

            // console.log("Event saved to database:", response.data);
        } catch (error) {
            console.error("Error saving event to database:", error);
        }
    };

    // Helper function to update event in the database
    const updateEventInDatabase = async (event: CalendarEvent) => {
        try {
            // Create a copy of the event with daysOfWeek properly stringified
            const eventData = {
                ...event,
                daysOfWeek: JSON.stringify(event.daysOfWeek || []),
            };

            const response = await axios.put(
                route("course_scheduling.update", { id: event.id }),
                eventData
            );

            // console.log("Event updated in database:", response.data);

            // Handle updated conflict status from server if provided
            if (
                response.data.conflict !== undefined &&
                response.data.conflict !== event.conflict
            ) {
                // If the server detected a different conflict status, update the local state
                setEvents((prevEvents) =>
                    prevEvents.map((e) =>
                        e.id === event.id
                            ? { ...e, conflict: response.data.conflict }
                            : e
                    )
                );
            }
        } catch (error) {
            console.error("Error updating event in database:", error);
        }
    };

    /////////////////////////////////////////////////////////////////////////
    const debouncedUpdateEvent = useCallback(
        async (
            event: CalendarEvent,
            originalEvent: CalendarEvent | null,
            newStartTime: string,
            newEndTime: string,
            day: number,
            isMove: boolean
        ) => {
            // Clear any existing timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            // Set a new timeout
            updateTimeoutRef.current = setTimeout(async () => {
                try {
                    setIsUpdating(true);

                    // Check for conflicts
                    const conflictingEvents = await checkForConflicts(
                        event.room,
                        day,
                        newStartTime,
                        newEndTime,
                        event.id
                    );

                    const hasConflict = conflictingEvents.length > 0;

                    if (hasConflict) {
                        showConflictToast(
                            conflictingEvents,
                            userTheme,
                            systemTheme
                        );
                    }

                    // Update the current event and all conflicting events
                    const updatedEvents = events.map((e) => {
                        if (e.id === event.id) {
                            const updatedEvent = {
                                ...e,
                                startTime: newStartTime,
                                endTime: newEndTime,
                                daysOfWeek: [day],
                                conflict: hasConflict,
                            };

                            // Save updated event to database
                            updateEventInDatabase(updatedEvent);

                            return updatedEvent;
                        }

                        if (
                            conflictingEvents.find(
                                (conflict) => conflict.id === e.id
                            )
                        ) {
                            const updatedConflict = { ...e, conflict: true };

                            // Save conflicting event update to database
                            updateEventInDatabase(updatedConflict);

                            return updatedConflict;
                        }

                        return e;
                    });

                    setEvents(updatedEvents);

                    if (!hasConflict && originalEvent) {
                        resolveConflicts(originalEvent.id);
                    }
                } catch (error) {
                    console.error("Error updating event:", error);
                    toast.error("Failed to update schedule");
                } finally {
                    setIsUpdating(false);
                }
            }, 250); // 250ms debounce delay
        },
        [events, userTheme, systemTheme]
    );

    const handleEventDrop = async (info: any) => {
        // Handle drop event
        const startcdate = new Date(info.event.start);
        const endcdate = new Date(info.event.end);
        const new_start_time = `${startcdate.getHours()}:${
            startcdate.getMinutes() == 0 ? "00" : startcdate.getMinutes()
        }:00`;
        const new_end_time = `${endcdate.getHours()}:${
            endcdate.getMinutes() == 0 ? "00" : endcdate.getMinutes()
        }:00`;

        const day = info.event.start.getDay();
        const originalEvent = events.find(
            (ev: CalendarEvent) => ev.id === info.event.id
        );

        if (!originalEvent) {
            info.revert();
            return;
        }

        // Create updated event
        const updatedEvent: CalendarEvent = {
            ...originalEvent,
            startTime: new_start_time,
            endTime: new_end_time,
            daysOfWeek: [day],
        };

        // Optimistically update the UI
        setEvents((prevEvents: CalendarEvent[]) =>
            prevEvents.map((event: CalendarEvent) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );

        try {
            // Check for conflicts after the move
            const conflicts = await checkForConflicts(
                updatedEvent.room,
                day,
                new_start_time,
                new_end_time,
                updatedEvent.id
            );

            if (conflicts.length > 0) {
                showConflictToast(conflicts, userTheme, systemTheme);
                // Update conflict flags
                setEvents((prevEvents: CalendarEvent[]) =>
                    prevEvents.map((event: CalendarEvent) =>
                        conflicts.find(
                            (conflict) => conflict.id === event.id
                        ) || event.id === updatedEvent.id
                            ? { ...event, conflict: true }
                            : event
                    )
                );
            } else {
                // Clear conflict flag if no conflicts
                setEvents((prevEvents: CalendarEvent[]) =>
                    prevEvents.map((event: CalendarEvent) =>
                        event.id === updatedEvent.id
                            ? { ...event, conflict: false }
                            : event
                    )
                );
            }

            // Save to database
            await updateEventInDatabase(updatedEvent);
        } catch (error) {
            // Rollback on error
            setEvents((prevEvents: CalendarEvent[]) =>
                prevEvents.map((event: CalendarEvent) =>
                    event.id === originalEvent.id ? originalEvent : event
                )
            );
            console.error("Error updating event:", error);
            toast.error("Failed to update schedule");
            info.revert();
        }
    };

    const handleEventResize = async (info: any) => {
        const startcdate = new Date(info.event.start);
        const endcdate = new Date(info.event.end);
        const new_start_time = `${startcdate.getHours()}:${
            startcdate.getMinutes() == 0 ? "00" : startcdate.getMinutes()
        }:00`;
        const new_end_time = `${endcdate.getHours()}:${
            endcdate.getMinutes() == 0 ? "00" : endcdate.getMinutes()
        }:00`;

        const day = startcdate.getDay();
        const originalEvent = events.find((ev) => ev.id === info.event.id);

        if (!originalEvent) {
            info.revert();
            return;
        }

        // Create updated event
        const updatedEvent = {
            ...originalEvent,
            startTime: new_start_time,
            endTime: new_end_time,
            daysOfWeek: [day],
        };

        // Optimistically update the UI
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );

        try {
            // Check for conflicts after the resize
            const conflicts = await checkForConflicts(
                updatedEvent.room,
                day,
                new_start_time,
                new_end_time,
                updatedEvent.id
            );

            if (conflicts.length > 0) {
                showConflictToast(conflicts, userTheme, systemTheme);
                // Update conflict flags
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        conflicts.find(
                            (conflict) => conflict.id === event.id
                        ) || event.id === updatedEvent.id
                            ? { ...event, conflict: true }
                            : event
                    )
                );
            } else {
                // Clear conflict flag if no conflicts
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === updatedEvent.id
                            ? { ...event, conflict: false }
                            : event
                    )
                );
            }

            // Save to database
            await updateEventInDatabase(updatedEvent);
        } catch (error) {
            // Rollback on error
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === originalEvent.id ? originalEvent : event
                )
            );
            console.error("Error updating event:", error);
            toast.error("Failed to update schedule");
            info.revert();
        }
    };

    const checkForConflicts = async (
        roomToCheck: string,
        dayToCheck: number,
        startTime: string,
        endTime: string,
        eventId: string
    ): Promise<CalendarEvent[]> => {
        try {
            const response = await axios.get(
                "/course_scheduling/get_schedules",
                {
                    params: {
                        academic: academic, //might need to change
                        semester: semester,
                        room: roomToCheck,
                    },
                }
            );

            const roomEvents: CalendarEvent[] = response.data;

            if (!roomEvents || roomEvents.length === 0) return [];

            const startMinutes = convertTimeToMinutes(startTime);
            const endMinutes = convertTimeToMinutes(endTime);

            const conflicts = roomEvents.filter((event) => {
                if (event.id === eventId) return false;

                const eventDays =
                    typeof event.daysOfWeek === "string"
                        ? JSON.parse(event.daysOfWeek)
                        : event.daysOfWeek;

                if (!eventDays.includes(dayToCheck)) return false;

                const existingStartMinutes = convertTimeToMinutes(
                    typeof event.startTime === "string"
                        ? event.startTime
                        : event.startTime.toISOString().split("T")[1]
                );
                const existingEndMinutes = convertTimeToMinutes(
                    typeof event.endTime === "string"
                        ? event.endTime
                        : event.endTime.toISOString().split("T")[1]
                );

                return (
                    (startMinutes < existingEndMinutes &&
                        endMinutes > existingStartMinutes) ||
                    (existingStartMinutes < endMinutes &&
                        existingEndMinutes > startMinutes)
                );
            });

            return conflicts; // Return all conflicting events
        } catch (error) {
            console.error("Error checking for conflicts:", error);
            return [];
        }
    };

    // Helper function to convert time to minutes for comparison
    const convertTimeToMinutes = (timeStr: string): number => {
        if (!timeStr) return 0;

        // Convert "HH:MM:SS" format to minutes
        if (typeof timeStr === "string" && timeStr.includes(":")) {
            const parts = timeStr.split(":");
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            return hours * 60 + minutes;
        }

        // Try to handle Date objects or timestamps
        try {
            const date = new Date(timeStr);
            if (!isNaN(date.getTime())) {
                return date.getHours() * 60 + date.getMinutes();
            }
        } catch (e) {
            console.error("Failed to parse time:", timeStr);
        }

        return 0;
    };

    const refreshColors = () => {
        const colorMapKey = `color-map-${course}-${level}`;
        const newColorMap: { [key: string]: string } = {};

        const updatedClasses = availableClasses.map((cls) => {
            const newColor = generateRandomColor();
            newColorMap[cls.id] = newColor;
            return {
                ...cls,
                color: newColor,
            };
        });

        // Update local state
        setAvailableClasses(updatedClasses);

        // Only save color map
        localStorage.setItem(colorMapKey, JSON.stringify(newColorMap));
    };

    //////////////////toggle logic///////////////////////
    // Default settings
    const defaultSettings: TimeSchedulingSettings = {
        dayFormat: "long",
        isWeekdaysOnly: false,
        timeRange: "06:00:00-21:00:00",
        timeFormat: false,
        timeSnap: "00:30:00",
    };

    // Load settings from localStorage
    const loadSettings = (): TimeSchedulingSettings => {
        const savedSettings = localStorage.getItem("timeSchedulingSettings");
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    };

    // Initialize states with loaded settings
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
    const handleDuplicate = async () => {
        try {
            if (!duplicateYear) {
                toast.error("Please select a year to duplicate from");
                return;
            }

            const loadingToast = toast.loading("Duplicating schedules...");

            // Get all existing schedules for the old year
            const oldSchedulesResponse = await axios.get(
                "/course_scheduling/get_schedules",
                {
                    params: {
                        year: duplicateYear,
                        semester: semester,
                        course: course,
                        section: section,
                    },
                }
            );

            const oldSchedules = oldSchedulesResponse.data;
            if (!oldSchedules || oldSchedules.length === 0) {
                toast.dismiss(loadingToast);
                toast.error(`No schedules found for year ${duplicateYear}`);
                return;
            }

            // Create a mapping of original IDs to identify alt-copied events
            const scheduleMap = new Map();
            oldSchedules.forEach((schedule: CalendarEvent) => {
                if (schedule.id.includes("-altCopy-")) {
                    const originalId = schedule.id.split("-altCopy-")[0];
                    if (!scheduleMap.has(originalId)) {
                        scheduleMap.set(originalId, []);
                    }
                    scheduleMap.get(originalId).push(schedule);
                } else {
                    if (!scheduleMap.has(schedule.id)) {
                        scheduleMap.set(schedule.id, []);
                    }
                }
            });

            // Prepare the schedules array including all versions of each event
            const schedulesToDuplicate = oldSchedules
                .map((schedule: CalendarEvent) => {
                    if (schedule.id.includes("-altCopy-")) {
                        return null; // Skip alt copies here, they're handled with their originals
                    }
                    const altCopies = scheduleMap.get(schedule.id) || [];
                    return {
                        original: schedule,
                        altCopies: altCopies,
                    };
                })
                .filter(Boolean);

            // Send to backend
            const response = await axios.post(
                route("course_scheduling.duplicate"),
                {
                    oldYear: String(duplicateYear),
                    newYear: String(year),
                    semester: String(semester),
                    course: String(course),
                    section: String(section),
                    schedules: schedulesToDuplicate,
                }
            );

            if (response.data.success) {
                // Get updated schedules including conflict status
                const newSchedules = await axios.get(
                    `/course_scheduling/get_schedules?year=${year}&semester=${semester}&course=${course}&section=${section}`
                );

                setEvents(newSchedules.data);
                setDuplicateDialogOpen(false);

                toast.dismiss(loadingToast);

                // Show success message with conflict warning if any
                const conflictingSchedules = newSchedules.data.filter(
                    (schedule: any) => schedule.conflict
                );
                if (conflictingSchedules.length > 0) {
                    toast.success(
                        `Duplicated ${response.data.count} schedules. Warning: ${conflictingSchedules.length} schedule(s) have conflicts.`,
                        { duration: 5000 }
                    );
                } else {
                    toast.success(
                        `Successfully duplicated ${response.data.count} schedules!`
                    );
                }
            } else {
                toast.dismiss(loadingToast);
                toast.error(
                    response.data.message || "Failed to duplicate schedules"
                );
            }
        } catch (error: any) {
            console.error("Error duplicating schedule:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to duplicate schedules. Please try again.";
            toast.error(errorMessage);
        }
    };
    // Save settings whenever they change
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

    // Update your existing handlers to use the new state
    const handleFormatChange = (format: "long" | "short" | "narrow") => {
        setDayFormat(format);
    };

    const handleToggle = (toggleType: string) => {
        setIsWeekdaysOnly(toggleType === "weekdays");
    };

    const handleTimeRangeToggle = (range: string) => {
        setTimeRange(range);
    };

    const handleTimeFormatToggle = (format: boolean) => {
        setTimeFormat(format);
    };

    const handleTimeSnapToggle = (snap: string) => {
        setTimeSnap(snap);
    };

    // Add a reset function to restore default settings
    const resetSettings = () => {
        setDayFormat(defaultSettings.dayFormat);
        setIsWeekdaysOnly(defaultSettings.isWeekdaysOnly);
        setTimeRange(defaultSettings.timeRange);
        setTimeFormat(defaultSettings.timeFormat);
        setTimeSnap(defaultSettings.timeSnap);
    };

    const resolveConflicts = (resolvedEventId: string) => {
        setEvents((prevEvents) => {
            const updatedEvents = prevEvents.map((event) => {
                if (event.id === resolvedEventId) {
                    return { ...event, conflict: false };
                }
                return event;
            });

            // Recheck conflicts for all events
            updatedEvents.forEach(async (event) => {
                const conflicts = await checkForConflicts(
                    event.room,
                    (event.daysOfWeek ?? [])[0],
                    typeof event.startTime === "string"
                        ? event.startTime
                        : event.startTime.toISOString(),
                    typeof event.endTime === "string"
                        ? event.endTime
                        : event.endTime.toISOString(),
                    event.id
                );
                if (conflicts.length === 0) {
                    event.conflict = false;
                }
            });

            return updatedEvents;
        });
    };

    //check for conflicts when hovering over a subject with conflict
    const hoverCheckForConflicts = async (
        roomToCheck: string,
        dayToCheck: number,
        startTime: string,
        endTime: string,
        eventId: string
    ): Promise<CalendarEvent[]> => {
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

            const roomEvents: CalendarEvent[] = response.data;

            if (!roomEvents || roomEvents.length === 0) return [];

            const startMinutes = convertTimeToMinutes(startTime);
            const endMinutes = convertTimeToMinutes(endTime);

            return roomEvents.filter((event: CalendarEvent) => {
                if (event.id === eventId) return false;

                const eventDays =
                    typeof event.daysOfWeek === "string"
                        ? JSON.parse(event.daysOfWeek)
                        : event.daysOfWeek;

                if (!eventDays.includes(dayToCheck)) return false;

                const existingStartMinutes = convertTimeToMinutes(
                    typeof event.startTime === "string"
                        ? event.startTime
                        : event.startTime.toISOString().split("T")[1]
                );
                const existingEndMinutes = convertTimeToMinutes(
                    typeof event.endTime === "string"
                        ? event.endTime
                        : event.endTime.toISOString().split("T")[1]
                );

                return (
                    (startMinutes < existingEndMinutes &&
                        endMinutes > existingStartMinutes) ||
                    (existingStartMinutes < endMinutes &&
                        existingEndMinutes > startMinutes)
                );
            });
        } catch (error) {
            console.error("Error checking for conflicts:", error);
            return [];
        }
    };
    //end of hover conflict check

    //download class schedule helper
    const dayFormats = {
        long: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        narrow: ["S", "M", "T", "W", "Th", "F", "Sa"],
    };

    const formatDaysOfWeek = (
        days: number[] | string | number | undefined | null
    ) => {
        if (typeof days === "string") {
            try {
                days = JSON.parse(days);
            } catch {
                console.error("Invalid JSON string for days:", days);
                return "Invalid days";
            }
        } else if (typeof days === "number") {
            days = [days];
        }

        if (!Array.isArray(days)) {
            console.error("Invalid input: days is not an array", days);
            return "Invalid days";
        }

        const format = dayFormats.narrow;
        return days.map((day) => format[day]).join(", ");
    };

    const formatTeacherName = (name: string): string => {
        name = name.replace(/\b(Engr\.|Dr\.)\s*/gi, "").replace(/\bDr\./gi, "");
        name = name.replace(/\s+/g, " ").trim();

        // Split name
        const parts = name.split(" ");
        if (parts.length < 2) return name.toUpperCase();

        const lastName = parts[parts.length - 1];
        const initials = parts
            .slice(0, -1)
            .map((part) => part[0].toUpperCase())
            .join("");
        return `${initials}${lastName}`;
    };
    //end of download class schedule helper

    // download class schedule as excel

    //const emptyRow = (cols: number) => Array(cols).fill("");
    const COLS = 7;

    function groupEventsByCourseCode(
        events: CalendarEvent[]
    ): Record<string, CalendarEvent[]> {
        const grouped: Record<string, CalendarEvent[]> = {};
        events.forEach((e) => {
            if (!grouped[e.title]) grouped[e.title] = [];
            grouped[e.title].push(e);
        });
        return grouped;
    }

    function formatGroupedDays(events: CalendarEvent[]): string {
        const days = Array.from(
            new Set(events.map((ev) => formatDaysOfWeek(ev.daysOfWeek)))
        );
        return days.join("/");
    }

    const formatTimeDownload = (timeStr: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = hours.padStart(2, "0");
        const min = minutes.padStart(2, "0");
        return `${hour}:${min}`;
    };

    function formatGroupedTimes(events: CalendarEvent[]): string {
        const times = Array.from(
            new Set(
                events.map(
                    (ev) =>
                        `${formatTimeDownload(
                            ev.startTime as string
                        )} - ${formatTimeDownload(ev.endTime as string)}`
                )
            )
        );
        return times.join(" / ");
    }
    function formatGroupedRooms(events: CalendarEvent[]): string {
        const rooms = Array.from(new Set(events.map((ev) => ev.room || "")));
        return rooms.join(" / ");
    }
    function formatGroupedInstructors(events: CalendarEvent[]): string {
        const teachers = Array.from(
            new Set(events.map((ev) => ev.teacher || ""))
        );
        return teachers.map(formatTeacherName).join(" / ");
    }

    const downloadExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheetData: unknown[][] = [];

        // HEADER SECTION
        worksheetData.push([
            "LOGO",
            "MARIANO MARCOS STATE UNIVERSITY",
            "",
            "",
            "",
            "Document Code",
            "URO-FRM-012B",
        ]);
        worksheetData.push([
            "",
            "Office of the University Registrar",
            "",
            "",
            "",
            "Revision No.",
            "0",
        ]);
        worksheetData.push([
            "",
            "CLASS SCHEDULE",
            "",
            "",
            "",
            "Effectivity Date",
            "May 16, 2024",
        ]);
        worksheetData.push(Array(COLS).fill(""));

        worksheetData.push([
            "College:",
            "College of Engineering",
            "",
            "",
            "",
            "",
            "",
        ]);
        const collegeRowIdx = worksheetData.length - 1;

        worksheetData.push([
            "Semester:",
            `${semester} AY ${year}-${Number(year) + 1}` || "",
            "",
            "",
            "",
            "",
            "",
        ]);
        const semesterRowIdx = worksheetData.length - 1;

        worksheetData.push(Array(COLS).fill(""));

        // Table headers for student schedule
        worksheetData.push([
            "Course Code",
            "Course Title",
            "Units",
            "Time",
            "Day",
            "Room/Bldg.",
            "Instructor",
        ]);
        const tableHeaderRowIdx = worksheetData.length - 1;

        worksheetData.push(Array(COLS).fill(""));

        worksheetData.push([
            `${section} (${academic} CURRICULUM)`,
            ...Array(COLS - 1).fill(""),
        ]);

        const departmentRowIdx = worksheetData.length - 1;
        // worksheetData.push(Array(COLS).fill(""));

        // Add each event as a row
        const grouped = groupEventsByCourseCode(events);
        let totalUnits = 0;

        Object.entries(grouped).forEach(([courseCode, courseEvents]) => {
            //get the unit from the availableClasses with matching courseCode (title)
            const unit =
                availableClasses.find((cls) => cls.title === courseCode)
                    ?.unit ?? "";

            //total units
            if (typeof unit === "number") {
                totalUnits += unit;
            } else if (typeof unit === "string" && unit !== "") {
                totalUnits += Number(unit);
            }

            worksheetData.push([
                courseCode,
                courseEvents[0].SubjectName || "",
                unit,
                formatGroupedTimes(courseEvents),
                formatGroupedDays(courseEvents),
                formatGroupedRooms(courseEvents),
                formatGroupedInstructors(courseEvents),
            ]);
        });

        worksheetData.push(["", "Total Units", totalUnits, "", "", "", ""]);

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        worksheet["!rows"] = worksheet["!rows"] || [];
        worksheet["!rows"][tableHeaderRowIdx] = { hpt: 30 };

        worksheet["!cols"] = [
            { wch: 10 }, // Course Code
            { wch: 30 }, // Course Title
            { wch: 7 }, // Units
            { wch: 30 }, // Time
            { wch: 10 }, // Day
            { wch: 20 }, // Room/Bldg.
            { wch: 20 }, // Instructor
        ];

        // --- MERGES ---
        worksheet["!merges"] = [
            // Merge College of Engineering (B5:C5) and Semester (B6:C6)
            { s: { r: collegeRowIdx, c: 1 }, e: { r: collegeRowIdx, c: 1 } },
            { s: { r: semesterRowIdx, c: 1 }, e: { r: semesterRowIdx, c: 1 } },
            {
                s: { r: departmentRowIdx, c: 0 },
                e: { r: departmentRowIdx, c: COLS - 1 },
            },
            ...Array(COLS)
                .fill(0)
                .map((_, i) => ({
                    s: { r: tableHeaderRowIdx, c: i },
                    e: { r: tableHeaderRowIdx, c: i },
                })),
        ];

        // --- HEADER STYLE + FONT SIZE 8 ---
        worksheet["A5"].s = {
            font: { bold: true, sz: 8 },
            alignment: { horizontal: "left", vertical: "center" },
        };
        worksheet["A6"].s = {
            font: { bold: true, sz: 8 },
            alignment: { horizontal: "left", vertical: "center" },
        };

        // --- BORDERS FOR ALL HEADER ROWS ---
        for (let row = 0; row <= 6; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = XLSX.utils.encode_cell({ r: row, c: col });
                if (worksheet[cell]) {
                    worksheet[cell].s = {
                        ...worksheet[cell].s,
                        font: { ...worksheet[cell].s?.font, sz: 8 },
                        alignment: { ...worksheet[cell].s?.alignment },
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } },
                        },
                    };
                }
            }
        }

        // --- TABLE HEADER CELL STYLES ---
        for (let i = 0; i < COLS; i++) {
            const cell = XLSX.utils.encode_cell({ r: tableHeaderRowIdx, c: i });
            if (worksheet[cell]) {
                worksheet[cell].s = {
                    font: { bold: true, sz: 8 },
                    alignment: {
                        horizontal: "center",
                        vertical: "center",
                        wrapText: true,
                    },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                };
            }
        }

        // --- STYLE THE DEPARTMENT ROW  ---
        for (let col = 0; col < COLS; col++) {
            const cell = XLSX.utils.encode_cell({
                r: departmentRowIdx,
                c: col,
            });
            if (!worksheet[cell]) worksheet[cell] = { t: "s", v: "" };
            worksheet[cell].s = {
                ...worksheet[cell].s,
                font: { ...worksheet[cell].s?.font, bold: true, sz: 8 },
                alignment: { horizontal: "left", vertical: "center" },
                // fill: { patternType: "solid", fgColor: { rgb: "A8D08D" } },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        }

        const totalUnitsRowIdx = worksheetData.length - 1;
        const totalUnitsCell = XLSX.utils.encode_cell({
            r: totalUnitsRowIdx,
            c: 1,
        });
        const unitsValueCell = XLSX.utils.encode_cell({
            r: totalUnitsRowIdx,
            c: 2,
        });

        worksheet[totalUnitsCell].s = {
            font: { bold: true, sz: 10 },
            //alignment: { horizontal: "center", vertical: "center" },
        };
        worksheet[unitsValueCell].s = {
            font: { bold: true, sz: 10 },
            alignment: { horizontal: "center", vertical: "center" },
        };

        Object.keys(worksheet).forEach((cell) => {
            if (cell[0] === "!") return;
            worksheet[cell].s = {
                ...worksheet[cell].s,
                font: { ...worksheet[cell].s?.font, sz: 8 },
                border: worksheet[cell].s?.border || {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Schedule");
        XLSX.writeFile(
            workbook,
            `${course}_${semester}_${year}-${
                Number(year) + 1
            }_Student_Schedule.xlsx`
        );
    };

    return (
        <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Left Panel */}
            <div
                className="w-full mb-6 lg:w-1/4 lg:mb-0"
                id="available-classes"
            >
                <h3 className="mb-4 text-lg font-bold">Available Courses</h3>
                <div className="flex items-center mb-4 space-x-1">
                    <Input
                        id="ClassSearch"
                        type="text"
                        placeholder="Search Courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                        autoComplete="off"
                        disabled={areFieldsEmpty}
                    />

                    <Button
                        onClick={refreshColors}
                        variant="default"
                        size="sm"
                        disabled={areFieldsEmpty}
                    >
                        <Palette />
                    </Button>
                </div>
                <p className="mb-3 text-sm italic text-muted-foreground">
                    Click or drag courses to add them to the scheduler
                </p>

                {areFieldsEmpty ? (
                    <div className="p-3 text-center border">
                        Please select a year, semester, course, and section to
                        view and interact with the timetable.
                    </div>
                ) : (
                    <div
                        ref={externalEventContainerRef}
                        className="p-3 space-y-3 overflow-y-auto border max-h-[800px]"
                    >
                        {filteredClasses.length === 0 ? (
                            <div className="p-3 text-center text-red-500 border">
                                No available courses offered.
                            </div>
                        ) : (
                            filteredClasses.map((cls) =>
                                section && section !== "Select a section" ? (
                                    <AvailableClassesDialog
                                        key={cls.id}
                                        cls={cls}
                                        events={events}
                                        setEvents={setEvents}
                                        section={section}
                                        course={course}
                                        year={year}
                                        semester={semester}
                                        userTheme={userTheme}
                                        systemTheme={systemTheme}
                                    >
                                        <div
                                            className="p-2 mb-2 bg-white rounded shadow cursor-move fc-event"
                                            data-id={cls.id}
                                            data-title={cls.title}
                                            data-subject-name={cls.SubjectName}
                                            data-color={cls.color}
                                            data-lec={cls.lec}
                                            data-lab={cls.lab}
                                            data-course={cls.course}
                                            style={{
                                                backgroundColor: cls.color,
                                                color: "#ffffff",
                                            }}
                                        >
                                            <div className="font-semibold">
                                                {cls.title}
                                            </div>
                                            <div className="text-sm">
                                                {cls.SubjectName}
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                <Badge variant="secondary">
                                                    Lec: {cls.lec}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    Lab: {cls.lab}
                                                </Badge>
                                                <Badge variant="default">
                                                    Units: {cls.unit}
                                                </Badge>
                                            </div>
                                        </div>
                                    </AvailableClassesDialog>
                                ) : (
                                    <div
                                        key={cls.id}
                                        className="p-3 text-center text-red-500 bg-gray-100 border rounded"
                                    >
                                        Section is not defined. Please select a
                                        section first.
                                    </div>
                                )
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Calendar Panel */}
            <div className="relative w-full lg:w-3/4" id="scheduling-calendar">
                {/* Add loading overlay */}
                {isUpdating && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-white/20">
                        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
                    </div>
                )}
                <div className="flex mb-2">
                    {/* show duplicate button only when events are empty and fields are filled */}
                    {!eventsLoading &&
                        events.length === 0 &&
                        !areFieldsEmpty && (
                            <Dialog
                                open={duplicateDialogOpen}
                                onOpenChange={setDuplicateDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <CopyPlus className="mr-1" />
                                        Duplicate Old Schedule for {section}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[90%] lg:w-full">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Duplicate Schedule
                                        </DialogTitle>
                                        <DialogDescription>
                                            Copy old schedule of {section} to
                                            current year
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div>
                                            <SelectYearForDuplicate
                                                id="curriculum_year"
                                                program_code={course}
                                                level={level}
                                                value={duplicateYear}
                                                onChange={(value) => {
                                                    setDuplicateYear(value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={handleDuplicate}
                                            disabled={
                                                !duplicateYear ||
                                                duplicateYear === year
                                            }
                                        >
                                            Duplicate
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                    {events.length > 0 && (
                        <div
                            id="download-workload"
                            className="w-full lg:w-auto ml-2"
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                type="button"
                                                variant="default"
                                                disabled={false}
                                                onClick={() => {
                                                    downloadExcel();
                                                }}
                                                style={{
                                                    pointerEvents: "auto",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <FaFileExcel />
                                                Download Excel
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p>Class Schedule</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}

                    <Dialog>
                        <DialogTrigger
                            className="ml-auto"
                            disabled={areFieldsEmpty}
                        >
                            <div
                                className={`${
                                    userTheme === "dark"
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
                                    <Label htmlFor="day-view">Day View</Label>
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
                                            isWeekdaysOnly ? "outline-dark" : ""
                                        }
                                    >
                                        Weekdays Only
                                    </Toggle>
                                    <Toggle
                                        variant={"outline"}
                                        pressed={!isWeekdaysOnly}
                                        onPressedChange={() =>
                                            handleToggle("weekdaysAndWeekends")
                                        }
                                        className={
                                            isWeekdaysOnly ? "" : "outline-dark"
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
                                            timeRange === "06:00:00-21:00:00"
                                        }
                                        onPressedChange={() =>
                                            handleTimeRangeToggle(
                                                "06:00:00-21:00:00"
                                            )
                                        }
                                        className={
                                            timeRange === "06:00:00-21:00:00"
                                                ? "outline-dark"
                                                : ""
                                        }
                                    >
                                        6:00 AM - 9:00 PM
                                    </Toggle>
                                    <Toggle
                                        variant="outline"
                                        pressed={
                                            timeRange === "08:00:00-17:00:00"
                                        }
                                        onPressedChange={() =>
                                            handleTimeRangeToggle(
                                                "08:00:00-17:00:00"
                                            )
                                        }
                                        className={
                                            timeRange === "08:00:00-17:00:00"
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
                            <div>
                                <div>
                                    <Label htmlFor="time-snap">Time Snap</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Toggle
                                        id="time-snap"
                                        variant="outline"
                                        pressed={timeSnap === "00:01:00"}
                                        onPressedChange={() =>
                                            setTimeSnap("00:01:00")
                                        }
                                        className={
                                            timeSnap === "00:01:00"
                                                ? "outline-dark"
                                                : ""
                                        }
                                    >
                                        1:00
                                    </Toggle>
                                    <Toggle
                                        variant="outline"
                                        pressed={timeSnap === "00:05:00"}
                                        onPressedChange={() =>
                                            setTimeSnap("00:05:00")
                                        }
                                        className={
                                            timeSnap === "00:05:00"
                                                ? "outline-dark"
                                                : ""
                                        }
                                    >
                                        5:00
                                    </Toggle>
                                    <Toggle
                                        variant="outline"
                                        pressed={timeSnap === "00:10:00"}
                                        onPressedChange={() =>
                                            setTimeSnap("00:10:00")
                                        }
                                        className={
                                            timeSnap === "00:10:00"
                                                ? "outline-dark"
                                                : ""
                                        }
                                    >
                                        10:00
                                    </Toggle>
                                    <Toggle
                                        variant="outline"
                                        pressed={timeSnap === "00:30:00"}
                                        onPressedChange={() =>
                                            setTimeSnap("00:30:00")
                                        }
                                        className={
                                            timeSnap === "00:30:00"
                                                ? "outline-dark"
                                                : ""
                                        }
                                    >
                                        30:00
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
                {/* ////need to add prind use ref */}
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
                                    //nowIndicator={false} //not working
                                    plugins={[
                                        timeGridPlugin,
                                        interactionPlugin,
                                        listPlugin,
                                    ]}
                                    initialView="timeGridWeek"
                                    // eventMouseEnter={(info) => {
                                    //     alert("Mouse Enter");
                                    // }}
                                    editable={!areFieldsEmpty}
                                    droppable={!areFieldsEmpty}
                                    selectable={!areFieldsEmpty}
                                    headerToolbar={false} // Hide default header
                                    snapDuration={timeSnap}
                                    eventResizableFromStart={true}
                                    events={events.map((event) => ({
                                        //need change events to add data to access the second data (not yet implemented)
                                        ...event,
                                        display: "block",
                                        editable: !areFieldsEmpty,
                                    }))}
                                    drop={
                                        !areFieldsEmpty
                                            ? handleClassDrop
                                            : undefined
                                    }
                                    eventDrop={
                                        !areFieldsEmpty
                                            ? handleEventDrop
                                            : undefined
                                    }
                                    eventResize={
                                        !areFieldsEmpty
                                            ? handleEventResize
                                            : undefined
                                    }
                                    eventContent={(
                                        eventInfo: EventContentArg
                                    ) => (
                                        <FullCalendarDialog
                                            eventInfo={eventInfo}
                                            events={events}
                                            setEvents={setEvents}
                                            userTheme={userTheme}
                                            systemTheme={systemTheme}
                                            hoverCheckForConflicts={
                                                hoverCheckForConflicts
                                            }
                                        />
                                    )}
                                    slotMinTime={timeRange.split("-")[0]}
                                    slotMaxTime={timeRange.split("-")[1]}
                                    allDaySlot={false}
                                    dayHeaderFormat={{
                                        weekday: dayFormat,
                                    }}
                                    /////////////////////////////////////////////////////////////////////////

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
                                    ///////////////////////////////////////////////////////////////////////////
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
                                    hiddenDays={isWeekdaysOnly ? [0, 6] : []} // Hide Sunday (0) and Saturday (6) if weekdays only
                                    listDaySideFormat={false}
                                    slotEventOverlap={false}
                                    // headerToolbar={{
                                    //     left: "",
                                    //     center: "title",
                                    //     right: "",
                                    // }}
                                    // titleFormat={{
                                    //     year: "numeric",
                                    //     month: "long",
                                    // }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add DropCalendarDialog */}
            {dropInfo && (
                <DropCalendarDialog
                    isOpen={dropDialogOpen}
                    onClose={handleDropDialogClose}
                    onSave={handleDropSave}
                    dropInfo={dropInfo}
                    section={section}
                    year={year}
                    semester={semester}
                    course={course}
                    userTheme={userTheme}
                    systemTheme={systemTheme}
                />
            )}
        </div>
    );
}
