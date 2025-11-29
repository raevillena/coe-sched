import React, { useState, useEffect, useCallback } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { FacultyWorkloadProps } from "@/types/my_types";
import TableFunction from "@/Pages/FacultyLoading/FacultyWorkloadComponents/TableFunction";
import { Card } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import TableSettings from "@/Pages/FacultyLoading/FacultyWorkloadComponents/TableSettings";
import { toast_error, toast_success } from "@/types/my_types/mytoast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx-js-style";
import useTour from "@/Composables/useTour";
import mmsu_logo from "/Images/mmsu.png";

export default function FacultyWorkLoad({
    auth,
    breadcrumbs,
    period_name,
    departments,
}: FacultyWorkloadProps) {
    const userTheme = auth?.user.theme;
    const userDepartmentId = auth?.user?.department_id;
    const userRole = auth?.user?.role;
    const userName = auth?.user?.name;

    useTour({
        user: auth.user,
        name: "showFacultyWorkloadTour",
        steps: () => [
            {
                title: "Welcome to Faculty Workload",
                intro: `This page helps you <b>efficiently manage faculty workloads</b>.<br><br>
                            From <i>selecting departments</i> to <i>assigning</i> and <i>reviewing workloads</i>, we've got you covered!<br><br>  
                            Let's take a quick tour of the <b>key features</b>.<br><br>  
                            <b>RN DevWorks</b> 💻`,
                tooltipClass: "four-fifty-tool-tip",
            },
            {
                intro: `📘 <b>Select Department</b><br>  
                            Start by <i>selecting the department</i> you want to manage. This will ensure that all data displayed corresponds to your <b>chosen department</b>.`,
                element: document.querySelector("#select-dept") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🔽 <b>Select Academic Year</b><br>  
                            View your schedule by choosing the <i>appropriate academic year</i> to see relevant workloads.`,
                element: document.querySelector("#select-sy") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📅 <b>Select Semester</b><br>  
                            Narrow down your workload by selecting the <i>semester</i>. This helps provide a more <b>focused view</b> of the workload distribution.`,
                element: document.querySelector(
                    "#select-period"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `👨‍🏫 <b>Select Instructor</b><br>  
                            Choose an <i>instructor</i> to view and manage their <b>workload</b> for the selected academic year and semester.`,
                element: document.querySelector(
                    "#select-instructor"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `⚙️ <b>Edit Workload Table Settings</b><br>
                            Click here to <i>customize</i> the workload table settings according to <b>your preferences</b>.`,
                element: document.querySelector(
                    "#edit-workload-settings"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📊 <b>Instructor Workload Table</b><br>
                            This table provides a <b>detailed view</b> of the selected instructor's workload. <br><br>You can <i>view</i>, <i>add</i>, or <i>edit</i> the number of students for the schedules assigned to the instructor.`,
                element: document.querySelector(
                    "#workload-table"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📥 <b>Download Workload</b><br>
                           Export the workload in <b>Excel format</b> to easily <i>view</i>, <i>organize</i>, or <i>manage</i> the data.`,
                element: document.querySelector(
                    "#download-workload"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 Continue Exploring!",
                intro: `You're all set to get started with <b>faculty workload</b>. Dive in and <i>explore</i> the tools available.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "four-fifty-tool-tip",
            },
        ],
    });

    const [year, setYear] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [course, setCourse] = useState<string>("");
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [selectedInstructor, setSelectedInstructor] = useState<string>("");
    const [instructorLoading, setInstructorLoading] = useState<boolean>(false);

    //get the name of the department from the other table using the program_code
    const getCourseName = (code: string) => {
        const dept = departments.data.find((dep) => dep.program_code === code);
        return dept ? dept.name : code;
    };

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

    const [dayFormat, setDayFormat] = useState<"long" | "short" | "narrow">(
        "narrow"
    );

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

        const format = dayFormats[dayFormat] || dayFormats.short;
        return days.map((day) => format[day]).join(", ");
    };

    // const formatTime = (timeStr: string) => {
    //     const [hours, minutes] = timeStr.split(":").slice(0, 2).map(Number);
    //     const period = hours >= 12 ? "PM" : "AM";
    //     const displayHours = hours % 12 || 12;
    //     const displayMinutes = minutes.toString().padStart(2, "0");

    //     return `${displayHours}:${displayMinutes} ${period}`;
    // };

    // Fetch schedules when year, semester, or course changes
    const fetchSchedules = async () => {
        if (!year || !semester || !course) {
            setSchedules([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `/faculty_workload/get_schedules?year=${year}&semester=${semester}&course=${course}`
            );
            const data = await response.json();

            const normalizedSchedules = data.map(
                (schedule: { daysOfWeek: string }) => ({
                    ...schedule,
                    daysOfWeek: Array.isArray(schedule.daysOfWeek)
                        ? schedule.daysOfWeek
                        : typeof schedule.daysOfWeek === "number"
                        ? [schedule.daysOfWeek]
                        : typeof schedule.daysOfWeek === "string"
                        ? JSON.parse(schedule.daysOfWeek)
                        : [],
                })
            );

            setSchedules(normalizedSchedules);

            const counts = Object.fromEntries(
                normalizedSchedules.map(
                    (schedule: { id: any; student_count: any }) => [
                        schedule.id,
                        schedule.student_count || 0,
                    ]
                )
            );

            setStudentCounts(counts);
            setOriginalStudentCounts(counts);
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [year, semester, course]);

    // Fetch instructors when course changes
    useEffect(() => {
        const fetchInstructors = async () => {
            if (!course) {
                setInstructors([]);
                return;
            }

            setInstructorLoading(true);
            try {
                const departmentsResponse = await axios.get(
                    route("faculty_workload.get_departments")
                );
                const department = departmentsResponse.data.find(
                    (dep: { program_code: string }) =>
                        dep.program_code.trim().toLowerCase() ===
                        course.trim().toLowerCase()
                );

                if (department) {
                    const response = await axios.get(
                        route("faculty_workload.get_instructors", {
                            departmentId: department.id,
                        })
                    );

                    const allInstructors = response.data;

                    // console.log("Instructors:", allInstructors);

                    const filteredInstructors =
                        userRole === "user"
                            ? allInstructors.filter(
                                  (instructor: { name: string }) =>
                                      instructor.name === userName
                              )
                            : allInstructors;

                    setInstructors(filteredInstructors);

                    if (userRole === "user" && userName) {
                        setSelectedInstructor(userName);
                    }
                } else {
                    setInstructors([]);
                }
            } catch (error) {
                console.error("Failed to fetch instructors:", error);
                setInstructors([]);
            } finally {
                setInstructorLoading(false);
            }
        };

        fetchInstructors();
    }, [course, auth?.user?.role, auth?.user?.name]);

    useEffect(() => {
        setSelectedInstructor("");
    }, [course, userDepartmentId]);

    // for saving number of students
    const [studentCounts, setStudentCounts] = useState<{
        [key: string]: number;
    }>({});
    const [originalStudentCounts, setOriginalStudentCounts] = useState<{
        [key: string]: number;
    }>({});

    const isSaveDisabled =
        JSON.stringify(studentCounts) === JSON.stringify(originalStudentCounts);

    const handleStudentCountChange = (scheduleId: string, count: number) => {
        setStudentCounts((prevCounts) => ({
            ...prevCounts,
            [scheduleId]: count,
        }));
    };

    const saveChanges = () => {
        axios
            .post(
                route("faculty_workload.update_student_counts"),
                { studentCounts },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                toast_success({
                    message: "No. of Students saved successfully!",
                    userTheme: userTheme,
                });
                setOriginalStudentCounts({ ...studentCounts });
                fetchSchedules();
            })
            .catch((error) => {
                toast_error({
                    message: "Failed to save changes. Please try again.",
                    userTheme: userTheme,
                });
            });
    };

    //helper
    const emptyRow = (cols: number) => Array(cols).fill("");
    const COLS = 14;

    // download faculty workload as excel
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
            "",
            "",
            "",
            "",
            "Document Code",
            "",
            "URO-FRM-012B",
            "",
            "",
        ]);
        worksheetData.push([
            "",
            "Office of the University Registrar",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "Revision No.",
            "",
            "0",
            "",
            "",
        ]);
        worksheetData.push([
            "",
            "SUMMARY OF FACULTY WORKLOAD",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "Effectivity Date",
            "",
            "September 2019",
            "",
            "",
        ]);
        worksheetData.push(emptyRow(COLS));

        worksheetData.push([
            "College:",
            "College of Engineering",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ]);
        const collegeRowIdx = worksheetData.length - 1;

        worksheetData.push([
            "Semester:",
            `${semester} ${year}-${Number(year) + 1}` || "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ]);
        const semesterRowIdx = worksheetData.length - 1;

        worksheetData.push(emptyRow(COLS));

        // Table headers (multi-row)
        worksheetData.push([
            "Name of Faculty",
            "Course Code",
            "Course Title",
            "Course/Yr/Sec",
            "No. of studs.",
            "Time",
            "Day",
            "College/ Room",
            "# of Units",
            "Actual Load",
            "Regular Load",
            "Over load",
            "OA load equiv.",
            "OTHER ASSIGNMENT(S) (OA)",
        ]);
        const tableHeaderRowIdx = worksheetData.length - 1;

        worksheetData.push(emptyRow(COLS));

        worksheetData.push([
            "DEPARTMENT OF " + getCourseName(course).toUpperCase(),
            ...Array(COLS - 1).fill(""),
        ]);

        const departmentRowIdx = worksheetData.length - 1;
        worksheetData.push(emptyRow(COLS));

        if (schedules.length > 0) {
            const schedulesByTeacher = schedules.reduce((acc, schedule) => {
                const teacher = schedule.teacher || "Unknown Instructor";

                const isInstructorIncluded = instructors.some(
                    (instructor: { name: string }) =>
                        instructor.name === teacher
                );

                if (!isInstructorIncluded) {
                    return acc;
                }

                if (!acc[teacher]) {
                    acc[teacher] = [];
                }
                acc[teacher].push(schedule);
                return acc;
            }, {} as Record<string, typeof schedules>);

            // Transform and sort teacher names
            const teacherEntries = Object.keys(schedulesByTeacher)
                .map((teacher) => ({
                    original: teacher,
                    formatted: formatTeacherName(teacher),
                }))
                .sort((a, b) => a.formatted.localeCompare(b.formatted));

            teacherEntries.forEach(({ original, formatted }) => {
                const teacherSchedules = schedulesByTeacher[original];

                // Compute totalUnits and totalLoad for this teacher
                const totalUnits = teacherSchedules.reduce(
                    (sum: any, schedule: { units: any }) =>
                        sum + (schedule.units || 0),
                    0
                );
                const totalLoad = teacherSchedules.reduce(
                    (
                        sum: any,
                        schedule: { label: string; lec: number; lab: any }
                    ) => {
                        const isLabOrSplit =
                            schedule.label?.toLowerCase().startsWith("lab") ||
                            schedule.label
                                ?.toLowerCase()
                                .startsWith("split 1") ||
                            schedule.label?.toLowerCase().startsWith("split");
                        const actualLoad =
                            isLabOrSplit || schedule.lec === 0
                                ? (schedule.lab || 0) * 3
                                : schedule.lec || 0;
                        return sum + actualLoad;
                    },
                    0
                );

                // Compute regular loading per instructor
                const instructorObj = instructors.find(
                    (i) => i.name === original
                );
                const deloading = instructorObj?.deloading ?? 0;
                const regularLoad = deloading !== 0 ? 18 - deloading : 18;
                const overloadRaw = totalLoad - regularLoad;
                const overload = overloadRaw < 0 ? "underload" : overloadRaw;
                const designation = instructorObj?.designation ?? ""; //other assignments

                // Faculty name row
                worksheetData.push([formatted, ...Array(COLS - 1).fill("")]);

                // Each schedule row
                teacherSchedules.forEach(
                    (
                        schedule: {
                            label: string;
                            lec: number;
                            lab: any;
                            title: unknown;
                            SubjectName: unknown;
                            section: any;
                            student_count: any;
                            timeRanges: unknown;
                            daysOfWeek:
                                | string
                                | number
                                | number[]
                                | null
                                | undefined;
                            room: unknown;
                            units: unknown;
                        },
                        schedIdx: number
                    ) => {
                        const isLabOrSplit =
                            schedule.label?.toLowerCase().startsWith("lab") ||
                            schedule.label
                                ?.toLowerCase()
                                .startsWith("split 1") ||
                            schedule.label?.toLowerCase().startsWith("split");
                        const actualLoad =
                            isLabOrSplit || schedule.lec === 0
                                ? (schedule.lab || 0) * 3
                                : schedule.lec || 0;
                        worksheetData.push([
                            "",
                            schedule.title,
                            schedule.SubjectName,
                            `${schedule.section} ${
                                schedule.label ? `(${schedule.label})` : ""
                            }`,
                            schedule.student_count || 0,
                            schedule.timeRanges,
                            formatDaysOfWeek(schedule.daysOfWeek),
                            schedule.room,
                            schedule.units,
                            actualLoad,
                            schedIdx === 0 ? regularLoad : "",
                            "",
                            "",
                            schedIdx === 0 ? designation : "",
                        ]);
                    }
                );

                // Totals row
                worksheetData.push([
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "Total Units",
                    totalUnits,
                    totalLoad,
                    regularLoad,
                    overload,
                    "",
                    "",
                ]);
            });
        }

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        worksheet["!rows"] = worksheet["!rows"] || [];
        worksheet["!rows"][tableHeaderRowIdx] = { hpt: 30 };

        worksheet["!cols"] = [
            { wch: 11 }, //Name of Factulty
            { wch: 10 }, // Course Code
            { wch: 30 }, // Course Title
            { wch: 10 }, // Course/Yr/Sec
            { wch: 10 }, // No. of students
            { wch: 15 }, // Time
            { wch: 10 }, // Day
            { wch: 16 }, // College/Room
            { wch: 7 }, // Units
            { wch: 7 }, // Actual Load
            { wch: 7 }, // Regular Load
            { wch: 7 }, // Over Load
            { wch: 6 }, // OA load equiv.
            { wch: 25 }, // OTHER ASSIGNMENT(S) (OA)
        ];

        // --- MERGES ---
        worksheet["!merges"] = [
            //D1:I1
            { s: { r: 0, c: 3 }, e: { r: 0, c: 8 } },
            //D2:I2
            { s: { r: 1, c: 3 }, e: { r: 1, c: 8 } },
            //D3:I3
            { s: { r: 2, c: 3 }, e: { r: 2, c: 8 } },

            // LOGO: A1:A3
            { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } },
            // University: B1:C1
            { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } },
            // Merge J1:K1
            { s: { r: 0, c: 9 }, e: { r: 0, c: 10 } },
            // Office: B2:C2
            { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
            // Merge J2:K2
            { s: { r: 1, c: 9 }, e: { r: 1, c: 10 } },
            // Summary: B3:C3
            { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
            // Merge J3:K3
            { s: { r: 2, c: 9 }, e: { r: 2, c: 10 } },
            // Document Code: L1:N1 (if you have these fields)
            { s: { r: 0, c: 11 }, e: { r: 0, c: 13 } },
            // Revision No.: L2:M2
            { s: { r: 1, c: 11 }, e: { r: 1, c: 12 } },
            // Effectivity Date: L3:N3
            { s: { r: 2, c: 11 }, e: { r: 2, c: 13 } },
            // College of Engineering (B5:C5) and Semester (B6:C6)
            { s: { r: collegeRowIdx, c: 1 }, e: { r: collegeRowIdx, c: 2 } },
            { s: { r: semesterRowIdx, c: 1 }, e: { r: semesterRowIdx, c: 2 } },
            // Department e.g Departmen of Computer Engineering
            // { s: { r: 9, c: 0 }, e: { r: 9, c: 13 } }, OLD
            {
                s: { r: departmentRowIdx, c: 0 },
                e: { r: departmentRowIdx, c: 13 },
            },
            // --- Wrap and center table headers (merge each header col cell with itself to allow wrap/center)
            ...Array(COLS)
                .fill(0)
                .map((_, i) => ({
                    s: { r: tableHeaderRowIdx, c: i },
                    e: { r: tableHeaderRowIdx, c: i },
                })),
        ];

        // --- FACULTY NAME ROWS: Merge and style ---
        worksheetData.forEach((row, idx) => {
            if (
                typeof row[0] === "string" &&
                row[0].toUpperCase().includes("DEPARTMENT OF ")
            )
                return;
            if (
                row.length >= 2 &&
                typeof row[0] === "string" &&
                row[0].trim() !== "" &&
                row.slice(1).every((cell) => cell === "")
            ) {
                // Merge columns A and B for faculty name
                if (!worksheet["!merges"]) worksheet["!merges"] = [];
                worksheet["!merges"].push({
                    s: { r: idx, c: 0 },
                    e: { r: idx, c: 1 },
                });
                // Style merged cells (A and B: bold, border)
                for (let col = 0; col <= 1; col++) {
                    const cell = XLSX.utils.encode_cell({ r: idx, c: col });
                    if (!worksheet[cell])
                        worksheet[cell] = {
                            t: "s",
                            v: col === 0 ? row[0] : "",
                        };
                    worksheet[cell].s = {
                        ...worksheet[cell].s,
                        font: { ...worksheet[cell].s?.font, bold: true, sz: 8 },
                        alignment: { horizontal: "left", vertical: "center" },
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } },
                        },
                    };
                }
                // Ensure all other columns in the row have borders and font size 8
                for (let col = 2; col < COLS; col++) {
                    const cell = XLSX.utils.encode_cell({ r: idx, c: col });
                    if (!worksheet[cell]) worksheet[cell] = { t: "s", v: "" };
                    worksheet[cell].s = {
                        ...worksheet[cell].s,
                        font: { ...worksheet[cell].s?.font, sz: 8 },
                        alignment: { horizontal: "left", vertical: "center" },
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } },
                        },
                    };
                }
            }
        });

        // HEADER STYLE + FONT SIZE 8
        worksheet["A5"].s = {
            font: { bold: true, sz: 8 },
            alignment: { horizontal: "left", vertical: "center" },
        };
        worksheet["A6"].s = {
            font: { bold: true, sz: 8 },
            alignment: { horizontal: "left", vertical: "center" },
        };
        worksheet["B1"].s = {
            font: { sz: 8 },
            alignment: { horizontal: "left", vertical: "center" },
        };
        worksheet["B2"].s = {
            font: { sz: 8 },
            alignment: { horizontal: "left", vertical: "center" },
        };
        worksheet["B3"].s = {
            font: { sz: 8 },
            alignment: { horizontal: "left", vertical: "center" },
        };
        ["K1", "K2", "K3"].forEach(
            (cell) =>
                (worksheet[cell].s = {
                    font: { bold: true, sz: 8 },
                    alignment: { horizontal: "left", vertical: "center" },
                })
        );
        ["L1", "L2", "L3"].forEach(
            (cell) =>
                (worksheet[cell].s = {
                    font: { sz: 8 },
                    alignment: { horizontal: "left", vertical: "center" },
                })
        );

        // --- BORDERS FOR ALL HEADER ROWS ---
        for (let row = 0; row <= 6; row++) {
            // Covers header & college/semester rows
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
        for (let i = 0; i < 14; i++) {
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
                fill: { patternType: "solid", fgColor: { rgb: "A8D08D" } },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        }

        const OA_COL_IDX = 13; // Index for "OTHER ASSIGNMENT(S) (OA)"

        for (
            let rowIdx = tableHeaderRowIdx + 1;
            rowIdx < worksheetData.length;
            rowIdx++
        ) {
            const cellAddr = XLSX.utils.encode_cell({
                r: rowIdx,
                c: OA_COL_IDX,
            });
            if (!worksheet[cellAddr]) worksheet[cellAddr] = { t: "s", v: "" };
            worksheet[cellAddr].s = {
                ...worksheet[cellAddr].s,
                alignment: {
                    vertical: "top",
                    horizontal: "left",
                    wrapText: true,
                },
                font: { ...worksheet[cellAddr].s?.font, sz: 8 },
                border: worksheet[cellAddr].s?.border || {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        }

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

        //"Total Units" row
        worksheetData.forEach((row, rowIdx) => {
            const totalIdx = row.findIndex(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes("total units")
            );
            const isTotalRow = totalIdx !== -1;

            const valueCols = [
                totalIdx + 1,
                totalIdx + 2,
                totalIdx + 3,
                totalIdx + 4,
                totalIdx + 5,
            ];

            if (isTotalRow) {
                // right-align, yellow, bold for the label
                const labelCell = XLSX.utils.encode_cell({
                    r: rowIdx,
                    c: totalIdx,
                });
                worksheet[labelCell].v = String(worksheet[labelCell].v);
                worksheet[labelCell].s = {
                    ...worksheet[labelCell].s,
                    font: {
                        ...worksheet[labelCell].s?.font,
                        bold: true,
                        sz: 8,
                    },
                    alignment: { horizontal: "right", vertical: "center" },
                    fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                };
                valueCols.forEach((col) => {
                    const cellAddr = XLSX.utils.encode_cell({
                        r: rowIdx,
                        c: col,
                    });
                    if (worksheet[cellAddr]) {
                        worksheet[cellAddr].s = {
                            ...worksheet[cellAddr].s,
                            font: {
                                ...worksheet[cellAddr].s?.font,
                                underline: true,
                                bold: true,
                                sz: 8,
                            },
                            alignment: {
                                horizontal: "right",
                                vertical: "center",
                            },
                            fill: {
                                patternType: "solid",
                                fgColor: { rgb: "FFFF00" },
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
                });
            }
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty Tabular");
        XLSX.writeFile(
            workbook,
            `${course}_${semester}_${year}-${Number(year) + 1}_Workload.xlsx`
        );
    };

    const formatTeacherName = (name: string): string => {
        // Remove "Engr." and all occurrences of "Dr." at the start or anywhere in the name
        name = name.replace(/\b(Engr\.|Dr\.)\s*/gi, "").replace(/\bDr\./gi, "");

        // Remove repeated spaces
        name = name.replace(/\s+/g, " ").trim();

        // Split name into parts
        const parts = name.split(" ");
        const lastName = parts.pop()?.toUpperCase() || "";
        const firstNameAndMiddle = parts.join(" ").toUpperCase();

        return `${lastName}, ${firstNameAndMiddle}`;
    };
    //end of download faculty workload

    const formatTeacherNameSelect = (name: string): string => {
        const parts = name.trim().split(" ");

        if (parts.length < 2) return name;

        const title = parts[0];
        const lastName = parts[parts.length - 1];
        const firstMiddle = parts.slice(1, -1).join(" ");

        return `${title} ${lastName}, ${firstMiddle}`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="flex items-center justify-center p-4 mb-3 text-2xl font-semibold leading-tight rounded-lg bg-muted/50">
                    Faculty Workload
                </h2>
            }
        >
            <Head title="Faculty Workload" />
            <div>
                <Card className="p-3 mt-1 mb-2" id="timetable-function">
                    <TableFunction
                        userRole={auth?.user?.role}
                        userDepartmentId={userDepartmentId}
                        course={course}
                        setCourse={setCourse}
                        year={year}
                        setYear={setYear}
                        semester={semester}
                        setSemester={setSemester}
                        period_name={period_name}
                        departments={departments}
                    />
                </Card>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 gap-4 lg:gap-0">
                <div id="select-instructor" className="w-full lg:w-auto">
                    <Label
                        htmlFor="instructor-select"
                        className="text-sm font-medium"
                    >
                        Select Instructor:
                    </Label>
                    <Select
                        onValueChange={(value) => setSelectedInstructor(value)}
                        disabled={
                            instructorLoading ||
                            instructors.length === 0 ||
                            !course ||
                            !year ||
                            !semester
                        }
                        value={selectedInstructor}
                    >
                        <SelectTrigger
                            className="w-full lg:w-[200px]"
                            id="instructor-select"
                        >
                            <SelectValue
                                placeholder={
                                    instructorLoading
                                        ? "Loading instructors..."
                                        : instructors.length === 0
                                        ? "No instructors available"
                                        : "Select an instructor"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Instructors</SelectLabel>
                                {instructors
                                    .sort((a, b) => {
                                        const formattedA =
                                            formatTeacherNameSelect(a.name);
                                        const formattedB =
                                            formatTeacherNameSelect(b.name);
                                        return formattedA.localeCompare(
                                            formattedB
                                        );
                                    })
                                    .map((instructor) => (
                                        <SelectItem
                                            key={instructor.id}
                                            value={instructor.name}
                                        >
                                            {formatTeacherNameSelect(
                                                instructor.name
                                            )}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div id="download-workload" className="w-full lg:w-auto">
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
                            <TooltipContent side="left">
                                <p>
                                    {!schedules.length ? (
                                        <>No data available</>
                                    ) : schedules.some(
                                          (schedule) => schedule.conflict
                                      ) ? (
                                        userRole === "user" ? (
                                            <>
                                                This contains conflicting
                                                schedules but can still be
                                                downloaded for personal use.
                                            </>
                                        ) : (
                                            <>
                                                Conflicting schedules detected.
                                                Kindly resolve them on the{" "}
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
                                        "Faculty Workload"
                                    )}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className="flex justify-end px-6">
                <TableSettings
                    userTheme={userTheme}
                    dayFormat={dayFormat}
                    setDayFormat={setDayFormat}
                    resetSettings={() => setDayFormat("narrow")}
                    disabled={!selectedInstructor}
                />
            </div>

            <div className="px-4" id="workload-table">
                <Card className="mb-2" id="schedule-table">
                    <Table>
                        <TableCaption>
                            List of schedules of {selectedInstructor}.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Course Code
                                </TableHead>
                                <TableHead>Course Title</TableHead>
                                <TableHead>Course/Yr/Sec</TableHead>
                                <TableHead>No. of Students</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Lec</TableHead>
                                <TableHead>Lab</TableHead>
                                <TableHead>Units</TableHead>
                                <TableHead>Actual Load</TableHead>
                                <TableHead>Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={12}
                                        className="text-center"
                                    >
                                        Loading schedules...
                                    </TableCell>
                                </TableRow>
                            ) : !selectedInstructor ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={12}
                                        className="text-center text-red-500"
                                    >
                                        Please select an instructor first.
                                    </TableCell>
                                </TableRow>
                            ) : schedules.filter(
                                  (schedule) =>
                                      schedule.teacher === selectedInstructor
                              ).length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={12}
                                        className="text-center text-red-500"
                                    >
                                        No schedules available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                schedules
                                    .filter(
                                        (schedule) =>
                                            schedule.teacher ===
                                            selectedInstructor
                                    )
                                    .map((schedule) => {
                                        //1lec = 1hour | 1lab = 3hours
                                        //if ada label na nga lab or split then iconsider na nga lab tay subject
                                        //ngem nu awan label na ngem 0 met lec na then iconsider na latta a lab
                                        const isLabOrSplit =
                                            schedule.label
                                                ?.toLowerCase()
                                                .startsWith("lab") ||
                                            schedule.label
                                                ?.toLowerCase()
                                                .startsWith("split 1") ||
                                            schedule.label
                                                ?.toLowerCase()
                                                .startsWith("split");

                                        const actualLoad =
                                            isLabOrSplit || schedule.lec === 0
                                                ? (schedule.lab || 0) * 3
                                                : schedule.lec || 0;

                                        return (
                                            <TableRow key={schedule.id}>
                                                <TableCell className="font-medium">
                                                    {schedule.title}
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.SubjectName}
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.section}{" "}
                                                    {schedule.label &&
                                                        `(${schedule.label})`}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        id={`student-count-${schedule.id}`}
                                                        className="w-[100px]"
                                                        type="text"
                                                        value={
                                                            studentCounts[
                                                                schedule.id
                                                            ] ??
                                                            schedule.student_count ??
                                                            0
                                                        }
                                                        onChange={(e) =>
                                                            handleStudentCountChange(
                                                                schedule.id,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                ) || 0
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.timeRanges}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDaysOfWeek(
                                                        schedule.daysOfWeek
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.room}
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.lec}
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.lab}
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.units}
                                                </TableCell>
                                                <TableCell>
                                                    {actualLoad}
                                                </TableCell>
                                                <TableCell>
                                                    {new Intl.DateTimeFormat(
                                                        "en-US",
                                                        {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            hour12: true,
                                                        }
                                                    ).format(
                                                        new Date(
                                                            schedule.updated_at
                                                        )
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                            )}
                        </TableBody>
                    </Table>
                </Card>
                <div className="flex justify-end">
                    <Button onClick={saveChanges} disabled={isSaveDisabled}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
