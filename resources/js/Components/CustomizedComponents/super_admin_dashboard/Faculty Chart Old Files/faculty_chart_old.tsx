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
    room: string;
    teacher: string;
    daysOfWeek: number[]; 
    curriculum: {
        lec: number; 
        lab: number; 
    } | null; 
}

interface FacultyLoadProps {
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
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

function calculateFacultyLoads(schedules: Schedule[]) {
    const teacherLoads: { [teacher: string]: number } = {};

    schedules.forEach((schedule) => {
        // Calculate weekly load based on curriculum (lec + lab hours)
        // lec 1 unit = 1 hour, lab 1 unit = 3 hours
        const weeklyLoad =
            (schedule.curriculum?.lec || 0) * 1 + // 1 hour per unit for lectures
            (schedule.curriculum?.lab || 0) * 3; // 3 hours per unit for labs

        if (teacherLoads[schedule.teacher]) {
            teacherLoads[schedule.teacher] += weeklyLoad;
        } else {
            teacherLoads[schedule.teacher] = weeklyLoad;
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

    const chartData = calculateFacultyLoads(schedules);

    return (
        <Card className="h-[500px]">
            <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="flex items-center">
                        Faculty Load Chart{" "}
                        <ChartBar className="ml-2" color="#FF8C00" size={34} />
                    </CardTitle>

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
                <CardDescription>
                    Total Hours for Faculty Members (Weekly)
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