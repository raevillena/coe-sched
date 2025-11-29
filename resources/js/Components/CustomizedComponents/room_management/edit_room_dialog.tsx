import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { AcademicProgram, Rectangle } from "@/types/my_types";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Checkbox } from "@/Components/ui/checkbox";
import { toast_error } from "@/types/my_types/mytoast";
import axios from "axios";

const createImagePreview = (image: File | Blob | string | null): string => {
    const baseUrl = import.meta.env.VITE_APP_URL;
    if (image instanceof Blob) {
        return URL.createObjectURL(image);
    }

    return typeof image === "string" ? `${baseUrl}/storage/${image}` : "";
};

// Convert department_priority to array if it's a string
const parseDepartmentPriority = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
        // Try to parse as JSON if it's a stringified array
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
    } catch (e) {
        // If parsing fails, it's a single string
        return [value];
    }
};

interface EditRoomDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    rectangle: Rectangle;
    onSave: (updatedRectangle: Rectangle) => void;
    color: string;
    academic_programs: {
        data: AcademicProgram[];
    };
    userTheme: "dark" | "light" | "system";
}

export default function EditRoomDialog({
    isOpen,
    onOpenChange,
    rectangle,
    onSave,
    color,
    academic_programs,
    userTheme,
}: EditRoomDialogProps) {
    const [roomNumber, setRoomNumber] = useState<string>(rectangle.room_number);
    const [typeOfRoom, setTypeOfRoom] = useState<string>(rectangle.room_type);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
        parseDepartmentPriority(rectangle.department_priority)
    );
    const [description, setDescription] = useState<string>(
        rectangle.description
    );
    const [image, setImage] = useState<File | null>(
        rectangle.room_image instanceof File ? rectangle.room_image : null
    );
    const [imagePreview, setImagePreview] = useState<string>(
        createImagePreview(rectangle.room_image)
    );
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const programcodesArray = Array.isArray(academic_programs)
        ? academic_programs
        : academic_programs.data || [];

    useEffect(() => {
        setRoomNumber(rectangle.room_number);
        setTypeOfRoom(rectangle.room_type);
        setSelectedDepartments(
            parseDepartmentPriority(rectangle.department_priority)
        );
        setDescription(rectangle.description);
        setImage(
            rectangle.room_image instanceof File ? rectangle.room_image : null
        );
        setImagePreview(createImagePreview(rectangle.room_image));
    }, [rectangle]);

    useEffect(() => {
        if (color === "rgba(148, 219, 253)") {
            setTypeOfRoom("Lecture Room");
        } else if (color === "rgba(38, 217, 143)") {
            setTypeOfRoom("Laboratory Room");
        } else if (color === "rgba(249, 155, 83)") {
            setTypeOfRoom("Faculty Room");
        }
    }, [color]);

    const toggleDepartment = (programCode: string) => {
        setSelectedDepartments((prev) => {
            if (prev.includes(programCode)) {
                return prev.filter((code) => code !== programCode);
            } else {
                return [...prev, programCode];
            }
        });
    };

    const isImage = (file: File) => file.type.startsWith("image/");
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];

            if (!isImage(selectedImage)) {
                toast_error({
                    message:
                        "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                    userTheme: userTheme,
                });
                setIsButtonDisabled(true);
                e.target.value = "";
                return;
            }

            if (selectedImage.size <= 5 * 1024 * 1024) {
                setImage(selectedImage);

                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(selectedImage);
                setIsButtonDisabled(false);
            } else {
                toast_error({
                    message:
                        "File is too large. Please choose a file smaller than 5MB.",
                    userTheme: userTheme,
                });
                setIsButtonDisabled(true);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("room_number", roomNumber);
        formData.append("room_type", typeOfRoom);
        formData.append(
            "department_priority",
            JSON.stringify(selectedDepartments)
        );
        formData.append("description", description);
        if (image) {
            formData.append("room_image", image);
        }

        try {
            const updatedRectangle: Rectangle = {
                ...rectangle,
                room_number: roomNumber,
                room_type: typeOfRoom,
                department_priority: selectedDepartments,
                description: description,
                room_image: image ? image : rectangle.room_image,
            };

            // Call onSave callback with updated data
            onSave(updatedRectangle);
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating room:", error);
            toast_error({
                message: "An error occurred while saving changes",
                userTheme: userTheme,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button style={{ display: "none" }}>Edit Room</button>
            </DialogTrigger>
            <DialogContent className="max-w-[95%] sm:max-w-[600px] w-full px-6">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg md:text-xl">
                        Edit Room Details
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        Modify the details of the selected room.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="hidden"
                        name="_token"
                        value={
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || ""
                        }
                    />
                    <div className="grid gap-4 py-4">
                        {/* Room Number */}
                        <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-4">
                            <Label
                                htmlFor="room_number"
                                className="text-left md:text-right"
                            >
                                Room Number
                            </Label>
                            <Input
                                type="text"
                                id="room_number"
                                name="room_number"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                className="w-full col-span-3"
                                required
                            />
                        </div>
                        {/* Type of Room */}
                        <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-4">
                            <Label
                                htmlFor="type_of_room"
                                className="text-left md:text-right"
                            >
                                Type of Room
                            </Label>
                            <Input
                                type="text"
                                id="type_of_room"
                                name="room_type"
                                value={typeOfRoom}
                                onChange={(e) => setTypeOfRoom(e.target.value)}
                                className="w-full col-span-3"
                                placeholder="Lecture Room, Laboratory, etc."
                            />
                        </div>
                        {/* Department Priority */}
                        <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-4">
                            <Label
                                htmlFor="department_priority"
                                className="pt-2 text-left md:text-right"
                            >
                                Department Priority
                            </Label>
                            <div className="col-span-3 p-2 space-y-2 overflow-y-auto border rounded-md max-h-48">
                                {/* Add None option first */}
                                {/* <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dept-none"
                                        name="department_priority[]"
                                        checked={selectedDepartments.includes(
                                            "none"
                                        )}
                                        onCheckedChange={() =>
                                            toggleDepartment("none")
                                        }
                                    />
                                    <Label
                                        htmlFor="dept-none"
                                        className="text-sm cursor-pointer"
                                    >
                                        None
                                    </Label>
                                </div> */}
                                {programcodesArray.length > 0 ? (
                                    programcodesArray
                                        .slice()
                                        .sort((a, b) =>
                                            a.program_name.localeCompare(
                                                b.program_name
                                            )
                                        )
                                        .map((program) => (
                                            <div
                                                key={program.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`dept-${program.program_code}`}
                                                    name="department_priority[]"
                                                    checked={selectedDepartments.includes(
                                                        program.program_code
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleDepartment(
                                                            program.program_code
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`dept-${program.program_code}`}
                                                    className="text-sm cursor-pointer"
                                                >
                                                    <Label
                                                        htmlFor={`dept-${program.program_code}`}
                                                        className="text-sm cursor-pointer"
                                                    >
                                                        {`Department of ${program.program_name.replace(
                                                            "Bachelor of Science in ",
                                                            ""
                                                        )}`}
                                                    </Label>
                                                </Label>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No departments available
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Description */}
                        <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-4">
                            <Label
                                htmlFor="description"
                                className="text-left md:text-right"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full col-span-3"
                                rows={4}
                            />
                        </div>
                        {/* Image */}
                        <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-4">
                            <Label
                                htmlFor="image"
                                className="text-left md:text-right"
                            >
                                Image
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    type="file"
                                    id="image"
                                    name="room_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mb-2"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Room Preview"
                                        className="object-cover w-20 h-20 mt-2 rounded sm:h-32 sm:w-32"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isButtonDisabled}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
