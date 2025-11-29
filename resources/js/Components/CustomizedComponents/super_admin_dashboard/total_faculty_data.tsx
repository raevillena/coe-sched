"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { TrendingUp, Users } from "lucide-react";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { ChartConfig, ChartContainer } from "@/Components/ui/chart";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

interface TotalFacultyDataProps {
    userTheme: "dark" | "light" | "system";
}

export default function TotalFacultyData({ userTheme }: TotalFacultyDataProps) {
    const [activePercentage, setActivePercentage] = useState(0);
    const [activeFaculty, setActiveFaculty] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [lastUpdated, setLastUpdated] = useState("");

    //store previous values for comparison
    const prevActiveFaculty = useRef(0);
    const prevTotalUsers = useRef(0);

    const isDarkMode = document.documentElement.classList.contains("dark");

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(
                    route("users.active_percentage")
                );
                const data = response.data;

                //check if there is any change in the active or total users
                if (
                    data.active_users !== prevActiveFaculty.current ||
                    data.total_users !== prevTotalUsers.current
                ) {
                    setActivePercentage(data.percentage);
                    setActiveFaculty(data.active_users);
                    setTotalUsers(data.total_users);
                    setLastUpdated(new Date().toLocaleDateString());

                    //update previous values
                    prevActiveFaculty.current = data.active_users;
                    prevTotalUsers.current = data.total_users;
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserData();
    }, []);

    const chartData = [
        {
            name: "Active Users",
            visitors: activePercentage,
            fill: isDarkMode ? "#3b82f6" : "#2563eb",
        },
    ];

    return (
        <Card className="flex flex-col w-full h-auto p-4 border-border shadow-med bg-background sm:shadow-none">
            <CardContent className="flex-1">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Section - Faculty Stats */}
                    <div className="lg:col-span-2">
                        <div className="h-full p-6 rounded-lg shadow-sm bg-card">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex items-center justify-center p-4 bg-blue-600 dark:bg-blue-500 rounded-lg shadow-md">
                                    <Users className="text-white" size={32} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="mb-2 text-xl font-semibold text-foreground">
                                        Faculty Members Overview
                                    </h2>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row items-baseline gap-1  text-center w-full">
                                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {activeFaculty}
                                            </span>
                                            <span className="text-lg text-gray-600 dark:text-gray-300">
                                                Active
                                            </span>
                                            <span className="mx-0 sm:mx-2 text-gray-400 dark:text-gray-500">
                                                /
                                            </span>
                                            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                                                {totalUsers}
                                            </span>
                                            <span className="text-base text-gray-500 dark:text-gray-400">
                                                Total
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Status:
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    activePercentage === 100
                                                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                                }`}
                                            >
                                                {activePercentage === 100
                                                    ? "All Active"
                                                    : "Partially Active"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3 border-t border-border">
                                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Last updated:{" "}
                                        <span className="font-medium">
                                            {lastUpdated}
                                        </span>
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:bg-blue-50 dark:hover:bg-blue-950/50 w-full sm:w-auto"
                                    >
                                        <Link
                                            href={route("faculties.index")}
                                            className="flex items-center justify-center gap-2 text-foreground"
                                        >
                                            View Faculty List
                                            <TrendingUp size={16} />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Chart */}
                    <div className="lg:col-span-1">
                        <div className="flex flex-col justify-center h-full p-6 rounded-lg shadow-sm bg-card">
                            <div className="aspect-square h-[220px] w-full mx-auto">
                                <RadialBarChart
                                    width={220}
                                    height={220}
                                    data={chartData}
                                    startAngle={90}
                                    endAngle={
                                        90 + 360 * (activePercentage / 100)
                                    }
                                    innerRadius={70}
                                    outerRadius={90}
                                >
                                    <PolarGrid
                                        gridType="circle"
                                        radialLines={false}
                                        stroke="none"
                                        polarRadius={[76, 64]}
                                    />
                                    <RadialBar
                                        dataKey="visitors"
                                        background={{
                                            fill: isDarkMode
                                                ? "#1f2937"
                                                : "#e5e7eb",
                                        }}
                                        cornerRadius={10}
                                    />
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-2xl font-bold fill-blue-800 dark:fill-blue-400"
                                    >
                                        {activePercentage.toFixed(0)}%
                                    </text>
                                    <text
                                        x="50%"
                                        y="60%"
                                        textAnchor="middle"
                                        className="text-sm fill-gray-500 dark:fill-gray-400"
                                    >
                                        Active Rate
                                    </text>
                                </RadialBarChart>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
