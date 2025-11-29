import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import "./FacultyCalendar.css";
import { Label } from "@/Components/ui/label";
import { CalendarCog } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { Toggle } from "@/Components/ui/toggle";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Document,
    Packer,
    Paragraph,
    Table as DocTable,
    TableRow as DocTableRow,
    TableCell as DocTableCell,
    WidthType,
    Header,
    Footer,
    ImageRun,
    TextRun,
    AlignmentType,
    HorizontalPositionRelativeFrom,
    HorizontalPositionAlign,
    VerticalPositionRelativeFrom,
    VerticalPositionAlign,
} from "docx";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import * as XLSX from "xlsx-js-style";
import { toast_error, toast_info } from "@/types/my_types/mytoast";
import { scheduler } from "timers/promises";
import { Link } from "@inertiajs/react";
import { create } from "domain";

interface FacultyCalendarProps {
    teacherId?: number;
    teacherName?: string;
    departmentName: string;
    year: string;
    semester: string;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    userRole: "user" | "admin" | "super-admin";
    userName: string;
    deanName: string;
}

interface ScheduleEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    SubjectName: string;
    room: string;
    color: string;
    section: string;
    course: string;
    units: string;
    lec: number;
    lab: number;
    label: string;
    conflict?: boolean;
    teacher?: string;
}

interface TimeSchedulingSettings {
    dayFormat: "long" | "short" | "narrow";
    isWeekdaysOnly: boolean;
    timeRange: string;
    timeFormat: boolean;
}

