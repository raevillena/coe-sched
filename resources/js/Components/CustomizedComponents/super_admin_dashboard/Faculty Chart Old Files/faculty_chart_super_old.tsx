import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, BarChart, XAxis, YAxis, LabelList, Cell } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { ChartBar } from "lucide-react";
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

interface Schedule {
    id: number;
    title: string;
    course: string;
    startTime: string;
    endTime: string;
    room: string;
    teacher: string;
    daysOfWeek: number[];
}

interface FacultyLoadProps {
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
}

function parseTime(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
}

function computeTodayLoad(schedule: Schedule, currentDay: number): number {
    if (!schedule.daysOfWeek || !Array.isArray(schedule.daysOfWeek)) {
        return 0;
    }
    if (schedule.daysOfWeek.includes(currentDay)) {
        const start = parseTime(schedule.startTime);
        const end = parseTime(schedule.endTime);
        return end - start;
    }
    return 0;
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

// group schedules by teacher and compute the total load per teacher based on the selected view mode.
function calculateFacultyLoads(
    schedules: Schedule[],
    viewMode: "weekly" | "today"
) {
    const teacherLoads: { [teacher: string]: number } = {};
    const currentDay = new Date().getDay(); // sunday=0, monday=1, etc.

    schedules.forEach((schedule) => {
        let load = 0;

        if (viewMode === "weekly") {
            // weekly load is the total duration of all sessions for the week
            if (schedule.daysOfWeek && Array.isArray(schedule.daysOfWeek)) {
                const sessionDuration =
                    parseTime(schedule.endTime) - parseTime(schedule.startTime);
                load = sessionDuration * schedule.daysOfWeek.length; //multiply by days the session occurs
            }
        } else if (viewMode === "today") {
            load = computeTodayLoad(schedule, currentDay);
        }

        if (teacherLoads[schedule.teacher]) {
            teacherLoads[schedule.teacher] += load;
        } else {
            teacherLoads[schedule.teacher] = load;
        }
    });

    return Object.keys(teacherLoads).map((teacher) => ({
        faculty: formatFacultyName(teacher),
        hours: teacherLoads[teacher],
    }));
}

const chartConfig: ChartConfig = {
    hours: {
        label: "Total Hours",
    },
};

export default function FacultyOverloadUnderloadChart({
    userDepartmentId,
    userRole,
}: FacultyLoadProps) {
    interface Period {
        id: number;
        period_name: string;
    }

    const [viewMode, setViewMode] = useState<"weekly" | "today">("today");
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState("1st Semester");

    const fetchPeriods = async () => {
        try {
            const response = await axios.get(route("get.periods"));
            setPeriods(response.data);
        } catch (error) {
            console.error("Error fetching periods:", error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const schedulesResponse = await axios.get<Schedule[]>(
                    route("user.schedules"),
                    {
                        params: {
                            period: selectedPeriod,
                            department_id: userDepartmentId,
                        },
                    }
                );
                setSchedules(schedulesResponse.data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        fetchPeriods();
    }, [selectedPeriod]);

    const chartData = calculateFacultyLoads(schedules, viewMode);

    return (
        <Card className="h-[500px]">
            <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="flex items-center">
                        Faculty Load Chart{" "}
                        <ChartBar className="ml-2" color="#FF8C00" size={34} />
                    </CardTitle>

                    <div className="flex gap-3">
                        <Select
                            value={viewMode}
                            onValueChange={(value: "weekly" | "today") =>
                                setViewMode(value)
                            }
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="View Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            name="period_faculty_load_chart"
                            value={selectedPeriod}
                            onValueChange={(value) => setSelectedPeriod(value)}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Please Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Periods</SelectLabel>
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
                <CardDescription>
                    Total Hours for Faculty Members (
                    {viewMode === "weekly" ? "Weekly" : "Today"})
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div>
                        <Skeleton className="h-[298px] w-[800px] rounded-xl" />
                    </div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 bg-red-100 border border-red-200 rounded-md">
                        <p className="text-lg font-semibold text-red-600">
                            No faculty data available.
                        </p>
                        <p className="mt-2 text-sm font-medium text-red-500">
                            Please review your scheduling at{" "}
                            <Button
                                variant="link"
                                className="px-1 text-red-700"
                            >
                                <Link href={route("course_scheduling.index")}>
                                    Course Scheduling
                                </Link>
                            </Button>
                            .
                        </p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="w-[530px]">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 10 }}
                            className="h-[400px]"
                        >
                            <YAxis
                                dataKey="faculty"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => String(value)}
                            />
                            <XAxis dataKey="hours" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="hours" layout="vertical" radius={5}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            entry.hours > 7
                                                ? "#FF4500"
                                                : entry.hours <= 5
                                                ? "#4682B4"
                                                : "#3CB371"
                                        }
                                    />
                                ))}
                                <LabelList
                                    dataKey="hours"
                                    position="insideRight"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Showing total hours for faculty members
                </div>
                <div className="leading-none text-muted-foreground">
                    <span className="text-[#FF4500] font-bold">Overload</span>{" "}
                    (more than 7 hours),{" "}
                    <span className="text-[#4682B4] font-bold">Underload</span>{" "}
                    (5 hours or less), and{" "}
                    <span className="text-[#3CB371] font-bold">
                        Normal load
                    </span>{" "}
                    in green.
                </div>
            </CardFooter>
        </Card>
    );
}
