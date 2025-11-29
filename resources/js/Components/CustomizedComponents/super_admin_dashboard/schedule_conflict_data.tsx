import React, { useEffect, useState } from "react";
import { AlertTriangle, WrenchIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Department } from "@/types/my_types";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
);

interface ScheduleConflictDataProps {
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
    departments: {
        data: Department[];
    };
}
export default function ScheduleConflictData({
    userDepartmentId,
    userRole,
    departments,
}: ScheduleConflictDataProps) {
    interface Conflict {
        id: number;
        title: string;
        startTime: string;
        endTime: string;
        room: string;
        teacher: string | undefined;
        label: string;
        section: string;
        course: string;
        year: string;
        academic_year: string;
    }

    interface Period {
        id: number;
        period_name: string;
    }
    interface YearLevel {
        id: number;
        level_name: string;
    }

    const [totalConflicts, setTotalConflicts] = useState(0);
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);

    // Initialize states with saved values from localStorage or defaults
    const [filterType, setFilterType] = useState<"section" | "room">(() => {
        const saved = localStorage.getItem("scheduleConflictSelection");
        if (saved) {
            try {
                const { viewType } = JSON.parse(saved);
                if (viewType === "section" || viewType === "room")
                    return viewType;
            } catch (e) {
                console.error(
                    "Error parsing saved schedule conflict selections:",
                    e
                );
            }
        }
        return "section";
    });

    const [selectedPeriod, setSelectedPeriod] = useState(() => {
        const saved = localStorage.getItem("scheduleConflictSelection");
        if (saved) {
            try {
                const { period } = JSON.parse(saved);
                if (period) return period;
            } catch (e) {
                console.error(
                    "Error parsing saved schedule conflict selections:",
                    e
                );
            }
        }
        return "1st Semester";
    });

    // Save selections to localStorage whenever they change
    useEffect(() => {
        const selections = {
            viewType: filterType,
            period: selectedPeriod,
        };
        localStorage.setItem(
            "scheduleConflictSelection",
            JSON.stringify(selections)
        );
    }, [filterType, selectedPeriod]);

    interface ChartData {
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
            borderWidth: number;
        }[];
    }

    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    "hsl(12, 76%, 61%)", // Red/Maroon
                    "hsl(173, 58%, 39%)", // Cyan/Teal
                    "hsl(197, 37%, 24%)", // Navy Blue
                    "hsl(43, 74%, 66%)", // Gold
                    "hsl(27, 87%, 67%)", // Orange
                ],
                borderWidth: 1,
            },
        ],
    });

    // Get the current theme
    const isDarkMode = document.documentElement.classList.contains("dark");

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed.y || 0;
                        return `${value} conflict${value !== 1 ? "s" : ""}`;
                    },
                },
                backgroundColor: isDarkMode
                    ? "hsl(222.2 84% 4.9%)"
                    : "hsl(0 0% 100%)",
                titleColor: isDarkMode
                    ? "hsl(210 40% 98%)"
                    : "hsl(222.2 84% 4.9%)",
                bodyColor: isDarkMode
                    ? "hsl(210 40% 98%)"
                    : "hsl(222.2 84% 4.9%)",
                borderColor: isDarkMode
                    ? "hsl(217.2 32.6% 17.5%)"
                    : "hsl(214.3 31.8% 91.4%)",
                borderWidth: 1,
                padding: 8,
                boxPadding: 4,
            },
        },
        scales: {
            y: {
                type: "linear" as const,
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    color: isDarkMode
                        ? "hsl(210 40% 98%)"
                        : "hsl(222.2 84% 4.9%)",
                    font: {
                        size: 12,
                        weight: 500 as const,
                    },
                },
                title: {
                    display: true,
                    text: "Number of Conflicts",
                    color: isDarkMode
                        ? "hsl(210 40% 98%)"
                        : "hsl(222.2 84% 4.9%)",
                    font: {
                        size: 13,
                        weight: "bold" as const,
                    },
                },
                grid: {
                    color: isDarkMode
                        ? "hsl(217.2 32.6% 17.5%)"
                        : "hsl(214.3 31.8% 91.4%)",
                    drawBorder: false,
                },
            },
            x: {
                type: "category" as const,
                grid: {
                    display: false,
                },
                ticks: {
                    color: isDarkMode
                        ? "hsl(210 40% 98%)"
                        : "hsl(222.2 84% 4.9%)",
                    font: {
                        size: 12,
                        weight: 500 as const,
                    },
                    maxRotation: 45,
                    minRotation: 0,
                    autoSkip: false,
                    autoSkipPadding: 10,
                },
                title: {
                    display: true,
                    text: filterType === "room" ? "Rooms" : "Sections",
                    color: isDarkMode
                        ? "hsl(210 40% 98%)"
                        : "hsl(222.2 84% 4.9%)",
                    font: {
                        size: 13,
                        weight: "bold" as const,
                    },
                },
            },
        },
    } as const;

    useEffect(() => {
        fetchConflicts();
        fetchPeriods();
    }, [selectedPeriod]);

    //for filtering conflicts by department
    function getDepartmentCodeById(id: number): string | null {
        const dept = departments.data.find((d) => d.id === id);
        return dept ? dept.program_code : null;
    }

    const fetchConflicts = async () => {
        try {
            const response = await axios.get(route("schedule.conflicts"), {
                params: { period: selectedPeriod },
            });
            let conflicts = response.data;

            // If admin, filter to only conflicts where the department matches
            if (userRole === "admin" && userDepartmentId) {
                const departmentCode = getDepartmentCodeById(userDepartmentId);
                // If department code is found, filter conflicts by course === department code
                if (departmentCode) {
                    conflicts = conflicts.filter(
                        (conflict: Conflict) =>
                            conflict.course === departmentCode
                    );
                }
            }
            // console.log("Fetched conflicts:", conflicts);

            setConflicts(conflicts);
            setTotalConflicts(conflicts.length);

            // Process and update chart data
            const countMap = new Map<string, number>();

            // Count conflicts by room or section
            conflicts.forEach((conflict: Conflict) => {
                let key: string;
                if (filterType === "room") {
                    key = conflict.room;
                } else {
                    const [course, section] = conflict.section.split("-");
                    const year = section ? section[0] : "";
                    key = `${course.toUpperCase()} ${year}`.trim();
                }
                countMap.set(key, (countMap.get(key) || 0) + 1);
            });

            // Sort entries by conflict count in descending order
            const sortedEntries = Array.from(countMap.entries()).sort(
                (a, b) => b[1] - a[1]
            );

            setChartData((prev) => ({
                ...prev,
                labels: sortedEntries.map(([label]) => label),
                datasets: [
                    {
                        ...prev.datasets[0],
                        data: sortedEntries.map(([, count]) => count),
                    },
                ],
            }));
        } catch (error) {
            console.error("Error fetching conflicts:", error);
        }
    };

    const fetchPeriods = async () => {
        try {
            const response = await axios.get(route("get.periods"));
            setPeriods(response.data);
        } catch (error) {
            console.error("Error fetching periods:", error);
        }
    };

    const fetchYearLevels = async () => {
        try {
            const response = await axios.get(route("get_year_levels"));
            setYearLevels(response.data);
        } catch (error) {
            console.error("Error fetching year levels:", error);
        }
    };

    useEffect(() => {
        fetchYearLevels();
    }, []);

    // Process conflicts data for the chart
    const updateChartData = (conflicts: Conflict[]) => {
        const countMap = new Map<string, number>();

        // Count conflicts by room or section
        conflicts.forEach((conflict) => {
            let key: string;
            if (filterType === "room") {
                key = conflict.room;
            } else {
                const [course, section] = conflict.section.split("-");
                const year = section ? section[0] : "";
                key = `${course.toUpperCase()} ${year}`.trim();
            }
            countMap.set(key, (countMap.get(key) || 0) + 1);
        });

        // Sort entries by conflict count in descending order
        const sortedEntries = Array.from(countMap.entries()).sort(
            (a, b) => b[1] - a[1]
        );

        setChartData((prev) => ({
            ...prev,
            labels: sortedEntries.map(([label]) => label),
            datasets: [
                {
                    ...prev.datasets[0],
                    data: sortedEntries.map(([, count]) => count),
                },
            ],
        }));
    };

    // Update chart when conflicts change
    useEffect(() => {
        updateChartData(conflicts);
    }, [conflicts, filterType]);

    //Extract year level number from section string
    function extractYearNum(section: string) {
        //Matches "4-" or "3-" or "2-" or "1-" etc. before the dash
        const match = section.match(/\b(\d+)-/);
        return match ? match[1] : "";
    }

    //Find year level from yearLevels array given a year number
    function getYearLevelFromSection(section: string) {
        const yearNum = extractYearNum(section);
        if (!yearNum) return "";

        const found = yearLevels.find(
            (yl) =>
                typeof yl.level_name === "string" &&
                (yl.level_name.startsWith(yearNum) ||
                    yl.level_name.includes(yearNum))
        );
        return found ? found.level_name : "";
    }

    //
    const formatFacultyName = (name: string | undefined): string => {
        if (!name) {
            return "No teacher assigned";
        }

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

    const formatTime = (time: string): string => {
        const [hour, minute] = time.split(":").map(Number);
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute
            .toString()
            .padStart(2, "0")} ${period}`;
    };

    return (
        <Card className="flex flex-col w-full h-auto lg:p-4 bg-background border-border">
            <CardContent className="flex-1">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Column - Conflict Summary */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-lg shadow-sm bg-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center justify-center p-4 bg-red-600 rounded-lg shadow-md dark:bg-red-700">
                                    <AlertTriangle
                                        className="text-white"
                                        size={32}
                                    />
                                </div>
                                <div>
                                    <h2 className="mb-1 text-xl font-semibold text-foreground">
                                        Schedule Conflicts
                                    </h2>
                                    <div className="text-3xl font-bold">
                                        <span className="text-red-600 dark:text-red-500">
                                            {totalConflicts}
                                        </span>
                                        <span className="ml-2 text-xl text-muted-foreground">
                                            Total
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Conflict Distribution Chart */}
                            <div className="pt-6 mt-6 border-t border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        Conflict Distribution
                                    </h3>
                                    <Select
                                        value={filterType}
                                        onValueChange={(
                                            value: "section" | "room"
                                        ) => setFilterType(value)}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="View by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    View Conflicts By
                                                </SelectLabel>
                                                <SelectItem value="section">
                                                    By Section
                                                </SelectItem>
                                                <SelectItem value="room">
                                                    By Room
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full h-[300px]">
                                    <Bar
                                        data={chartData}
                                        options={chartOptions}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Conflict List */}
                    <div className="p-4 rounded-lg shadow-sm bg-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">
                                Conflict Details
                            </h3>
                            <Select
                                name="period"
                                value={selectedPeriod}
                                onValueChange={(value) =>
                                    setSelectedPeriod(value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Semesters</SelectLabel>
                                        {periods.length > 0 ? (
                                            periods.map((period) => (
                                                <SelectItem
                                                    value={period.period_name}
                                                    key={period.id}
                                                >
                                                    {period.period_name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="null" disabled>
                                                No period available
                                            </SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="h-[500px] overflow-y-auto pr-2">
                            {conflicts.length > 0 ? (
                                <div className="space-y-2">
                                    {conflicts.map((conflict) => (
                                        <div
                                            key={conflict.id}
                                            className="p-1 transition-colors border border-red-100 rounded-md lg:p-3 bg-red-50/10 dark:bg-red-950/10 dark:border-red-900 hover:bg-red-100/10 dark:hover:bg-red-900/20"
                                        >
                                            <div className="grid gap-y-1 lg:gap-y-0 lg:grid-cols-[1fr,1fr] gap-x-4 text-xs lg:text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">
                                                        Section:
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {conflict.section}{" "}
                                                        {conflict.label &&
                                                            `(${conflict.label})`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">
                                                        Subject:
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {conflict.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">
                                                        Time:
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {formatTime(
                                                            conflict.startTime
                                                        )}{" "}
                                                        -{" "}
                                                        {formatTime(
                                                            conflict.endTime
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">
                                                        Room:
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {conflict.room}
                                                    </span>
                                                </div>
                                                <div className="flex items-center col-span-2 gap-2">
                                                    <span className="text-muted-foreground">
                                                        Instructor:
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {formatFacultyName(
                                                            conflict.teacher
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pt-4 mt-4 border-t border-border">
                                                <Link
                                                    href={route(
                                                        "course_scheduling.index"
                                                    )}
                                                    className="w-full text-sm"
                                                >
                                                    <Button
                                                        className="flex items-center justify-center w-full gap-2 text-white transition-all duration-200 bg-red-600 shadow-sm hover:bg-red-700 hover:shadow-md dark:bg-red-700 dark:hover:bg-red-800"
                                                        onClick={() => {
                                                            // Set to localStorage
                                                            localStorage.setItem(
                                                                "selectedCourse",
                                                                JSON.stringify(
                                                                    conflict.course
                                                                )
                                                            );
                                                            localStorage.setItem(
                                                                "selectedSemester",
                                                                JSON.stringify(
                                                                    selectedPeriod
                                                                )
                                                            );
                                                            localStorage.setItem(
                                                                "selectedLevel",
                                                                JSON.stringify(
                                                                    getYearLevelFromSection(
                                                                        conflict.section
                                                                    )
                                                                )
                                                            );
                                                            localStorage.setItem(
                                                                "selectedYear",
                                                                JSON.stringify(
                                                                    conflict.year
                                                                )
                                                            );
                                                            localStorage.setItem(
                                                                "selectedSection",
                                                                JSON.stringify(
                                                                    conflict.section
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        <WrenchIcon size={16} />
                                                        Fix Schedule
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="italic text-muted-foreground">
                                        No schedule conflicts found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
