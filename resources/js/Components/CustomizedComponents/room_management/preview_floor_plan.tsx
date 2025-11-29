import React, { useState, useRef } from "react";
import { FloorPlan, Rectangle } from "@/types/my_types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Slider } from "@/Components/ui/slider";
import { CalendarDays } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import def_image from "/Images/no_image.jpg";
import "@/Components/CustomizedComponents/room_management/floor_plan.css";

interface PreviewFloorPlanProps {
    floor_plans: FloorPlan[];
    onSelectRoom?: (roomId: number) => void;
}

export function PreviewFloorPlan({
    floor_plans,
    onSelectRoom,
}: PreviewFloorPlanProps) {
    const baseUrl = import.meta.env.VITE_APP_URL;
    const [zoom, setZoom] = useState(() => floor_plans.map(() => 1));
    const [isPanning, setIsPanning] = useState(false);
    const [translate, setTranslate] = useState(() =>
        floor_plans.map(() => ({ x: 0, y: 0 }))
    );
    const [hoveredRoom, setHoveredRoom] = useState<Rectangle | null>(null);
    const [hoveredRoomId, setHoveredRoomId] = useState<number | null>(null);
    const lastMousePosition = useRef({ x: 0, y: 0 });

    const handleZoomChange = (value: number[], index: number) => {
        const newZoom = value[0] / 100;
        setZoom((prevZoom) => {
            const updatedZoom = [...prevZoom];
            updatedZoom[index] = newZoom;
            return updatedZoom;
        });

        if (newZoom === 1) {
            setTranslate((prevTranslate) => {
                const updatedTranslate = [...prevTranslate];
                updatedTranslate[index] = { x: 0, y: 0 };
                return updatedTranslate;
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        if (zoom[index] > 1) {
            setIsPanning(true);
            lastMousePosition.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e: React.MouseEvent, index: number) => {
        if (!isPanning) return;

        const deltaX = e.clientX - lastMousePosition.current.x;
        const deltaY = e.clientY - lastMousePosition.current.y;

        setTranslate((prev) => {
            const updatedTranslate = [...prev];
            updatedTranslate[index] = {
                x: prev[index].x + deltaX,
                y: prev[index].y + deltaY,
            };
            return updatedTranslate;
        });

        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleMouseLeave = () => {
        setIsPanning(false);
    };

    const handleMouseEnter = (rect: Rectangle) => {
        setHoveredRoom(rect);
        setHoveredRoomId(rect.id);
    };

    const handleMouseLeaveRoom = () => {
        setHoveredRoom(null);
        setHoveredRoomId(null);
    };

    return (
        <div className="w-full max-w-[1280px] mx-auto ">
            {floor_plans.length === 0 ? (
                <div className="text-center my-4">
                    <p className="text-md font-thin text-red-500">
                        No floor plan are currently available.
                    </p>
                </div>
            ) : (
                <>
                    <Carousel
                        className="w-full h-full max-w-full sm:max-w-[1280px] mx-auto"
                        id="floor_plan"
                    >
                        <CarouselContent id="floor_plan_content">
                            {floor_plans.map((floor_plan, index) => {
                                const {
                                    floor_plan_map,
                                    rectangles,
                                    building,
                                    floor,
                                } = floor_plan;

                                const imagePath = floor_plan_map
                                    ? `${baseUrl}/storage/${floor_plan_map}`
                                    : undefined;

                                return (
                                    <CarouselItem key={index}>
                                        {/* building and floor label */}
                                        <span className="text-sm sm:text-lg font-small text-center block mb-2">
                                            {building} - {floor}
                                        </span>
                                        <div
                                            className={cn(
                                                "floor-plan-container",
                                                zoom[index] > 1
                                                    ? "cursor-grab"
                                                    : "cursor-default"
                                            )}
                                            style={{
                                                transform: `translate(${translate[index].x}px, ${translate[index].y}px) scale(${zoom[index]})`,
                                                transition: isPanning
                                                    ? "none"
                                                    : "transform 0.3s ease-in-out",
                                            }}
                                            onMouseDown={(e) =>
                                                handleMouseDown(e, index)
                                            }
                                            onMouseMove={(e) =>
                                                handleMouseMove(e, index)
                                            }
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <img
                                                src={imagePath}
                                                alt={`${building} - Floor ${floor}`}
                                                className="floor-plan-image w-full h-auto mx-auto"
                                            />

                                            <div className="absolute top-0 left-0 w-full h-full">
                                                {rectangles.map((rect) => (
                                                    <HoverCard key={rect.id}>
                                                        <HoverCardTrigger
                                                            asChild
                                                        >
                                                            <div
                                                                className={`absolute cursor-pointer flex items-center justify-center text-black text-md border-2 rounded-lg h-12 w-30 touch-none z-10 transition duration-300 ${
                                                                    rect.is_active ===
                                                                    0
                                                                        ? "rect_is_not_active border-red-500 bg-red-100 hover:border-red-700 hover:bg-red-300"
                                                                        : "absolute border-2 cursor-pointer"
                                                                }`}
                                                                style={{
                                                                    width: `${
                                                                        (rect.width /
                                                                            1280) *
                                                                        100
                                                                    }%`,
                                                                    height: `${
                                                                        (rect.height /
                                                                            720) *
                                                                        100
                                                                    }%`,
                                                                    left: `calc(50% + ${
                                                                        (rect.x /
                                                                            1280) *
                                                                        100
                                                                    }% - ${
                                                                        (rect.width /
                                                                            1280) *
                                                                        50
                                                                    }%)`,
                                                                    top: `calc(${
                                                                        (rect.y /
                                                                            720) *
                                                                        100
                                                                    }% + 1vh)`,
                                                                    position:
                                                                        "absolute",
                                                                    backgroundColor:
                                                                        rect.color,
                                                                    borderColor:
                                                                        rect.borderColor,
                                                                }}
                                                                onMouseEnter={() =>
                                                                    handleMouseEnter(
                                                                        rect
                                                                    )
                                                                }
                                                                onMouseLeave={
                                                                    handleMouseLeaveRoom
                                                                }
                                                                onClick={() =>
                                                                    onSelectRoom &&
                                                                    onSelectRoom(
                                                                        rect.id
                                                                    )
                                                                }
                                                            >
                                                                <div className="p-2 text-center">
                                                                    <p
                                                                        className="font-medium text-center"
                                                                        style={{
                                                                            fontSize: `${Math.max(
                                                                                (rect.height /
                                                                                    720) *
                                                                                    16,
                                                                                16
                                                                            )}px`,
                                                                        }}
                                                                    >
                                                                        {
                                                                            rect.room_number
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </HoverCardTrigger>
                                                        {hoveredRoom &&
                                                            hoveredRoomId ===
                                                                rect.id && (
                                                                <HoverCardContent className=" w-80">
                                                                    <div className="flex justify-between space-x-4">
                                                                        <Avatar
                                                                            sx={{
                                                                                width: 120,
                                                                                height: 120,
                                                                            }}
                                                                            variant="square"
                                                                            alt="Room Image"
                                                                            src={
                                                                                hoveredRoom.room_image
                                                                                    ? `${
                                                                                          import.meta
                                                                                              .env
                                                                                              .VITE_APP_URL
                                                                                      }/storage/${
                                                                                          hoveredRoom.room_image
                                                                                      }`
                                                                                    : def_image
                                                                            }
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    def_image
                                                                                }
                                                                                alt="Default Image"
                                                                                style={{
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    objectFit:
                                                                                        "cover",
                                                                                }}
                                                                            />
                                                                        </Avatar>

                                                                        <div className="space-y-1">
                                                                            <h4 className="text-sm font-semibold">
                                                                                {
                                                                                    hoveredRoom.room_type
                                                                                }
                                                                            </h4>
                                                                            <p className="text-sm">
                                                                                {
                                                                                    hoveredRoom.room_number
                                                                                }{" "}
                                                                                is{" "}
                                                                                {hoveredRoom.department_priority &&
                                                                                hoveredRoom.department_priority !==
                                                                                    "N/A"
                                                                                    ? `primarily designated for the ${hoveredRoom.department_priority} department.`
                                                                                    : "available for general use."}
                                                                            </p>

                                                                            <p className="text-sm">
                                                                                <strong>
                                                                                    Status:
                                                                                </strong>{" "}
                                                                                <span
                                                                                    style={{
                                                                                        color:
                                                                                            hoveredRoom.is_active ===
                                                                                            1
                                                                                                ? "green"
                                                                                                : "red",
                                                                                    }}
                                                                                >
                                                                                    {hoveredRoom.is_active ===
                                                                                    1
                                                                                        ? "Utilized"
                                                                                        : "Unutilized"}
                                                                                </span>
                                                                            </p>
                                                                            <div className="flex items-center pt-2">
                                                                                <CalendarDays className="mr-2 h-6 w-6 opacity-70" />
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    Updated
                                                                                    last{" "}
                                                                                    {new Date(
                                                                                        hoveredRoom.updated_at
                                                                                    ).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </HoverCardContent>
                                                            )}
                                                    </HoverCard>
                                                ))}
                                            </div>
                                        </div>

                                        {/* zoom slider */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="w-full max-w-[1280px] mx-auto p-2 rounded-lg shadow-md">
                                                <p className="font-medium">
                                                    Legend:
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                                                        <p>Faculty Room</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                                                        <p>Lecture Room</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-green-500 mr-2"></div>
                                                        <p>Laboratory Room</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 bg-gray-500 mr-2"></div>
                                                        <p>
                                                            Custom Room
                                                            (User-Defined)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center mt-3 mb-1">
                                                <Slider
                                                    defaultValue={[100]}
                                                    max={150}
                                                    min={100}
                                                    step={5}
                                                    onValueChange={(value) =>
                                                        handleZoomChange(
                                                            value,
                                                            index
                                                        )
                                                    }
                                                    className={cn("w-[150px]")}
                                                />
                                                <div className="ml-2">
                                                    {(
                                                        zoom[index] * 100
                                                    ).toFixed(0)}
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </>
            )}
        </div>
    );
}
