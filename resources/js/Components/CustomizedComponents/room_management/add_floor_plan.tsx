import React, { useState, useEffect, useRef } from "react";
import interact from "interactjs";
import {
    MdAddBox,
    MdLock,
    MdLockOpen,
    MdDelete,
    MdEdit,
    MdColorLens,
} from "react-icons/md";
import "@/Components/CustomizedComponents/room_management/floor_plan.css";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { AcademicProgram, Rectangle } from "@/types/my_types";
import toast from "react-hot-toast";
import { toast_style_promise } from "@/types/my_types/mytoast";
import AddRoomDialog from "@/Components/CustomizedComponents/room_management/add_room_dialog";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface FloorPlanProps {
    preview: string;
    file: File;
    building: string;
    floor: string;
    resetFormFields: () => void;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    academic_programs: {
        data: AcademicProgram[];
    };
}

export function AddFloorPlan({
    preview,
    building,
    floor,
    file,
    resetFormFields,
    userTheme,
    systemTheme,
    academic_programs,
}: FloorPlanProps) {
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [selectedRectangleId, setSelectedRectangleId] = useState<
        number | null
    >(null);
    const [copiedRectangle, setCopiedRectangle] = useState<Rectangle | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [currentEditRectangle, setCurrentEditRectangle] =
        useState<Rectangle | null>(null);
    const [showColorOptions, setShowColorOptions] = useState<boolean>(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        rectangles.forEach((rect) => {
            const interactable = interact(`#rectangle-${rect.id}`);

            if (!rect.locked) {
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
                            //added for snapping to grid
                            // interact.modifiers.snap({
                            //     targets: [
                            //         interact.snappers.grid({ x: 5, y: 5 }),
                            //     ],
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
    }, [rectangles, imageContainerRef]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Delete" && selectedRectangleId !== null) {
                removeRectangle(selectedRectangleId);
            } else if (
                event.ctrlKey &&
                event.key === "c" &&
                selectedRectangleId !== null
            ) {
                copyRectangle(selectedRectangleId);
            } else if (
                event.ctrlKey &&
                event.key === "v" &&
                copiedRectangle !== null
            ) {
                pasteRectangle();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedRectangleId, copiedRectangle]);

    const dragMoveListener = (event: any) => {
        const target = event.target;

        const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);

        const id = parseInt(target.getAttribute("data-id"));

        setRectangles((prevRectangles) =>
            prevRectangles.map((rect) =>
                rect.id === id ? { ...rect, x, y } : rect
            )
        );
    };

    const resizeListener = (event: any) => {
        const target = event.target;
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        let y = parseFloat(target.getAttribute("data-y")) || 0;

        target.style.width = `${event.rect.width}px`;
        target.style.height = `${event.rect.height}px`;

        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);

        const id = parseInt(target.getAttribute("data-id"));
        setRectangles((prevRectangles) =>
            prevRectangles.map((rect) =>
                rect.id === id
                    ? {
                          ...rect,
                          x,
                          y,
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
            color: "rgba(148, 219, 253)",
            borderColor: "#1576c1",
            updated_at: currentTime,
            created_at: currentTime,
        };

        setRectangles([...rectangles, newRect]);
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
                rect.id === updatedRect.id ? { ...updatedRect, color, borderColor } : rect
            )
        );
        // toast.success("Room details updated!");
    };

    const saveFloorPlan = () => {
        const updateRectangles = rectangles.map((rect) => ({
            ...rect,
            locked: true,
        }));
        setRectangles(updateRectangles);

        const formData = new FormData();
        formData.append("building", building);
        formData.append("floor", floor);
        formData.append("floor_plan_map", file);

        // append rectangles data without room_image
        const rectanglesData = updateRectangles.map(
            ({ room_image, ...rest }) => rest
        );
        formData.append("rectangles", JSON.stringify(rectanglesData));

        // append each room_image file with a unique key
        updateRectangles.forEach((rect, index) => {
            if (rect.room_image) {
                formData.append(`room_image_${index}`, rect.room_image);
            }
        });

        toast
            .promise(
                axios.post(route("floor_plan.store"), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }),
                {
                    loading: "Adding floor plan...",
                    success: () => (
                        <span>New floor plan added successfully!</span>
                    ),
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add floor plan. Please try again later.";
                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                resetFormFields();
            })
            .catch((error) => {
                // revert rectangles lock state if saving fails
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
        <div className="relative">
            {/* add rectangle button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={addRectangle}
                    className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition duration-300 ease-in-out"
                >
                    <p className="text-md">Add Room</p>
                    <MdAddBox fontSize="x-large" className="ml-1" />
                </button>
            </div>

            {/* image container */}
            <div
                id="imageContainer"
                className="image-container mt-2 relative"
                ref={imageContainerRef}
            >
                <img
                    src={preview}
                    alt="Floor Plan"
                    className="image max-w-[1280px]"
                />
                <div
                    id="editing-area"
                    className="editing-area absolute top-0 left-0 w-full h-full"
                >
                    Editing Area
                </div>

                {rectangles.map((rect) => (
                    <React.Fragment key={rect.id}>
                        <div
                            key={rect.id}
                            id={`rectangle-${rect.id}`}
                            data-id={rect.id}
                            className="draggable absolute border-2 cursor-pointer"
                            data-x={rect.x}
                            data-y={rect.y}
                            style={{
                                width: `${rect.width}px`,
                                height: `${rect.height}px`,
                                transform: `translate(${rect.x}px, ${rect.y}px)`,
                                backgroundColor: rect.color,
                                borderColor: rect.borderColor,
                            }}
                            onClick={() => handleRectangleClick(rect.id)}
                        >
                            <div className="p-2 text-center">
                                <p className="text-md font-medium">
                                    {rect.room_number}
                                </p>
                                {/* <p className="text-sm">{rect.room_type}</p> */}
                            </div>
                        </div>

                        {/* menu bar */}
                        {selectedRectangleId === rect.id && (
                            <TooltipProvider>
                                <div
                                    className="menu-bar"
                                    style={{
                                        transform: `translate(${rect.x}px, ${rect.y}px)`,
                                    }}
                                >
                                    <Tooltip key={`lock_${rect.id}`}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() =>
                                                    toggleLock(rect.id)
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

                                    <Tooltip key={`edit_${rect.id}`}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(rect.id)
                                                }
                                            >
                                                <MdEdit fontSize="large" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip key={`remove_${rect.id}`}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() =>
                                                    removeRectangle(rect.id)
                                                }
                                            >
                                                <MdDelete fontSize="large" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip key={`color_${rect.id}`}>
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
                                                <TooltipTrigger asChild>
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
                                                    <p>Orange</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip
                                                key={`color_blue_${rect.id}`}
                                            >
                                                <TooltipTrigger asChild>
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
                                                <TooltipTrigger asChild>
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
                                                <TooltipTrigger asChild>
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
                            </TooltipProvider>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex justify-end mt-3">
                <Button
                    onClick={saveFloorPlan}
                    className="save-floor-plan-button"
                >
                    Save Floor Plan
                </Button>
            </div>

            {currentEditRectangle && (
                <AddRoomDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    rectangle={currentEditRectangle}
                    onSave={handleSaveRectangle}
                    academic_programs={academic_programs}
                    userTheme={userTheme}
                    color={currentEditRectangle.color}
                />
            )}
        </div>
    );
}
