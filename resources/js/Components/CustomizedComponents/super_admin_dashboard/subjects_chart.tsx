import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChartColumn, Info } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
} from "chart.js";

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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Department } from "@/types/my_types";
import { SelectDept } from "@/Components/CustomizedComponents/select-component";
import { Skeleton } from "@/Components/ui/skeleton";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";
import {
    toast_error,
    toast_success,
    toast_style_ignore_warning,
} from "@/types/my_types/mytoast";
import { Link } from "@inertiajs/react";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

interface Period {
    id: number;
    period_name: string;
}

interface SubjectsChartProps {
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
    departments: {
        data: Department[];
    };
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
}

export default function SubjectsChart({
    userDepartmentId,
    userRole,
    departments,
    userTheme,
    systemTheme,
}: SubjectsChartProps) {
    interface YearLevel {
        id: number;
        level_name: string;
    }

    const [chartData, setChartData] = useState<any[]>([]);
    const [missingSchedules, setMissingSchedules] = useState<any[]>([]);

    const [selectedPeriod, setSelectedPeriod] = useState(() => {
        const savedSelections = localStorage.getItem("subjectchartselection");
        if (savedSelections) {
            try {
                const { period } = JSON.parse(savedSelections);
                if (period) return period;
            } catch (e) {
                console.error("Error parsing saved selections:", e);
            }
        }
        return "1st Semester";
    });

    const [periods, setPeriods] = useState<Period[]>([]);

    const [departmentId, setDepartmentId] = useState<string>(() => {
        const savedSelections = localStorage.getItem("subjectchartselection");
        if (savedSelections) {
            try {
                const { department } = JSON.parse(savedSelections);
                if (department) return department;
            } catch (e) {
                console.error("Error parsing saved selections:", e);
            }
        }
        return String(userDepartmentId);
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);

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

    // Save selections to localStorage whenever they change
    useEffect(() => {
        const selections = {
            period: selectedPeriod,
            department: departmentId,
        };
        localStorage.setItem(
            "subjectchartselection",
            JSON.stringify(selections)
        );
    }, [selectedPeriod, departmentId]);

    const [viewMode, setViewMode] = useState<
        "missingSplits" | "missingSchedules"
    >(() => {
        // Load initial value from localStorage or default to "missingSplits"
        const savedMode = localStorage.getItem("subjectsChartViewMode");
        return (
            (savedMode as "missingSplits" | "missingSchedules") ||
            "missingSplits"
        );
    });

    // Save selections to localStorage
    useEffect(() => {
        const selections = {
            period: selectedPeriod,
            department: departmentId,
        };
        localStorage.setItem(
            "subjectchartselection",
            JSON.stringify(selections)
        );
    }, [selectedPeriod, departmentId]);

    const handleFixSplit = (split: any) => {
        toast_success({
            message: `Fixing split for  ${
                split.course
            },  ${selectedPeriod}, ${getYearLevelFromSection(split.section)}, ${
                split.year
            }, ${split.section}`,
            userTheme,
        });
    };

    //for clicking add schedule button
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

    // Save viewMode to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("subjectsChartViewMode", viewMode);
    }, [viewMode]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Get the current theme
    const isDarkMode = document.documentElement.classList.contains("dark");

    const fetchPeriods = async () => {
        try {
            const response = await axios.get(route("get.periods"));
            setPeriods(response.data);
        } catch (error) {
            console.error("Error fetching periods:", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError("");
        setChartData([]);
        setMissingSchedules([]);

        try {
            const response = await axios.get(route("subjects.scheduled"), {
                params: {
                    period: selectedPeriod,
                    department_id:
                        userRole === "super-admin"
                            ? departmentId
                            : userDepartmentId,
                },
            });

            if (response.data) {
                if (response.data.missingSplits.length > 0) {
                    // console.log("missingSplits:", response.data.missingSplits);
                    const transformedSplits = response.data.missingSplits.map(
                        (missingSplit: any) => {
                            const matchingSchedule =
                                response.data.schedules.find(
                                    (schedule: any) =>
                                        schedule.title ===
                                            missingSplit.subject &&
                                        schedule.section ===
                                            missingSplit.section
                                );

                            return {
                                id:
                                    matchingSchedule?.id ||
                                    `${missingSplit.subject}-${missingSplit.missingSplit}`,
                                subject: `${missingSplit.subject} (${missingSplit.missingSplit})`,
                                section: missingSplit.section,
                                notScheduled: 1,
                                color: missingSplit.color,
                                year: missingSplit.year,
                                course: missingSplit.course,
                            };
                        }
                    );

                    setChartData(transformedSplits);
                }
                if (response.data.missingSchedules.length > 0) {
                    setMissingSchedules(response.data.missingSchedules);
                }
            } else {
                setChartData([]);
                setMissingSchedules([]);
            }
        } catch (error: any) {
            console.error("Error fetching data:", error.response || error);
            setError(
                "Unable to fetch data. Please ensure a department and period are selected, then try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Load data when selections change
    useEffect(() => {
        fetchData();
        fetchPeriods();
    }, [selectedPeriod, departmentId]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
        }
    }, [chartData, missingSchedules, viewMode, loading]);

    const handleIgnoreAllSplits = async (ids: string[]) => {
        toast(
            (t) => (
                <span>
                    <div className="flex justify-center mb-2">
                        <Info size={48} color="rgb(59, 130, 246)" />
                    </div>
                    <p className="flex font-medium">
                        Are you sure you want to ignore all missing splits for
                        the {selectedPeriod}?
                    </p>

                    <div className="flex justify-end mt-2 space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    const promises = ids.map((id) =>
                                        axios.post(
                                            route("ignore.missing.splits"),
                                            { id }
                                        )
                                    );

                                    await Promise.all(promises);

                                    toast_success({
                                        message: `All missing splits ignored successfully.`,
                                        userTheme,
                                    });

                                    fetchData();
                                } catch (error) {
                                    toast_error({
                                        message: `Failed to ignore missing splits.`,
                                        userTheme,
                                    });
                                } finally {
                                    toast.dismiss(t.id);
                                }
                            }}
                        >
                            <b>Ignore Missing Splits</b>
                        </Button>
                    </div>
                </span>
            ),
            {
                style: toast_style_ignore_warning({ userTheme, systemTheme }),
            }
        );
    };

    const getChartData = (data: any[]) => {
        const labels = data.map((item) =>
            viewMode === "missingSchedules"
                ? item.course_code
                : "" + item.section + ": " + item.subject
        );
        const backgroundColor =
            viewMode === "missingSchedules"
                ? "rgba(249, 115, 22, 0.7)"
                : data.map(
                      (item: any) => item.color || "rgba(99, 102, 241, 0.7)"
                  );
        const borderColor =
            viewMode === "missingSchedules"
                ? "rgb(249, 115, 22)"
                : data.map((item: any) => item.color || "rgb(99, 102, 241)");
        const hoverBackgroundColor =
            viewMode === "missingSchedules"
                ? "rgba(249, 115, 22, 0.9)"
                : data.map(
                      (item: any) =>
                          (item.color &&
                              item.color.replace(/[\d\.]+\)$/, "0.9)")) ||
                          "rgba(99, 102, 241, 0.9)"
                  );

        return {
            labels,
            datasets: [
                {
                    label:
                        viewMode === "missingSchedules"
                            ? "Not Scheduled"
                            : "Missing Splits",
                    data: data.map(() => 1),
                    backgroundColor,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor,
                    hoverBackgroundColor,
                },
            ],
        };
    };

    return (
        <Card className=" md:h-[500px] lg:h-auto bg-background border-border shadow-sm">
            <CardHeader className="space-y-4">
                {/* Responsive header flex-wrap and direction */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Icon + Title */}
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                            <ChartColumn
                                className="text-orange-600 dark:text-orange-400"
                                size={24}
                            />
                        </div>
                        <div>
                            <CardTitle className="text-lg sm:text-xl">
                                Subject Analysis
                            </CardTitle>
                            <p className="text-xs text-gray-500 sm:text-sm">
                                {viewMode === "missingSchedules"
                                    ? "Unscheduled Subjects Overview"
                                    : "Split Configuration Status"}
                            </p>
                        </div>
                    </div>

                    {/* Right: Select and Button */}
                    <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center sm:gap-3 sm:w-auto">
                        <Select
                            name="view_mode"
                            value={viewMode}
                            onValueChange={(
                                value: "missingSplits" | "missingSchedules"
                            ) => setViewMode(value)}
                        >
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <SelectValue placeholder="View Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>View Options</SelectLabel>
                                    <SelectItem value="missingSchedules">
                                        Missing Schedules
                                    </SelectItem>
                                    <SelectItem value="missingSplits">
                                        Missing Splits
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {viewMode === "missingSplits" &&
                            chartData.length > 0 && (
                                <Button
                                    onClick={() =>
                                        handleIgnoreAllSplits(
                                            chartData.map((item) => item.id)
                                        )
                                    }
                                    variant="outline"
                                    className="w-full transition-colors border-orange-200 dark:border-orange-400/20 hover:bg-orange-50 dark:hover:bg-orange-500/10 sm:w-auto"
                                >
                                    <span className="text-orange-700">
                                        Ignore All
                                    </span>
                                </Button>
                            )}
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-3 pt-3 border-t sm:flex-row sm:flex-wrap sm:items-center">
                    {userRole === "super-admin" && (
                        <div className="w-full sm:w-[200px]">
                            <SelectDept
                                id="department_id"
                                departments={departments}
                                value={departmentId}
                                onChange={(value) => setDepartmentId(value)}
                                userDepartmentId={userDepartmentId}
                                userRole={userRole}
                            />
                        </div>
                    )}
                    <div className="w-full sm:w-[200px]">
                        <Select
                            name="period_faculty_load_chart"
                            value={selectedPeriod}
                            onValueChange={(value) => setSelectedPeriod(value)}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Semesters</SelectLabel>
                                    {periods.map((period) => (
                                        <SelectItem
                                            value={period.period_name}
                                            key={period.id}
                                        >
                                            {period.period_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-2 mb-6 sm:px-6">
                {loading ? (
                    <div className="flex flex-col gap-4 items-center justify-center h-[200px] sm:h-[300px]">
                        <Skeleton className="h-[120px] sm:h-[200px] w-full rounded-xl" />
                        <Skeleton className="w-32 h-4 sm:w-48" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg sm:p-6 border-red-200/20 bg-red-500/10 dark:bg-red-500/5 dark:border-red-500/20">
                        <div className="p-3 mb-3 bg-red-100 rounded-full dark:bg-red-500/20">
                            <Info className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-base font-semibold text-red-600 sm:text-lg">
                            {error}
                        </p>
                    </div>
                ) : missingSchedules.length === 0 &&
                  viewMode === "missingSchedules" ? (
                    <div className="flex flex-col items-center justify-center p-6 border border-green-100 rounded-lg sm:p-8 dark:border-green-500/20 bg-green-50 dark:bg-green-500/5">
                        <div className="p-3 mb-3 bg-green-100 rounded-full dark:bg-green-500/20">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <p className="text-base font-semibold text-green-700 sm:text-lg">
                            All Subjects Scheduled
                        </p>
                        <p className="mt-1 text-xs text-green-600 sm:text-sm">
                            No pending schedules found
                        </p>
                    </div>
                ) : chartData.length === 0 && viewMode === "missingSplits" ? (
                    <div className="flex flex-col items-center justify-center p-6 border border-blue-100 rounded-lg sm:p-8 bg-blue-50">
                        <div className="p-3 mb-3 bg-blue-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-base font-semibold text-blue-700 sm:text-lg">
                            No Split Issues Found
                        </p>
                        <p className="mt-1 text-xs text-blue-600 sm:text-sm">
                            All schedules are properly configured
                        </p>
                    </div>
                ) : (
                    <div
                        ref={scrollContainerRef}
                        className="h-[200px] sm:h-[300px] 3xl:h-[760px] flex flex-col"
                    >
                        <Bar
                            data={getChartData(
                                viewMode === "missingSchedules"
                                    ? missingSchedules
                                    : chartData
                            )}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1,
                                            font: { size: 12 },
                                            color: isDarkMode
                                                ? "hsl(210 40% 98%)"
                                                : "hsl(222.2 84% 4.9%)",
                                        },
                                        grid: {
                                            color: isDarkMode
                                                ? "hsl(217.2 32.6% 17.5%)"
                                                : "rgba(0,0,0,0.05)",
                                        },
                                    },
                                    x: {
                                        ticks: {
                                            autoSkip: false,
                                            maxRotation: 45,
                                            minRotation: 0,
                                            autoSkipPadding: 10,
                                            font: { size: 11 },
                                            color: isDarkMode
                                                ? "hsl(210 40% 98%)"
                                                : "hsl(222.2 84% 4.9%)",
                                        },
                                        grid: {
                                            display: false,
                                        },
                                    },
                                },
                                plugins: {
                                    legend: {
                                        position: "top" as const,
                                        labels: {
                                            padding: 20,
                                            usePointStyle: true,
                                            font: { size: 12 },
                                            color: isDarkMode
                                                ? "hsl(210 40% 98%)"
                                                : "hsl(222.2 84% 4.9%)",
                                        },
                                    },
                                    tooltip: {
                                        backgroundColor: isDarkMode
                                            ? "hsl(222.2 84% 4.9%)"
                                            : "rgba(255, 255, 255, 0.9)",
                                        titleColor: isDarkMode
                                            ? "hsl(210 40% 98%)"
                                            : "#000",
                                        bodyColor: isDarkMode
                                            ? "hsl(210 40% 98%)"
                                            : "#666",
                                        borderColor: isDarkMode
                                            ? "hsl(217.2 32.6% 17.5%)"
                                            : "rgba(0,0,0,0.1)",
                                        borderWidth: 1,
                                    },
                                },
                                animation: {
                                    duration: 500,
                                },
                            }}
                        />

                        {viewMode === "missingSplits" &&
                            chartData.length > 0 && (
                                <div className="">
                                    <div className="mt-2 flex flex-row gap-2 justify-between w-full">
                                        {chartData.map((split) => (
                                            <Link
                                                key={split.id}
                                                href={route(
                                                    "course_scheduling.index"
                                                )}
                                                className="flex-1 mx-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-100 dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-900/30 px-2 py-1 text-xs"
                                            >
                                                <button
                                                    className="flex items-center justify-center w-full h-full"
                                                    style={{
                                                        minWidth: 0,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    onClick={() => {
                                                        // Set to localStorage
                                                        localStorage.setItem(
                                                            "selectedCourse",
                                                            JSON.stringify(
                                                                split.course
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
                                                                    split.section
                                                                )
                                                            )
                                                        );
                                                        localStorage.setItem(
                                                            "selectedYear",
                                                            JSON.stringify(
                                                                split.year
                                                            )
                                                        );
                                                        localStorage.setItem(
                                                            "selectedSection",
                                                            JSON.stringify(
                                                                split.section
                                                            )
                                                        );
                                                    }}
                                                >
                                                    Add Schedule
                                                </button>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-2 pt-4 pb-4 border-t sm:px-6 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex flex-col items-center justify-between w-full gap-2 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-orange-100">
                            <Info size={14} className="text-orange-600" />
                        </div>
                        <p className="text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                            {viewMode === "missingSchedules"
                                ? `${missingSchedules.length} subjects pending scheduling`
                                : `${chartData.length} subjects with missing splits`}
                        </p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
