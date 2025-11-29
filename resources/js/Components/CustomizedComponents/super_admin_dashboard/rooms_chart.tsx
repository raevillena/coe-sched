import { useState, useEffect } from "react";
import { ChartPie, TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
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
import axios from "axios";
import { Skeleton } from "@/Components/ui/skeleton";

interface Schedule {
    room: string;
    startTime: string;
    endTime: string;
    year: string;
}

interface RoomUsage {
    status: "utilized" | "unutilized";
    rooms: string[];
    fill: string;
}

const fetchScheduleData = async (): Promise<Schedule[]> => {
    const response = await axios.get(route("rooms.schedules_data"), {});
    const data = response.data;
    // console.log(data);
    return data;
};

const calculateRoomUsage = (scheduleData: Schedule[]): RoomUsage[] => {
    const roomUsage: Record<string, number> = {};
    scheduleData.forEach((schedule) => {
        const { room, startTime, endTime } = schedule;

        const startHour = parseInt(startTime.split(":")[0], 10);
        const endHour = parseInt(endTime.split(":")[0], 10);

        if (isNaN(startHour) || isNaN(endHour)) {
            console.error(
                `Invalid time data: Start Time = ${startTime}, End Time = ${endTime}`
            );
            return;
        }

        const hoursUsed = endHour - startHour;

        if (!roomUsage[room]) {
            roomUsage[room] = 0;
        }

        roomUsage[room] += hoursUsed;
    });

    const utilizedRooms = Object.keys(roomUsage).filter(
        (room) => roomUsage[room] >= 7
    );
    const unutilizedRooms = Object.keys(roomUsage).filter(
        (room) => roomUsage[room] < 7
    );

    return [
        {
            status: "utilized",
            rooms: utilizedRooms,
            fill: "var(--color-utilized)",
        },
        {
            status: "unutilized",
            rooms: unutilizedRooms,
            fill: "var(--color-unutilized)",
        },
    ];
};

const chartConfig: ChartConfig = {
    rooms: {
        label: "Rooms",
    },
    utilized: {
        label: "Utilized",
        color: "#22C55E",
    },
    unutilized: {
        label: "Unutilized",
        color: "#D83F40",
    },
};

export default function RoomsChart() {
    const [chartData, setChartData] = useState<RoomUsage[]>([]);
    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<RoomUsage[] | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const scheduleData = await fetchScheduleData();

                if (!scheduleData || scheduleData.length === 0) {
                    setError("No data available.");
                    return;
                }

                const latestYear = Math.max(
                    ...scheduleData.map((schedule) => Number(schedule.year))
                );
                setCurrentYear(latestYear);

                const currentYearSchedules = scheduleData.filter(
                    (schedule) => Number(schedule.year) === latestYear
                );
                const data = calculateRoomUsage(currentYearSchedules);
                setChartData(data);
                setError(null); // Clear any previous errors
            } catch (error) {
                console.error(error);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChartClick = () => {
        const fetchData = async () => {
            try {
                const scheduleData = await fetchScheduleData();

                if (!scheduleData || scheduleData.length === 0) {
                    setError("No data available.");
                    return;
                }

                const latestYear = Math.max(
                    ...scheduleData.map((schedule) => Number(schedule.year))
                );
                const currentYearSchedules = scheduleData.filter(
                    (schedule) => Number(schedule.year) === latestYear
                );
                const detailedData = calculateRoomUsage(currentYearSchedules);
                setDialogContent(detailedData);
                setError(null); // Clear any previous errors
            } catch (error) {
                console.error(error);
                setError("Failed to fetch data.");
            }
        };

        fetchData();
        setDialogOpen(true);
    };

    return (
        <>
            <Card
                className={`flex flex-col w-[550px] 3xl:w-[1200px]  ${
                    error ? "h-[400px]" : ""
                }`}
            >
                <CardHeader className="space-y-4">
                    <div className="flex gap-2">
                        <div className="p-3 rounded-lg bg-orange-50">
                            <ChartPie className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-xl">
                                Rooms Chart
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                                Utilized vs Underutilized Rooms
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    {loading ? (
                        <Skeleton className="h-[235px] 3xl:h-[auto] w-[auto] rounded-xl mt-2 mb-2" />
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center p-6 mt-2 mb-2 bg-orange-100 border border-orange-200 rounded-md">
                            <p className="text-lg font-semibold text-orange-600">
                                {error}
                            </p>
                        </div>
                    ) : (
                        <ChartContainer
                            config={chartConfig}
                            className="h-[250px] 3xl:h-[480px] mx-auto aspect-square [&_.recharts-text]:fill-background cursor-pointer"
                            onClick={handleChartClick}
                        >
                            <PieChart>
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            nameKey="status"
                                            hideLabel
                                        />
                                    }
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="rooms.length"
                                    className="cursor-pointer"
                                >
                                    <LabelList
                                        dataKey="status"
                                        className="fill-background"
                                        stroke="none"
                                        fontSize={12}
                                        formatter={(
                                            value: keyof typeof chartConfig
                                        ) => chartConfig[value]?.label}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    )}
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        Room Utilization for S.Y. {currentYear ?? "N/A"} -{" "}
                        {currentYear ? currentYear + 1 : "N/A"}.{" "}
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Click on the pie to check the room usage details.
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
                <DialogContent className="max-h-[500px] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Room Usage Details</DialogTitle>
                        <DialogDescription>
                            Access comprehensive insights into room usage. Rooms
                            with 7 or more hours of activity are tagged as
                            "utilized," while those with less than 7 hours are
                            labeled "unutilized."
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-lg font-medium text-green-500">
                                Utilized Rooms
                            </p>
                            <div className="flex flex-col gap-1">
                                {dialogContent &&
                                    dialogContent
                                        .find(
                                            (usage) =>
                                                usage.status === "utilized"
                                        )
                                        ?.rooms.map((room, index) => (
                                            <div key={index}>
                                                <p>{room}</p>
                                                <hr />
                                            </div>
                                        ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-lg font-medium text-red-500">
                                Unutilized Rooms
                            </p>
                            <div className="flex flex-col gap-1">
                                {dialogContent &&
                                    dialogContent
                                        .find(
                                            (usage) =>
                                                usage.status === "unutilized"
                                        )
                                        ?.rooms.map((room, index) => (
                                            <div key={index}>
                                                <p>{room}</p>
                                                <hr />
                                            </div>
                                        ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