export default function FacultyCalendar({
    teacherId,
    teacherName,
    departmentName,
    year,
    semester,
    userTheme,
    systemTheme,
    userName,
    userRole,
    deanName,
}: FacultyCalendarProps) {
    const calendarRef = useRef<FullCalendar>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [view, setView] = useState<"calendar" | "list" | "table">("calendar");
    const [hoverConflicts, setHoverConflicts] = useState<any[]>([]);
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

    const defaultSettings: TimeSchedulingSettings = {
        dayFormat: "long",
        isWeekdaysOnly: false,
        timeRange: "06:00:00-21:00:00",
        timeFormat: false,
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

    useEffect(() => {
        const settings: TimeSchedulingSettings = {
            dayFormat,
            isWeekdaysOnly,
            timeRange,
            timeFormat,
        };
        localStorage.setItem(
            "timeSchedulingSettings",
            JSON.stringify(settings)
        );
    }, [dayFormat, isWeekdaysOnly, timeRange, timeFormat]);

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
    };

    const handleViewChange = (newView: "calendar" | "list" | "table") => {
        setView(newView);
        if (calendarRef.current && newView !== "table") {
            calendarRef.current
                .getApi()
                .changeView(newView === "list" ? "listWeek" : "timeGridWeek");
        }
    };

    useEffect(() => {
        if (teacherId && year && semester) {
            setLoading(true);
            axios
                .get(
                    route("faculty_schedule.get_schedules", {
                        teacher_id: teacherId,
                        year: year,
                        semester: semester,
                    })
                )
                .then((response) => {
                    const formattedEvents = response.data.map(
                        (schedule: ScheduleEvent) => ({
                            id: schedule.id,
                            title: `${schedule.title} - ${schedule.room}`,
                            startTime: schedule.startTime,
                            endTime: schedule.endTime,
                            daysOfWeek: schedule.daysOfWeek,
                            extendedProps: {
                                room: schedule.room,
                                title: schedule.title,
                                subject: schedule.SubjectName,
                                section: schedule.section,
                                course: schedule.course,
                                units: schedule.units,
                                lec: schedule.lec,
                                lab: schedule.lab,
                                label: schedule.label,
                                conflict: schedule.conflict,
                            },
                            color: schedule.color,
                        })
                    );
                    setEvents(formattedEvents);
                    setLoading(false);
                    console.log("Events:", formattedEvents);
                })
                .catch((error) => {
                    console.error("Error fetching teacher schedules:", error);
                    setLoading(false);
                });
        }
    }, [teacherId, year, semester]);

    const handleHoverConflict = async (eventInfo: any) => {
        setHoveredEventId(eventInfo.event.id);
        setHoverConflicts([]);
        const ext = eventInfo.event.extendedProps;
        const room = ext.room;
        const id = eventInfo.event.id;
        const start = eventInfo.event.start;
        const end = eventInfo.event.end;
        const schedYear = year;
        const schedSemester = semester;

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
                    params: { year: schedYear, semester: schedSemester, room },
                }
            );
            const roomEvents = response.data;

            // Find conflicts
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
            console.error("Error checking conflicts:", error);
            setHoverConflicts([]);
        }
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const renderTableView = () => {
        const sortedEvents = [...events].sort((a, b) => {
            const daysA = Array.isArray(a.daysOfWeek)
                ? a.daysOfWeek
                : JSON.parse(a.daysOfWeek || "[]");
            const daysB = Array.isArray(b.daysOfWeek)
                ? b.daysOfWeek
                : JSON.parse(b.daysOfWeek || "[]");

            const dayA = daysA[0] ?? 0;
            const dayB = daysB[0] ?? 0;

            if (dayA !== dayB) return dayA - dayB;
            return a.startTime.localeCompare(b.startTime);
        });

        const formatTime = (timeStr: string) => {
            const [hours, minutes] = timeStr.split(":").slice(0, 2).map(Number);
            const period = hours >= 12 ? "PM" : "AM";
            const displayHours = hours % 12 || 12;
            const displayMinutes = minutes.toString().padStart(2, "0");

            return `${displayHours}:${displayMinutes} ${period}`;
        };

        const dayAbbreviations = ["S", "M", "T", "W", "Th", "F", "Sa"];

        return (
            <div id="faculty_table_view" className="w-full border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">Day</TableHead>
                            <TableHead className="font-semibold">
                                Time
                            </TableHead>
                            <TableHead className="font-semibold">
                                Subject
                            </TableHead>
                            <TableHead className="font-semibold">
                                Section
                            </TableHead>
                            <TableHead className="font-semibold">
                                Room
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedEvents.map((event, index) => {
                            const daysArray = Array.isArray(event.daysOfWeek)
                                ? event.daysOfWeek
                                : JSON.parse(event.daysOfWeek || "[]");

                            const dayString = daysArray
                                .map(
                                    (day: string | number) =>
                                        dayAbbreviations[Number(day)]
                                )
                                .join("");

                            return (
                                <TableRow key={`${event.id}-${index}`}>
                                    <TableCell className="font-medium">
                                        {dayString}
                                    </TableCell>
                                    <TableCell>
                                        {`${formatTime(
                                            event.startTime
                                        )} - ${formatTime(event.endTime)}`}
                                    </TableCell>
                                    <TableCell>
                                        {event.extendedProps.subject}
                                    </TableCell>
                                    <TableCell>
                                        {event.extendedProps.section}
                                    </TableCell>
                                    <TableCell>
                                        {event.extendedProps.room}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const baseUrl = import.meta.env.VITE_APP_URL;
    const [imageFooterUrl, setImageFooterUrl] = useState("");
    const [imageHeaderUrl, setImageHeaderUrl] = useState("");

    useEffect(() => {
        axios
            .get(
                route("get_active_header_footer", { type: "curriculum_header" })
            )
            .then((response) => {
                if (response.data && response.data.image) {
                    setImageHeaderUrl(
                        `${baseUrl}/storage/${response.data.image}`
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching active header image:", error);
            });

        axios
            .get(
                route("get_active_header_footer", { type: "curriculum_footer" })
            )
            .then((response) => {
                if (response.data && response.data.image) {
                    setImageFooterUrl(
                        `${baseUrl}/storage/${response.data.image}`
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching active footer image:", error);
            });
    }, []);

    //old
    //download word - notice of teaching assignment
    // const downloadWord = async () => {
    //     if (!year || !semester || events.length === 0) {
    //         toast_info({
    //             message: `It looks like ${teacherName} doesn't have a schedule yet.`,
    //             userTheme: userTheme,
    //         });
    //         return;
    //     }

    //     const today = new Date().toLocaleDateString("en-US", {
    //         month: "long",
    //         day: "numeric",
    //         year: "numeric",
    //     });
    //     const facultyName = teacherName?.toUpperCase();
    //     const deptName = `Department of ${departmentName}`;
    //     const college = "College of Engineering";

    //     const fetchImage = async (url: string) => {
    //         const response = await fetch(url);
    //         return response.arrayBuffer();
    //     };

    //     const headerImage = new ImageRun({
    //         data: await fetchImage(imageHeaderUrl),
    //         transformation: { width: 810, height: 130 },
    //         type: "png",
    //         floating: {
    //             horizontalPosition: {
    //                 relative: HorizontalPositionRelativeFrom.PAGE,
    //                 align: HorizontalPositionAlign.LEFT,
    //             },
    //             verticalPosition: {
    //                 relative: VerticalPositionRelativeFrom.PAGE,
    //                 align: VerticalPositionAlign.TOP,
    //             },
    //         },
    //     });

    //     const footerImage = new ImageRun({
    //         data: await fetchImage(imageFooterUrl),
    //         transformation: { width: 810, height: 130 },
    //         type: "png",
    //         floating: {
    //             horizontalPosition: {
    //                 relative: HorizontalPositionRelativeFrom.PAGE,
    //                 align: HorizontalPositionAlign.LEFT,
    //             },
    //             verticalPosition: {
    //                 relative: VerticalPositionRelativeFrom.PAGE,
    //                 align: VerticalPositionAlign.BOTTOM,
    //             },
    //         },
    //     });

    //     const createSpacer = () =>
    //         new Paragraph({
    //             children: [
    //                 new TextRun({ text: "\n", size: 22, font: "Calibri" }),
    //             ],
    //             alignment: "left",
    //         });

    //     const createTextHeader = (text: string, bold: boolean = false) =>
    //         new Paragraph({
    //             children: [
    //                 new TextRun({ text, size: 22, font: "Calibri", bold }),
    //             ],
    //             alignment: "center",
    //         });

    //     const createTextParagraph = (text: string, bold: boolean = false) =>
    //         new Paragraph({
    //             children: [
    //                 new TextRun({ text, size: 22, font: "Calibri", bold }),
    //             ],
    //             alignment: "left",
    //         });

    //     const createTextParagraphJustify = (
    //         text: string,
    //         bold: boolean = false
    //     ) =>
    //         new Paragraph({
    //             children: [
    //                 new TextRun({ text, size: 22, font: "Calibri", bold }),
    //             ],
    //             alignment: AlignmentType.JUSTIFIED,
    //             spacing: {
    //                 line: 276, // 1.15 * 240 (240 is the default line spacing)
    //                 lineRule: "auto",
    //             },
    //         });

    //     const createTextSign = (text: string, bold: boolean = false) =>
    //         new Paragraph({
    //             children: [
    //                 new TextRun({ text, size: 22, font: "Calibri", bold }),
    //             ],
    //             alignment: "right",
    //         });

    //     const createTableCellLeft = (
    //         text: string,
    //         width: number,
    //         bold: boolean = false
    //     ) =>
    //         new DocTableCell({
    //             children: [
    //                 new Paragraph({
    //                     children: [
    //                         new TextRun({
    //                             text,
    //                             size: 22,
    //                             font: "Calibri",
    //                             bold,
    //                         }),
    //                     ],
    //                     alignment: "left",
    //                 }),
    //             ],
    //             width: { size: width, type: WidthType.PERCENTAGE },
    //             borders: {
    //                 top: { style: "none", size: 0, color: "FFFFFF" },
    //                 bottom: { style: "none", size: 0, color: "FFFFFF" },
    //                 left: { style: "none", size: 0, color: "FFFFFF" },
    //                 right: { style: "none", size: 0, color: "FFFFFF" },
    //             },
    //         });

    //     const createTableCellCenter = (
    //         text: string,
    //         width: number,
    //         bold: boolean = false
    //     ) =>
    //         new DocTableCell({
    //             children: [
    //                 new Paragraph({
    //                     children: [
    //                         new TextRun({
    //                             text,
    //                             size: 22,
    //                             font: "Calibri",
    //                             bold,
    //                         }),
    //                     ],
    //                     alignment: "center",
    //                 }),
    //             ],
    //             width: { size: width, type: WidthType.PERCENTAGE },
    //             borders: {
    //                 top: { style: "none", size: 0, color: "FFFFFF" },
    //                 bottom: { style: "none", size: 0, color: "FFFFFF" },
    //                 left: { style: "none", size: 0, color: "FFFFFF" },
    //                 right: { style: "none", size: 0, color: "FFFFFF" },
    //             },
    //         });

    //     const formatTime = (timeStr: string) => {
    //         const [hours, minutes] = timeStr.split(":").slice(0, 2).map(Number);
    //         const period = hours >= 12 ? "PM" : "AM";
    //         const displayHours = hours % 12 || 12;
    //         const displayMinutes = minutes.toString().padStart(2, "0");

    //         return `${displayHours}:${displayMinutes} ${period}`;
    //     };

    //     const dayAbbreviations = ["S", "M", "T", "W", "Th", "F", "Sa"];

    //     // Calculate total units and load
    //     const totalUnits = events.reduce(
    //         (sum, event) => sum + event.extendedProps.units,
    //         0
    //     );
    //     const totalLoad = events.reduce(
    //         (sum, event) =>
    //             sum + (event.extendedProps.lec + event.extendedProps.lab),
    //         0
    //     );

    //     const doc: Document = new Document({
    //         sections: [
    //             {
    //                 properties: {
    //                     page: {
    //                         size: {
    //                             width: 12120, // Legal page width in twips (8.5 inches)
    //                             height: 20160, // Legal page height in twips (14 inches)
    //                         },
    //                     },
    //                 },
    //                 headers: {
    //                     default: new Header({
    //                         children: [
    //                             new Paragraph({ children: [headerImage] }),
    //                         ],
    //                     }),
    //                 },
    //                 footers: {
    //                     default: new Footer({
    //                         children: [
    //                             new Paragraph({ children: [footerImage] }),
    //                         ],
    //                     }),
    //                 },
    //                 children: [
    //                     createSpacer(),
    //                     createSpacer(),
    //                     createTextHeader("NOTICE OF TEACHING ASSIGNMENT", true),
    //                     createSpacer(),
    //                     createTextParagraph(`${today}`),
    //                     createSpacer(),
    //                     createTextParagraph(
    //                         facultyName || "FACULTY NAME",
    //                         true
    //                     ),
    //                     createTextParagraph(deptName, true),
    //                     createTextParagraph(college, true),
    //                     createSpacer(),
    //                     createSpacer(),
    //                     createTextParagraph(
    //                         `Per Endorsement of the concerned department, you are hereby assigned to teach the following subjects during the ${semester}, AY ${year} - ${
    //                             Number(year) + 1
    //                         }.`
    //                     ),
    //                     createSpacer(),
    //                     new DocTable({
    //                         rows: [
    //                             new DocTableRow({
    //                                 children: [
    //                                     createTableCellCenter("Code", 10, true),
    //                                     createTableCellCenter(
    //                                         "Subject Title",
    //                                         20,
    //                                         true
    //                                     ),
    //                                     createTableCellCenter(
    //                                         "Section",
    //                                         10,
    //                                         true
    //                                     ),
    //                                     createTableCellCenter(
    //                                         "# of Units",
    //                                         10,
    //                                         true
    //                                     ),
    //                                     createTableCellCenter(
    //                                         "Actual Load",
    //                                         10,
    //                                         true
    //                                     ),
    //                                     createTableCellCenter(
    //                                         "Schedule",
    //                                         10,
    //                                         true
    //                                     ),
    //                                     createTableCellCenter("Day", 10, true),
    //                                     createTableCellCenter("Room", 10, true),
    //                                 ],
    //                             }),
    //                             ...events
    //                                 .map((event) => {
    //                                     const daysArray = Array.isArray(
    //                                         event.daysOfWeek
    //                                     )
    //                                         ? event.daysOfWeek
    //                                         : JSON.parse(
    //                                               event.daysOfWeek || "[]"
    //                                           );

    //                                     const dayString = daysArray
    //                                         .map(
    //                                             (day: string | number) =>
    //                                                 dayAbbreviations[
    //                                                     Number(day)
    //                                                 ]
    //                                         )
    //                                         .join("");

    //                                     return [
    //                                         new DocTableRow({
    //                                             children: [
    //                                                 createTableCellLeft(
    //                                                     event.title.split(
    //                                                         " - "
    //                                                     )[0],
    //                                                     10,
    //                                                     true
    //                                                 ),
    //                                                 createTableCellLeft(
    //                                                     event.extendedProps
    //                                                         .subject,
    //                                                     20
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     event.extendedProps
    //                                                         .section,
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     event.extendedProps.units.toString(),
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     (
    //                                                         event.extendedProps
    //                                                             .lec +
    //                                                         event.extendedProps
    //                                                             .lab
    //                                                     ).toString(),
    //                                                     10
    //                                                 ), // Placeholder for Actual Load
    //                                                 createTableCellCenter(
    //                                                     `${formatTime(
    //                                                         event.startTime
    //                                                     )} - ${formatTime(
    //                                                         event.endTime
    //                                                     )}`,
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     dayString,
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     event.extendedProps
    //                                                         .room,
    //                                                     10
    //                                                 ),
    //                                             ],
    //                                         }),
    //                                         new DocTableRow({
    //                                             children: [
    //                                                 createTableCellLeft("", 10),
    //                                                 createTableCellLeft("", 20),
    //                                                 createTableCellCenter(
    //                                                     "",
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     "",
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     "",
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     "",
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     "",
    //                                                     10
    //                                                 ),
    //                                                 createTableCellCenter(
    //                                                     "",
    //                                                     10
    //                                                 ),
    //                                             ],
    //                                         }),
    //                                     ];
    //                                 })
    //                                 .flat(),
    //                             // Add the total row
    //                             new DocTableRow({
    //                                 children: [
    //                                     createTableCellLeft("Total", 10, true),
    //                                     createTableCellLeft("", 20),
    //                                     createTableCellCenter("", 10),
    //                                     createTableCellCenter(
    //                                         totalUnits.toString(),
    //                                         10,
    //                                         true
    //                                     ),
    //                                     createTableCellCenter(
    //                                         totalLoad.toString(),
    //                                         10,
    //                                         true
    //                                     ),
    //                                     createTableCellCenter("", 10),
    //                                     createTableCellCenter("", 10),
    //                                     createTableCellCenter("", 10),
    //                                 ],
    //                             }),
    //                         ],
    //                     }),
    //                     createSpacer(),
    //                     createSpacer(),
    //                     createTextParagraphJustify(
    //                         "Classes start on August 19, 2024; hence, please be in the rooms assigned to your subjects to receive and start meeting your students, In addition, you are advised to prepare instructional materials for your assigned subjects. You are also advised to print the class roster, check the list of students enrolled in your class and make necessary corrections before submission to the office. Submit to the College Secretary the number of students attending your classes, changes in your schedule, and the subject dissolved or added to your load to update the faculty workload of the college. Furthermore, submit your updated syllabi in each subject you are assigned to your Department Chair for checking before distribution to the students on the first day of classes."
    //                     ),
    //                     createSpacer(),
    //                     createSpacer(),
    //                     createTextSign("Very truly yours,"),
    //                     createSpacer(),
    //                     createSpacer(),
    //                     createTextSign("SHARONA Q. BARROGA", true),
    //                 ],
    //             },
    //         ],
    //     });

    //     Packer.toBlob(doc).then((blob: any) => {
    //         saveAs(blob, `${facultyName}_TEACHING_ASSIGNMENT.docx`);
    //     });
    // };
    //end of download word

    const [notaBody, setNotaBody] = useState("");
    const [notaIntro, setNotaIntro] = useState("");
    useEffect(() => {
        axios.get(route("edit_nota.show")).then((res) => {
            if (res.data && res.data.data) {
                setNotaIntro(res.data.data.intro || "");
                setNotaBody(res.data.data.body || "");
            }
        });
    }, []);

    const downloadWord = async () => {
        if (!year || !semester || events.length === 0) {
            toast_info({
                message: `It looks like ${teacherName} doesn't have a schedule yet.`,
                userTheme: userTheme,
            });
            return;
        }

        const today = new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        const facultyName = teacherName?.toUpperCase();
        const deptName = `Department of ${departmentName}`;
        const college = "College of Engineering";

        const fetchImage = async (url: string) => {
            const response = await fetch(url);
            return response.arrayBuffer();
        };

        const headerImage = new ImageRun({
            data: await fetchImage(imageHeaderUrl),
            transformation: { width: 800, height: 130 },
            type: "png",
            floating: {
                horizontalPosition: {
                    relative: HorizontalPositionRelativeFrom.PAGE,
                    align: HorizontalPositionAlign.LEFT,
                },
                verticalPosition: {
                    relative: VerticalPositionRelativeFrom.PAGE,
                    align: VerticalPositionAlign.TOP,
                },
            },
        });

        const footerImage = new ImageRun({
            data: await fetchImage(imageFooterUrl),
            transformation: { width: 810, height: 130 },
            type: "png",
            floating: {
                horizontalPosition: {
                    relative: HorizontalPositionRelativeFrom.PAGE,
                    align: HorizontalPositionAlign.LEFT,
                },
                verticalPosition: {
                    relative: VerticalPositionRelativeFrom.PAGE,
                    align: VerticalPositionAlign.BOTTOM,
                },
            },
        });

        const createSpacer = () =>
            new Paragraph({
                children: [
                    new TextRun({ text: "\n", size: 22, font: "Calibri" }),
                ],
                alignment: "left",
            });

        const createTextHeader = (text: string, bold: boolean = false) =>
            new Paragraph({
                children: [
                    new TextRun({ text, size: 22, font: "Calibri", bold }),
                ],
                alignment: "center",
            });

        const createTextParagraph = (text: string, bold: boolean = false) =>
            new Paragraph({
                children: [
                    new TextRun({ text, size: 22, font: "Calibri", bold }),
                ],
                alignment: "left",
            });

        const createTextParagraphJustify = (
            text: string,
            bold: boolean = false
        ) =>
            new Paragraph({
                children: [
                    new TextRun({ text, size: 22, font: "Calibri", bold }),
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    line: 276,
                    lineRule: "auto",
                },
            });

        const createTextSign = (text: string, bold: boolean = false) =>
            new Paragraph({
                children: [
                    new TextRun({ text, size: 22, font: "Calibri", bold }),
                ],
                alignment: "right",
            });

        const createTableCellLeft = (
            text: string,
            width: number,
            bold: boolean = false
        ) =>
            new DocTableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text,
                                size: 22,
                                font: "Calibri",
                                bold,
                            }),
                        ],
                        alignment: "left",
                    }),
                ],
                width: { size: width, type: WidthType.PERCENTAGE },
                //no borders
                // borders: {
                //     top: { style: "none", size: 0, color: "FFFFFF" },
                //     bottom: { style: "none", size: 0, color: "FFFFFF" },
                //     left: { style: "none", size: 0, color: "FFFFFF" },
                //     right: { style: "none", size: 0, color: "FFFFFF" },
                // },
                borders: {
                    top: { style: "single", size: 1, color: "000000" },
                    bottom: { style: "single", size: 1, color: "000000" },
                    left: { style: "single", size: 1, color: "000000" },
                    right: { style: "single", size: 1, color: "000000" },
                },
            });

        const createTableCellCenter = (
            text: string,
            width: number,
            bold: boolean = false
        ) =>
            new DocTableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text,
                                size: 22,
                                font: "Calibri",
                                bold,
                            }),
                        ],
                        alignment: "center",
                    }),
                ],
                width: { size: width, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: "single", size: 1, color: "000000" },
                    bottom: { style: "single", size: 1, color: "000000" },
                    left: { style: "single", size: 1, color: "000000" },
                    right: { style: "single", size: 1, color: "000000" },
                },
            });

        const formatTime = (timeStr: string) => {
            const [hours, minutes] = timeStr.split(":").slice(0, 2).map(Number);

            //format hours to a 12-hour clock without AM/PM
            const displayHours = hours % 12 || 12;

            //if minutes are zero, remove them from the output
            const formattedMinutes =
                minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;

            return `${displayHours}${formattedMinutes}`;
        };

        const dayAbbreviations = ["S", "M", "T", "W", "Th", "F", "Sa"];

        // Helper function to determine if an event is lab or split
        const isLabOrSplitMerge = (label: string | undefined) => {
            return (
                label?.toLowerCase().startsWith("lab") ||
                label?.toLowerCase().startsWith("split 1") ||
                label?.toLowerCase().startsWith("split")
            );
        };

        // Merging logic
        const mergedEvents = Object.values(
            events.reduce((acc, event) => {
                const teacher = event.extendedProps.teacher || "unknown";
                //merge if teacher and split label are the same
                const key = isLabOrSplitMerge(event.extendedProps.label)
                    ? `${event.extendedProps.subject}-${event.extendedProps.section}-${teacher}-${event.extendedProps.label}`
                    : `${event.extendedProps.subject}-${event.extendedProps.section}`;

                if (!acc[key]) {
                    acc[key] = {
                        ...event,
                        daysOfWeek: new Set(
                            Array.isArray(event.daysOfWeek)
                                ? event.daysOfWeek
                                : JSON.parse(event.daysOfWeek || "[]")
                        ),
                        timeRanges: new Set([
                            `${formatTime(event.startTime)} - ${formatTime(
                                event.endTime
                            )}`,
                        ]),
                    };
                } else {
                    const eventDays = Array.isArray(event.daysOfWeek)
                        ? event.daysOfWeek
                        : JSON.parse(event.daysOfWeek || "[]");

                    for (const day of eventDays) {
                        acc[key].daysOfWeek.add(day);
                    }

                    acc[key].timeRanges.add(
                        `${formatTime(event.startTime)} - ${formatTime(
                            event.endTime
                        )}`
                    );
                }
                return acc;
            }, {} as Record<string, any>)
        ).map((event: any) => ({
            ...event,
            daysOfWeek: Array.from(event.daysOfWeek).sort(),
            timeRanges: Array.from(event.timeRanges).join(" / "),
        }));

        // Helper functions to determine lab or split and calculate actual load
        //1lec = 1hour | 1lab = 3hours
        //if ada label na nga lab or split then iconsider na nga lab tay subject
        //ngem nu awan label na ngem 0 met lec na then iconsider na latta a lab
        const isLabOrSplit = (label: string | undefined, lec: number) => {
            return (
                label?.toLowerCase().startsWith("lab") ||
                label?.toLowerCase().startsWith("split 1") ||
                label?.toLowerCase().startsWith("split") ||
                lec === 0
            );
        };

        const calculateActualLoad = (
            label: string | undefined,
            lec: number,
            lab: number
        ) => {
            if (isLabOrSplit(label, lec)) {
                return (lab > 0 ? lab : lec) * 3;
            }
            return lec || 0;
        };

        // total load
        const totalLoad = mergedEvents.reduce((sum, event) => {
            const actualLoad = calculateActualLoad(
                event.extendedProps.label,
                event.extendedProps.lec,
                event.extendedProps.lab
            );
            return sum + actualLoad;
        }, 0);

        // total units
        const totalUnits = mergedEvents.reduce((sum, event) => {
            const isLabOrSplitSubject = isLabOrSplit(
                event.extendedProps.label,
                event.extendedProps.lec
            );

            const units = isLabOrSplitSubject
                ? event.extendedProps.lab
                : event.extendedProps.lec;

            return sum + units;
        }, 0);

        // displaying the actual load in excel
        const createTableCellForLoad = (event: any) => {
            return createTableCellCenter(
                calculateActualLoad(
                    event.extendedProps.label,
                    event.extendedProps.lec,
                    event.extendedProps.lab
                ).toString(),
                10
            );
        };

        const createTableCellForUnits = (event: any) => {
            const isLabOrSplitSubject = isLabOrSplit(
                event.extendedProps.label,
                event.extendedProps.lec
            );

            const units = isLabOrSplitSubject
                ? event.extendedProps.lab
                : event.extendedProps.lec;

            return createTableCellCenter(units.toString(), 10);
        };

        const doc: Document = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            size: {
                                width: 12120,
                                height: 20160,
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({ children: [headerImage] }),
                            ],
                        }),
                    },
                    footers: {
                        default: new Footer({
                            children: [
                                new Paragraph({ children: [footerImage] }),
                            ],
                        }),
                    },
                    children: [
                        createSpacer(),
                        createSpacer(),
                        createTextHeader("NOTICE OF TEACHING ASSIGNMENT", true),
                        createSpacer(),
                        createTextParagraph(`${today}`),
                        createSpacer(),
                        createTextParagraph(
                            facultyName || "FACULTY NAME",
                            true
                        ),
                        createTextParagraph(deptName, true),
                        createTextParagraph(college, true),
                        createSpacer(),
                        createSpacer(),
                        createTextParagraph(
                            notaIntro +
                                " " +
                                `${semester}, AY ${year} - ${Number(year) + 1}.`
                        ),
                        createSpacer(),
                        new DocTable({
                            rows: [
                                new DocTableRow({
                                    children: [
                                        createTableCellCenter("Code", 10, true),
                                        createTableCellCenter(
                                            "Subject Title",
                                            20,
                                            true
                                        ),
                                        createTableCellCenter(
                                            "Section",
                                            10,
                                            true
                                        ),
                                        createTableCellCenter(
                                            "# of Units",
                                            10,
                                            true
                                        ),
                                        createTableCellCenter(
                                            "Actual Load",
                                            10,
                                            true
                                        ),
                                        createTableCellCenter(
                                            "Schedule",
                                            10,
                                            true
                                        ),
                                        createTableCellCenter("Day", 10, true),
                                        createTableCellCenter("Room", 10, true),
                                    ],
                                }),
                                ...mergedEvents.map(
                                    (event) =>
                                        new DocTableRow({
                                            children: [
                                                createTableCellLeft(
                                                    event.title.split(" - ")[0],
                                                    10,
                                                    true
                                                ),
                                                createTableCellLeft(
                                                    event.extendedProps.subject,
                                                    20
                                                ),
                                                createTableCellCenter(
                                                    event.extendedProps.section,
                                                    10
                                                ),
                                                createTableCellForUnits(event),
                                                createTableCellForLoad(event),
                                                createTableCellCenter(
                                                    event.timeRanges,
                                                    10
                                                ),
                                                createTableCellCenter(
                                                    event.daysOfWeek
                                                        .map(
                                                            (
                                                                day:
                                                                    | string
                                                                    | number
                                                            ) =>
                                                                dayAbbreviations[
                                                                    Number(day)
                                                                ]
                                                        )
                                                        .join(""),
                                                    10
                                                ),
                                                createTableCellCenter(
                                                    event.extendedProps.room,
                                                    10
                                                ),
                                            ],
                                        })
                                ),
                                new DocTableRow({
                                    children: [
                                        createTableCellLeft("Total", 10, true),
                                        createTableCellLeft("", 20),
                                        createTableCellCenter("", 10),
                                        createTableCellCenter(
                                            totalUnits.toString(),
                                            10,
                                            true
                                        ),
                                        createTableCellCenter(
                                            totalLoad.toString(),
                                            10,
                                            true
                                        ),
                                        createTableCellCenter("", 10),
                                        createTableCellCenter("", 10),
                                        createTableCellCenter("", 10),
                                    ],
                                }),
                            ],
                        }),
                        createSpacer(),
                        createSpacer(),
                        createTextParagraphJustify(notaBody),
                        createSpacer(),
                        createSpacer(),
                        createTextSign("Very truly yours,"),
                        createSpacer(),
                        createSpacer(),
                        createTextSign(deanName.toUpperCase(), true),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob: any) => {
            saveAs(blob, `${facultyName}_TEACHING_ASSIGNMENT.docx`);
        });
    };

    //download schedule as excel
    const downloadScheduleAsExcel = () => {
        if (!teacherId || !year || !semester || events.length === 0) {
            toast_info({
                message: `It looks like ${teacherName} doesn't have a schedule yet.`,
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

        // Filter days based on the isWeekdaysOnly toggle
        const days = isWeekdaysOnly
            ? dayFormats[dayFormat].slice(0, 5) // Monday to Friday
            : dayFormats[dayFormat]; // Sunday to Saturday

        const wsData: any[][] = [
            ["Schedule for " + (teacherName || "Teacher")],
            [`${semester}, Academic Year ${year} - ${Number(year) + 1}`],
            ["Time", ...days],
        ];

        timeSlots.forEach((slot) => {
            const timeSlot = timeFormat
                ? slot.timeSlotAMPM
                : slot.timeSlotAMPM.split("-")[0];
            wsData.push([timeSlot, ...new Array(days.length).fill("")]);
        });

        // Helper: robust isTimeInRange for start and end
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

                // Find rowIndex and endIndex robustly, clamp if not found
                const rowIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(event.startTime, slot.timeSlot24)
                );
                const endIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(event.endTime, slot.timeSlot24, true)
                );

                // Clamp to last slot if not found
                const safeRowIndex =
                    rowIndexRaw !== -1 ? rowIndexRaw + 3 : timeSlots.length + 2;
                const safeEndIndex =
                    endIndexRaw !== -1 ? endIndexRaw + 3 : timeSlots.length + 3;

                if (safeRowIndex > 0) {
                    const cellText = `${event.extendedProps.title}\n  ${
                        event.extendedProps.section
                    } ${
                        event.extendedProps.label
                            ? ` (${event.extendedProps.label})`
                            : ""
                    }\n  ${event.extendedProps.room}`;
                    wsData[safeRowIndex][col + 1] = cellText;

                    for (let r = safeRowIndex + 1; r < safeEndIndex; r++) {
                        wsData[r][col + 1] = "";
                    }
                }
            });
        });

        const worksheet = XLSX.utils.aoa_to_sheet(wsData);

        // Style headers (row 2 for "Time" and days)
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

        // Style time column (first column for time slots)
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

        // Add borders and styles to all cells
        Object.keys(worksheet).forEach((key) => {
            if (key[0] === "!") return; // Skip metadata keys
            if (!worksheet[key].s) worksheet[key].s = {};
            worksheet[key].s.border = {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            };
        });

        // Style title and subtitle rows
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

                // Robust row calculation for merging and styling
                const rowIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(event.startTime, slot.timeSlot24)
                );
                const endIndexRaw = timeSlots.findIndex((slot) =>
                    isTimeInRange(event.endTime, slot.timeSlot24, true)
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

        worksheet["!cols"] = Array(days.length + 1).fill({ wch: 25 });
        worksheet["!rows"] = wsData.map(() => ({ hpx: 35 }));

        const sheetName = `${teacherName || "Schedule"}`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const fileName = `${
            teacherName || "Schedule"
        }_${semester}_${year}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    // Helper function to check if a time is within a time range
    const isTimeInRange = (time: string, range: string): boolean => {
        const [start, end] = range.split("-").map(formatTimeToMinutes);
        const timeMinutes = formatTimeToMinutes(time);
        return timeMinutes >= start && timeMinutes < end;
    };

    // Convert time (e.g., "13:30") to minutes since midnight
    const formatTimeToMinutes = (timeStr: string): number => {
        const [hour, minutes] = timeStr.split(":").map(Number);
        return hour * 60 + minutes;
    };
    //end of download schedule

    return (
        <div className="w-full h-full p-2 overflow-auto faculty-calendar-container">
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-12 h-12 border-b-2 border-blue-700 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
                        <Tabs
                            value={view}
                            onValueChange={(v) =>
                                handleViewChange(
                                    v as "calendar" | "list" | "table"
                                )
                            }
                        >
                            <TabsList>
                                <TabsTrigger value="calendar">
                                    Calendar View
                                </TabsTrigger>
                                <TabsTrigger value="list">
                                    List View
                                </TabsTrigger>
                                <TabsTrigger value="table">
                                    Table View
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                            <div className="lg:ml-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                id="download-word"
                                                // disabled={
                                                //     userRole === "user" &&
                                                //     userName !== teacherName
                                                // }
                                                onClick={() => {
                                                    downloadWord();
                                                }}
                                            >
                                                <FaFileWord />
                                                Download Word
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>
                                                {events.some(
                                                    (event) =>
                                                        event.extendedProps
                                                            .conflict
                                                ) ? (
                                                    userRole === "user" ? (
                                                        <>
                                                            Conflicting
                                                            schedules have been
                                                            detected.
                                                            <br />
                                                            Kindly consult your
                                                            department chair for
                                                            review.
                                                        </>
                                                    ) : (
                                                        <>
                                                            Conflicting
                                                            schedules detected.
                                                            Kindly resolve them
                                                            first on the{" "}
                                                            <Link
                                                                href={route(
                                                                    "course_scheduling.index"
                                                                )}
                                                                className="text-blue-500 underline"
                                                            >
                                                                Course
                                                                Scheduling Page
                                                            </Link>
                                                            .
                                                        </>
                                                    )
                                                ) : (
                                                    "Notice of Teaching Assignment"
                                                )}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <div className="lg:ml-2 lg:mb-0 mb-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="default"
                                                // disabled={
                                                //     userRole === "user" &&
                                                //     userName !== teacherName
                                                // }
                                                onClick={() => {
                                                    downloadScheduleAsExcel();
                                                }}
                                            >
                                                <FaFileExcel />
                                                Download Excel
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>
                                                {events.some(
                                                    (event) =>
                                                        event.extendedProps
                                                            .conflict
                                                ) ? (
                                                    userRole === "user" ? (
                                                        <>
                                                            Conflicting
                                                            schedules have been
                                                            detected.
                                                            <br />
                                                            Kindly consult your
                                                            department chair for
                                                            review.
                                                        </>
                                                    ) : (
                                                        <>
                                                            Conflicting
                                                            schedules detected.
                                                            Kindly resolve them
                                                            on the{" "}
                                                            <Link
                                                                href={route(
                                                                    "course_scheduling.index"
                                                                )}
                                                                className="text-blue-500 underline"
                                                            >
                                                                Course
                                                                Scheduling Page
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
                        </div>

                        <Dialog>
                            <DialogTrigger className="ml-auto">
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

                    {view === "table" ? (
                        renderTableView()
                    ) : (
                        <div className="overflow-auto">
                            <div
                                id="faculty_calendar_view"
                                className="w-[1000px] lg:w-full mx-auto"
                            >
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[
                                        timeGridPlugin,
                                        interactionPlugin,
                                        listPlugin,
                                    ]}
                                    initialView={
                                        view === "list"
                                            ? "listWeek"
                                            : "timeGridWeek"
                                    }
                                    headerToolbar={false}
                                    eventResizableFromStart={true}
                                    allDaySlot={false}
                                    stickyHeaderDates={true}
                                    expandRows={true}
                                    height="100%"
                                    slotLabelFormat={{
                                        hour: "numeric",
                                        minute: "2-digit",
                                        omitZeroMinute: false,
                                        meridiem: "short",
                                    }}
                                    events={events}
                                    eventContent={(eventInfo) => (
                                        <div className="relative flex flex-col overflow-hidden text-small">
                                            {eventInfo.event.extendedProps
                                                .conflict ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger
                                                            asChild
                                                            onMouseEnter={() =>
                                                                handleHoverConflict(
                                                                    eventInfo
                                                                )
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
                                                                    hoverConflicts.length >
                                                                    2
                                                                        ? "overflow-auto max-h-40"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <h4 className="font-bold ">
                                                                    Conflicting
                                                                    Schedules (
                                                                    {
                                                                        hoverConflicts.length
                                                                    }
                                                                    )
                                                                </h4>
                                                                <ul className="space-y-1">
                                                                    {hoverConflicts.map(
                                                                        (
                                                                            conflict,
                                                                            index
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    index
                                                                                }
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
                                            <div className="font-sans">
                                                {
                                                    eventInfo.event.title.split(
                                                        " - "
                                                    )[0]
                                                }
                                            </div>
                                            <div className="mb-1 font-sans">
                                                {
                                                    eventInfo.event
                                                        .extendedProps.section
                                                }{" "}
                                                {eventInfo.event.extendedProps
                                                    .label &&
                                                    `(${eventInfo.event.extendedProps.label})`}
                                            </div>
                                            <div className="font-sans font-bold">
                                                {
                                                    eventInfo.event
                                                        .extendedProps.room
                                                }
                                            </div>
                                        </div>
                                    )}
                                    eventOverlap={false}
                                    scrollTime="06:00:00"
                                    contentHeight="auto"
                                    slotEventOverlap={false}
                                    dayHeaderFormat={{ weekday: dayFormat }}
                                    slotMaxTime={timeRange.split("-")[1]}
                                    slotMinTime={timeRange.split("-")[0]}
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
                                    hiddenDays={isWeekdaysOnly ? [0, 6] : []}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
