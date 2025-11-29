import { useState, useEffect, useRef } from "react";
import { AcademicProgram, FloorPlan, Rectangle } from "@/types/my_types";
import { cn } from "@/lib/utils";
import "@/Components/CustomizedComponents/room_management/floor_plan.css";
import { Button } from "@/Components/ui/button";
import interact from "interactjs";
import {
    MdAddBox,
    MdLock,
    MdLockOpen,
    MdDelete,
    MdEdit,
    MdColorLens,
} from "react-icons/md";
import EditRoomDialog from "@/Components/CustomizedComponents/room_management/edit_room_dialog";
import { UploadFloorPlanDialog } from "@/Components/CustomizedComponents/room_management/upload_floor_plan_dialog";
import toast from "react-hot-toast";
import { toast_style_promise } from "@/types/my_types/mytoast";
import axios from "axios";
import { router } from "@inertiajs/react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface EditFloorPlanProps {
    floor_plans: FloorPlan[];
    isEditable: boolean;
    handleEdit: () => void;
    handleCancel: () => void;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    academic_programs: {
        data: AcademicProgram[];
    };
}

export default function EditFloorPlan({
    floor_plans,
    isEditable,
    handleEdit,
    handleCancel,
    academic_programs,
    userTheme,
    systemTheme,
}: EditFloorPlanProps) {
    const baseUrl = import.meta.env.VITE_APP_URL;
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [selectedRectangleId, setSelectedRectangleId] = useState<
        number | null
    >(null);
    const [copiedRectangle, setCopiedRectangle] = useState<Rectangle | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] =
        useState<boolean>(false);
    const [currentEditRectangle, setCurrentEditRectangle] =
        useState<Rectangle | null>(null);
    const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(
        floor_plans[0] || null
    );
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        null
    );
    const [newFloorPlanMap, setNewFloorPlanMap] = useState<File | null>(null);
    const [showColorOptions, setShowColorOptions] = useState<boolean>(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (floor_plans.length > 0) {
            setCurrentFloorPlan(floor_plans[0]);
        }
    }, [floor_plans]);

    useEffect(() => {
        if (currentFloorPlan) {
            const initialRectangles = (currentFloorPlan.rectangles || []).map(
                (rect) => ({
                    ...rect,
                    x: Number(rect.x) || 0,
                    y: Number(rect.y) || 0,
                })
            );
            setRectangles(initialRectangles);
        }
    }, [currentFloorPlan]);

    useEffect(() => {
        rectangles.forEach((rect) => {
            const interactable = interact(`#rectangle-${rect.id}`);
            if (isEditable && !rect.locked) {
                interactable
                    .draggable({
                        inertia: true,
                        autoScroll: true,
                        modifiers: [
                            interact.modifiers.restrictRect({
                                restriction:
                                    imageContainerRef.current || "parent",
                                endOnly: true,
                            }),
                            // interact.modifiers.snap({
                            //     targets: [interact.snappers.grid({ x: 2, y: 2 })],
                            //     range: Infinity,
                            //     relativePoints: [{ x: 0, y: 0 }],
                            // }),
                        ],
                        listeners: {
                            move: dragMoveListener,
                        },
                    })
                    .resizable({
                        edges: {
                            left: true,
                            right: true,
                            top: true,
                            bottom: true,
                        },
                        listeners: {
                            move: resizeListener,
                        },
                        modifiers: [
                            interact.modifiers.restrictEdges({
                                outer: imageContainerRef.current || "parent",
                                endOnly: true,
                            }),
                            interact.modifiers.restrictSize({
                                min: { width: 50, height: 50 },
                            }),
                        ],
                    });
            } else {
                interactable.unset();
            }
        });
    }, [isEditable, rectangles]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Delete" && selectedRectangleId !== null) {
                removeRectangle(selectedRectangleId);
            } else if (
                event.ctrlKey &&
                event.key === "c" &&
                selectedRectangleId !== null
            ) {
                event.preventDefault();
                copyRectangle(selectedRectangleId);
            } else if (
                event.ctrlKey &&
                event.key === "v" &&
                copiedRectangle !== null
            ) {
                event.preventDefault();
                pasteRectangle();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedRectangleId, copiedRectangle]);

    const dragMoveListener = (event: any) => {
        const id = parseInt(event.target.getAttribute("data-id"));
        setRectangles((prevRectangles) =>
            prevRectangles.map((rect) =>
                rect.id === id
                    ? { ...rect, x: rect.x + event.dx, y: rect.y + event.dy }
                    : rect
            )
        );
    };

    const resizeListener = (event: any) => {
        const id = parseInt(event.target.getAttribute("data-id"));
        setRectangles((prevRectangles) =>
            prevRectangles.map((rect) =>
                rect.id === id
                    ? {
                          ...rect,
                          x: rect.x + event.deltaRect.left,
                          y: rect.y + event.deltaRect.top,
                          width: event.rect.width,
                          height: event.rect.height,
                      }
                    : rect
            )
        );
    };

    const addRectangle = () => {
        const lastRoomNumber = rectangles.reduce((max, rect) => {
            const roomNumber = parseInt(rect.room_number.split(" ")[1], 10);
            return roomNumber > max ? roomNumber : max;
        }, 0);

        const currentTime = new Date().toISOString();

        const newRect: Rectangle = {
            id: rectangles.length
                ? rectangles[rectangles.length - 1].id + 1
                : 1,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            locked: false,
            room_number: `Room ${lastRoomNumber + 1}`,
            room_type: "Lecture Room",
            department_priority: "",
            description: "",
            room_image: null,
            is_active: 1,
            updated_at: currentTime,
            created_at: currentTime,
            color: "rgba(148, 219, 253)",
            borderColor: "#1576c1",
        };

        setRectangles([...rectangles, newRect]);
    };

    const changeFloorPlan = () => {
        setIsUploadDialogOpen(true);
    };

    const handleUploadFloorPlan = (newFloorPlan: FloorPlan) => {
        setCurrentFloorPlan({
            ...newFloorPlan,
            rectangles: rectangles, // preserve existing rectangles
        });
        setNewFloorPlanMap(newFloorPlan.floor_plan_map || null);
        setUploadedImageUrl(
            newFloorPlan.floor_plan_map
                ? URL.createObjectURL(newFloorPlan.floor_plan_map)
                : null
        );
        setIsUploadDialogOpen(false);
    };

    const removeRectangle = (id: number) => {
        setRectangles(rectangles.filter((rect) => rect.id !== id));
        if (selectedRectangleId === id) {
            setSelectedRectangleId(null);
        }
        if (currentEditRectangle && currentEditRectangle.id === id) {
            setCurrentEditRectangle(null);
            setIsDialogOpen(false);
        }
    };

    const copyRectangle = (id: number) => {
        const rect = rectangles.find((rect) => rect.id === id);
        if (rect) {
            setCopiedRectangle(rect);
        }
    };

    const pasteRectangle = () => {
        if (copiedRectangle) {
            const lastRoomNumber = rectangles.reduce((max, rect) => {
                const roomNumber = parseInt(rect.room_number.split(" ")[1], 10);
                return roomNumber > max ? roomNumber : max;
            }, 0);

            const newRect: Rectangle = {
                ...copiedRectangle,
                id: rectangles.length
                    ? rectangles[rectangles.length - 1].id + 1
                    : 1,
                x: copiedRectangle.x + 10,
                y: copiedRectangle.y + 10,
                room_number: `Room ${lastRoomNumber + 1}`,
            };
            setRectangles([...rectangles, newRect]);
            setSelectedRectangleId(newRect.id);
        }
    };

    const toggleLock = (id: number) => {
        setRectangles((prevRectangles) =>
            prevRectangles.map((rect) =>
                rect.id === id ? { ...rect, locked: !rect.locked } : rect
            )
        );
    };

    const handleRectangleClick = (id: number) => {
        setSelectedRectangleId(id);
    };

    const handleEditClick = (id: number) => {
        const rectToEdit = rectangles.find((rect) => rect.id === id);
        if (rectToEdit) {
            setCurrentEditRectangle(rectToEdit);
            setIsDialogOpen(true);
        }
    };

    const handleSaveRectangle = (updatedRect: Rectangle) => {
        let color = updatedRect.color;
        let borderColor = updatedRect.borderColor;

        if (updatedRect.room_type === "Lecture Room") {
            color = "rgba(148, 219, 253)";
            borderColor = "#1576c1";
        } else if (updatedRect.room_type === "Laboratory Room") {
            color = "rgba(38, 217, 143)";
            borderColor = "#10B981";
        } else if (updatedRect.room_type === "Faculty Room") {
            color = "rgba(249, 155, 83)";
            borderColor = "#F97316";
        } else {
            color = "rgba(211, 211, 211)";
            borderColor = "#808080";
        }

        setRectangles((prevRectangles) =>
            prevRectangles.map((rect) =>
                rect.id === updatedRect.id
                    ? { ...updatedRect, color, borderColor }
                    : rect
            )
        );
    };

    const updateFloorPlan = () => {
        const updateRectangles = rectangles.map((rect) => ({
            ...rect,
            locked: true,
        }));
        setRectangles(updateRectangles);

        const formData = new FormData();

        // console.log("currentFloorPlan", currentFloorPlan);

        if (newFloorPlanMap) {
            formData.append("floor_plan_map", newFloorPlanMap);
        } else if (currentFloorPlan?.floor_plan_map) {
            //don't do anything
        }

        const rectanglesData = updateRectangles.map(
            ({ room_image, ...rest }) => rest
        );
        formData.append("rectangles", JSON.stringify(rectanglesData));

        updateRectangles.forEach((rect, index) => {
            if (rect.room_image) {
                formData.append(`room_image_${index}`, rect.room_image);
            }
        });

        toast
            .promise(
                axios.post(
                    route("floor_plan.update", {
                        floor_plan: currentFloorPlan?.id,
                    }),
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                ),
                {
                    loading: "Updating floor plan...",
                    success: () => (
                        <span>Floor plan updated successfully!</span>
                    ),
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not update floor plan. Please try again later.";
                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then((response) => {
                setTimeout(() => {
                    router.visit(response.request.responseURL);
                }, 2000);
            })
            .catch((error) => {
                setRectangles(rectangles);
            });
    };

    const changeRectangleColor = (
        id: number,
        color: string,
        borderColor: string
    ) => {
        let room_type = "";

        if (color === "rgba(148, 219, 253)") {
            room_type = "Lecture Room";
        } else if (color === "rgba(38, 217, 143)") {
            room_type = "Laboratory Room";
        } else if (color === "rgba(249, 155, 83)") {
            room_type = "Faculty Room";
        }

        setRectangles((prevRectangles) =>
            prevRectangles.map((rect) =>
                rect.id === id
                    ? { ...rect, color, borderColor, room_type }
                    : rect
            )
        );
    };

    return (
        <div className="w-full max-w-[1280px] mx-auto">
            {currentFloorPlan && (
                <div>
                    {/* Building and floor label */}
                    <span className="text-lg font-small text-center block mb-2">
                        {currentFloorPlan.building} - {currentFloorPlan.floor}
                    </span>

                    {/* Control panel */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                        {/* Left Side Actions */}
                        <div className="flex flex-wrap gap-2">
                            {!isEditable && (
                                <Button
                                    id="edit-button"
                                    onClick={handleEdit}
                                    className="px-4 py-2 text-sm md:text-base"
                                >
                                    Edit
                                </Button>
                            )}
                            {isEditable && (
                                <Button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm md:text-base"
                                >
                                    Cancel
                                </Button>
                            )}
                            {isEditable && (
                                <Button
                                    variant="destructive"
                                    onClick={updateFloorPlan}
                                    className="px-4 py-2 text-sm md:text-base"
                                >
                                    Save Changes
                                </Button>
                            )}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex flex-wrap gap-2">
                            {isEditable && (
                                <Button
                                    onClick={addRectangle}
                                    className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition duration-300 ease-in-out text-sm md:text-base"
                                >
                                    Add Room
                                    <MdAddBox
                                        fontSize="x-large"
                                        className="ml-1 hidden sm:inline" // Only show icon on larger screens
                                    />
                                </Button>
                            )}
                            {isEditable && (
                                <Button
                                    onClick={changeFloorPlan}
                                    className="flex items-center bg-orange-900 text-white px-4 py-2 rounded-lg hover:bg-orange-950 transition duration-300 ease-in-out text-sm md:text-base"
                                >
                                    Upload New Floor Plan
                                </Button>
                            )}
                        </div>
                    </div>

                    <div
                        className={cn("floor-plan-container", "cursor-default")}
                        ref={imageContainerRef}
                    >
                        <img
                            src={
                                uploadedImageUrl
                                    ? uploadedImageUrl
                                    : `${baseUrl}/storage/${currentFloorPlan.floor_plan_map}`
                            }
                            alt={`${currentFloorPlan.building} - Floor ${currentFloorPlan.floor}`}
                            className="floor-plan-image h-full w-full"
                        />
                        <div
                            id="editing-area"
                            className="editing-area absolute top-0 left-0 w-full h-full"
                        >
                            Editing Area
                        </div>
                        <div
                            className="absolute top-0 left-0 w-full h-full"
                            id="editing-area-2"
                        >
                            {rectangles.map((rect) => (
                                <TooltipProvider key={`${rect.id}`}>
                                    <div
                                        key={rect.id}
                                        id={`rectangle-${rect.id}`}
                                        data-id={rect.id}
                                        className={`absolute cursor-pointer flex items-center justify-center text-black text-sm border-2 rounded-lg touch-none transition duration-300 ${
                                            rect.is_active === 0
                                                ? "rect_is_not_active border-red-500 bg-red-100 hover:border-red-700 hover:bg-red-300"
                                                : "absolute border cursor-pointer"
                                        }`}
                                        style={{
                                            width: `${
                                                (rect.width / 1280) * 100
                                            }%`,
                                            height: `${
                                                (rect.height / 720) * 100
                                            }%`,
                                            left: `calc(50% + ${
                                                (rect.x / 1280) * 100
                                            }% - ${(rect.width / 1280) * 50}%)`,
                                            top: `calc(${
                                                (rect.y / 720) * 100
                                            }% + 1vh)`,
                                            backgroundColor: rect.color,
                                            borderColor: rect.borderColor,
                                            zIndex:
                                                selectedRectangleId ===
                                                    rect.id && !isDialogOpen
                                                    ? 100
                                                    : 0,
                                        }}
                                        onClick={() =>
                                            handleRectangleClick(rect.id)
                                        }
                                    >
                                        {/* Menu bar */}
                                        {isEditable &&
                                            selectedRectangleId === rect.id && (
                                                <div
                                                    className="menu-bar"
                                                    style={{
                                                        top: "-32px",
                                                        left: "50%",
                                                        transform:
                                                            "translateX(-50%)",
                                                        zIndex: 101,
                                                    }}
                                                >
                                                    <Tooltip
                                                        key={`lock_${rect.id}`}
                                                    >
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    toggleLock(
                                                                        rect.id
                                                                    )
                                                                }
                                                            >
                                                                {rect.locked ? (
                                                                    <MdLock fontSize="large" />
                                                                ) : (
                                                                    <MdLockOpen fontSize="large" />
                                                                )}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {rect.locked
                                                                    ? "Unlock"
                                                                    : "Lock"}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip
                                                        key={`edit_${rect.id}`}
                                                    >
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        rect.id
                                                                    )
                                                                }
                                                            >
                                                                <MdEdit fontSize="large" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip
                                                        key={`remove_${rect.id}`}
                                                    >
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    removeRectangle(
                                                                        rect.id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete fontSize="large" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip
                                                        key={`color_${rect.id}`}
                                                    >
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    setShowColorOptions(
                                                                        !showColorOptions
                                                                    )
                                                                }
                                                            >
                                                                <MdColorLens fontSize="large" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Color Options</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    {showColorOptions && (
                                                        <div className="color-options">
                                                            <Tooltip
                                                                key={`color_orange_${rect.id}`}
                                                            >
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            changeRectangleColor(
                                                                                rect.id,
                                                                                "rgba(249, 155, 83)",
                                                                                "#F97316"
                                                                            )
                                                                        }
                                                                    >
                                                                        <MdColorLens
                                                                            fontSize="large"
                                                                            style={{
                                                                                color: "rgba(249, 155, 83)",
                                                                                borderColor:
                                                                                    "#F97316",
                                                                            }}
                                                                        />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        Orange
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip
                                                                key={`color_blue_${rect.id}`}
                                                            >
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            changeRectangleColor(
                                                                                rect.id,
                                                                                "rgba(148, 219, 253)",
                                                                                "#1576c1"
                                                                            )
                                                                        }
                                                                    >
                                                                        <MdColorLens
                                                                            fontSize="large"
                                                                            style={{
                                                                                color: "rgba(148, 219, 253)",
                                                                                borderColor:
                                                                                    "#1576c1",
                                                                            }}
                                                                        />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Blue</p>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip
                                                                key={`color_green_${rect.id}`}
                                                            >
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            changeRectangleColor(
                                                                                rect.id,
                                                                                "rgba(38, 217, 143)",
                                                                                "#10B981"
                                                                            )
                                                                        }
                                                                    >
                                                                        <MdColorLens
                                                                            fontSize="large"
                                                                            style={{
                                                                                color: "rgba(38, 217, 143)",
                                                                                borderColor:
                                                                                    "#10B981",
                                                                            }}
                                                                        />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Green</p>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip
                                                                key={`color_gray_${rect.id}`}
                                                            >
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            changeRectangleColor(
                                                                                rect.id,
                                                                                "rgba(211, 211, 211)",
                                                                                "#808080"
                                                                            )
                                                                        }
                                                                    >
                                                                        <MdColorLens
                                                                            fontSize="large"
                                                                            style={{
                                                                                color: "rgba(211, 211, 211)",
                                                                                borderColor:
                                                                                    "#808080",
                                                                            }}
                                                                        />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Gray</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        <div className="p-2 text-center">
                                            <p
                                                className="font-medium text-center"
                                                style={{
                                                    fontSize: `${Math.max(
                                                        (rect.height / 720) *
                                                            16,
                                                        16
                                                    )}px`,
                                                }}
                                            >
                                                {rect.room_number}
                                            </p>
                                        </div>
                                    </div>
                                </TooltipProvider>
                            ))}
                        </div>

                        {currentEditRectangle && (
                            <EditRoomDialog
                                isOpen={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                                rectangle={currentEditRectangle}
                                onSave={handleSaveRectangle}
                                academic_programs={academic_programs}
                                userTheme={userTheme}
                                color={currentEditRectangle.color}
                            />
                        )}

                        <UploadFloorPlanDialog
                            currentFloorPlan={currentFloorPlan?.id}
                            isOpen={isUploadDialogOpen}
                            onClose={() => setIsUploadDialogOpen(false)}
                            floor={currentFloorPlan.floor}
                            building={currentFloorPlan.building}
                            userTheme={userTheme}
                            onUpload={handleUploadFloorPlan}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
