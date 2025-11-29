import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChartBar } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    ChartOptions,
    TooltipItem,
} from "chart.js";

import {
    Card,
    CardContent,
    CardDescription,
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
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { SelectDept } from "@/Components/CustomizedComponents/select-component";
import { Department } from "@/types/my_types";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

interface Schedule {
    id: number;
    title: string;
    course: string;
    room: string;
    teacher: string;
    daysOfWeek: number[];
    label: string;
    curriculum: {
        lec: number | null;
        lab: number | null;
        units: number | null;
    } | null;
}

interface FacultyLoadProps {
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
    departments: {
        data: Department[];
    };
}

interface InstructorWithDeloading {
    name: string;
    deloading: number;
}

interface Period {
    id: number;
    period_name: string;
}

interface FacultyChartData {
    faculty: string;
    units: number;
    classification: string;
    deloading: number;
    normalLoad: number;
    teacherKey: string; 
}

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

const isLabOrSplit = (label: string | undefined, lec: number): boolean => {
    return (
        label?.toLowerCase().startsWith("lab") ||
        label?.toLowerCase().startsWith("split 1") ||
        label?.toLowerCase().startsWith("split") ||
        lec === 0
    );
};

const calculateFacultyLoads = (
    schedules: Schedule[],
    instructors: InstructorWithDeloading[]
): FacultyChartData[] => {
    const teacherLoads: { [teacher: string]: number } = {};
    const deloadingMap: { [teacher: string]: number } = {};

    instructors.forEach(instructor => {
        deloadingMap[instructor.name] = instructor.deloading || 0;
    });

    schedules.forEach((schedule) => {
        if (!deloadingMap.hasOwnProperty(schedule.teacher)) return;

        const lec = schedule.curriculum?.lec || 0;
        const lab = schedule.curriculum?.lab || 0;
        const label = schedule.label;

        const hasLabLabel = isLabOrSplit(label, lec);

        const actualLoad = hasLabLabel ? (lab > 0 ? lab * 3 : lec) : lec;

        teacherLoads[schedule.teacher] =
            (teacherLoads[schedule.teacher] || 0) + actualLoad;
    });

    return Object.keys(teacherLoads).map((teacher) => {
        const deloading = deloadingMap[teacher] || 0;
        const normalLoad = 18 - deloading;
        const totalUnits = teacherLoads[teacher];

        let classification: string;
        if (totalUnits > normalLoad) classification = "Overload";
        else if (totalUnits < normalLoad) classification = "Underload";
        else classification = "Normal Load";

        return {
            faculty: formatFacultyName(teacher),
            units: totalUnits,
            classification,
            deloading,
            normalLoad,
            teacherKey: teacher,
        };
    });
};

const FacultyOverloadUnderloadChart: React.FC<FacultyLoadProps> = ({
    userDepartmentId,
    userRole,
    departments,
}) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [periods, setPeriods] = useState<Period[]>([]);
    const [instructors, setInstructors] = useState<InstructorWithDeloading[]>([]);

    // Initialize with saved value from localStorage
    const [selectedPeriod, setSelectedPeriod] = useState(() => {
        const savedSelections = localStorage.getItem("facultyloadselection");
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

    const [departmentId, setDepartmentId] = useState<string>(() => {
        const savedSelections = localStorage.getItem("facultyloadselection");
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

    // Save selections to localStorage whenever they change
    useEffect(() => {
        const selections = {
            period: selectedPeriod,
            department: departmentId,
        };
        localStorage.setItem(
            "facultyloadselection",
            JSON.stringify(selections)
        );
    }, [selectedPeriod, departmentId]);

    // Get the current theme
    const isDarkMode = document.documentElement.classList.contains("dark");

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 640; // Tailwind's 'sm' breakpoint

    const chartData = calculateFacultyLoads(schedules, instructors);

    // --- Tooltip callback for showing deloading ---
    const getDeloadingByLabel = (label: string): number => {
        // Find original teacher name by formatted label
        const teacher = chartData.find(fac => fac.faculty === label);
        return teacher ? teacher.deloading : 0;
    };

    const getNormalLoadByLabel = (label: string): number => {
        const teacher = chartData.find(fac => fac.faculty === label);
        return teacher ? teacher.normalLoad : 18;
    };

    // --- Chart Options ---
    const chartOptions: ChartOptions<"bar"> = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: isDarkMode
                        ? "hsl(217.2 32.6% 17.5%)"
                        : "rgba(0, 0, 0, 0.05)",
                    drawTicks: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: "normal",
                    },
                    color: isDarkMode ? "hsl(210 40% 98%)" : "#666",
                },
            },
            y: {
                grid: {
                    display: false,
                    drawTicks: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    padding: 11,
                    font: {
                        size: 12,
                    },
                    color: isDarkMode ? "hsl(210 40% 98%)" : "#333",
                },
            },
        },
        datasets: {
            bar: {
                barPercentage: isMobile ? 0.6 : 0.9,
                categoryPercentage: isMobile ? 0.55 : 0.8,
            },
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 15,
                bottom: 15,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDarkMode
                    ? "hsl(222.2 84% 4.9%)"
                    : "rgba(255, 255, 255, 0.95)",
                titleColor: isDarkMode ? "hsl(210 40% 98%)" : "#333",
                titleFont: {
                    size: 13,
                    weight: "bold",
                },
                bodyColor: isDarkMode ? "hsl(210 40% 98%)" : "#666",
                bodyFont: {
                    size: 12,
                    weight: "normal",
                },
                padding: 12,
                borderColor: isDarkMode
                    ? "hsl(217.2 32.6% 17.5%)"
                    : "rgba(0, 0, 0, 0.1)",
                borderWidth: 1,
                displayColors: true,
                callbacks: {
                    // Show deloading in both the title and label
                    title(items: TooltipItem<"bar">[]) {
                        const label = items[0]?.label ?? "";
                        const deloading = getDeloadingByLabel(label);
                        const normalLoad = getNormalLoadByLabel(label);
                        return deloading > 0
                            ? `${label} (Deloading: ${deloading}, Normal Load: ${normalLoad})`
                            : label;
                    },
                    label(item: TooltipItem<"bar">) {
                        const value = item.raw as number;
                        const label = item.label ?? "";
                        const deloading = getDeloadingByLabel(label);
                        const normalLoad = getNormalLoadByLabel(label);
                        let classification = "";
                        if (value > normalLoad) classification = "Overload";
                        else if (value < normalLoad) classification = "Underload";
                        else classification = "Normal Load";
                        return [
                            `Total Units: ${value}`,
                            `Status: ${classification}`,
                            `Deloading: ${deloading}`,
                            `Normal Load: ${normalLoad}`,
                        ];
                    },
                },
            },
        },
    };

    const getChartData = (data: FacultyChartData[]) => ({
        labels: data.map((item) => item.faculty),
        datasets: [
            {
                data: data.map((item) => item.units),
                backgroundColor: data.map((item) =>
                    item.classification === "Overload"
                        ? "rgba(239, 68, 68, 0.85)"
                        : item.classification === "Underload"
                        ? "rgba(249, 115, 22, 0.85)"
                        : "rgba(34, 197, 94, 0.85)"
                ),
                borderWidth: 1,
                borderColor: data.map((item) =>
                    item.classification === "Overload"
                        ? "rgb(239, 68, 68)"
                        : item.classification === "Underload"
                        ? "rgb(249, 115, 22)"
                        : "rgb(34, 197, 94)"
                ),
                borderRadius: 6,
                barThickness: 10,
                barPercentage: 0.8,
                categoryPercentage: 0.9,
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");
                const [
                    schedulesResponse,
                    periodsResponse,
                    instructorsResponse,
                ] = await Promise.all([
                    axios.get<Schedule[]>(route("user.schedules"), {
                        params: {
                            period: selectedPeriod,
                            department_id:
                                userRole === "super-admin"
                                    ? departmentId
                                    : userDepartmentId,
                        },
                    }),
                    axios.get<Period[]>(route("get.periods")),
                    axios.get<InstructorWithDeloading[]>(route("get_instructors")),
                ]);

                setSchedules(schedulesResponse.data);
                setPeriods(periodsResponse.data);
                setInstructors(instructorsResponse.data); // now contains deloading field
            } catch (err: any) {
                setError(
                    err.message || "An error occurred while fetching data"
                );
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedPeriod, departmentId, userRole, userDepartmentId]);

    return (
        <Card className="md:h-[500px] flex flex-col bg-background border-border shadow-sm">
            <CardHeader className="flex flex-col flex-none gap-2 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                            <ChartBar
                                className="text-orange-600 dark:text-orange-400"
                                size={24}
                            />
                        </div>
                        <div>
                            <CardTitle className="text-xl">
                                Faculty Actual Load
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                                Teaching load distribution across faculty
                                members
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
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
                                <SelectValue placeholder="Select Semester" />
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
                </div>
            </CardHeader>

            <CardContent className="relative flex-1 min-h-0 overflow-hidden">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                        <Skeleton className="w-full h-full rounded-xl" />
                    </div>
                ) : error ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-md p-6 text-center border rounded-lg border-red-200/20 bg-red-500/10 dark:bg-red-500/5 dark:border-red-500/20">
                            <p className="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">
                                Error loading data
                            </p>
                            <p className="text-sm text-red-500 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-md p-6 text-center border rounded-lg border-orange-200/20 bg-orange-500/10 dark:bg-orange-500/5 dark:border-orange-500/20">
                            <p className="mb-2 text-lg font-semibold text-orange-600 dark:text-orange-400">
                                No faculty data available
                            </p>
                            <p className="mb-4 text-sm text-orange-500 dark:text-orange-400">
                                Please review your scheduling to see faculty
                                load distribution
                            </p>
                            <Button
                                variant="outline"
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            >
                                <Link href={route("course_scheduling.index")}>
                                    Go to Course Scheduling
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full pr-2 overflow-auto">
                        <Bar
                            data={getChartData(chartData)}
                            options={chartOptions}
                        />
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col items-start flex-none gap-2 py-3 border-t bg-gray-50/50 dark:bg-gray-900/50">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Faculty Teaching Load Status
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[rgb(34,197,94)] mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                            Normal (default 18)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[rgb(249,115,22)] mr-2"></div>
                        <span className="text-gray-600">Under (&lt; normal)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[rgb(239,68,68)] mr-2"></div>
                        <span className="text-gray-600">Over (&gt; normal)</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default FacultyOverloadUnderloadChart;