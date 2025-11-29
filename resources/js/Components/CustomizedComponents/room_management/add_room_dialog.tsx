import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
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
import { toast_error } from "@/types/my_types/mytoast";

// Helper function to parse department priority array
const parseDepartmentPriority = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
        // Try to parse as JSON if it's a stringified array
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
    } catch (e) {
        // If parsing fails, it's a single string
        return value ? [value] : [];
    }
};

interface AddRoomDialogProps {
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

export default function AddRoomDialog({
    isOpen,
    onOpenChange,
    rectangle,
    onSave,
    color,
    academic_programs,
    userTheme,
}: AddRoomDialogProps) {
    const [roomNumber, setRoomNumber] = useState<string>(rectangle.room_number);
    const [typeOfRoom, setTypeOfRoom] = useState<string>(rectangle.room_type);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
        parseDepartmentPriority(rectangle.department_priority)
    );
    const [description, setDescription] = useState<string>(
        rectangle.description
    );
    const [image, setImage] = useState<File | null>(rectangle.room_image);
    const [imagePreview, setImagePreview] = useState<string>(
        rectangle.room_image ? URL.createObjectURL(rectangle.room_image) : ""
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
        setImage(rectangle.room_image);
        setImagePreview(
            rectangle.room_image
                ? URL.createObjectURL(rectangle.room_image)
                : ""
        );
    }, [rectangle]);

    useEffect(() => {
        if (color === "rgba(148, 219, 253)") {
            setTypeOfRoom("Lecture Room");
        } else if (color === "rgba(38, 217, 143)") {
            setTypeOfRoom("Laboratory Room");
        } else if (color === "rgba(249, 155, 83)") {
            setTypeOfRoom("Faculty Room");
        } else {
            setTypeOfRoom("");
        }
    }, [color]);

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

    const toggleDepartment = (programCode: string) => {
        setSelectedDepartments((prev) => {
            if (prev.includes(programCode)) {
                return prev.filter((code) => code !== programCode);
            } else {
                return [...prev, programCode];
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedRectangle: Rectangle = {
            ...rectangle,
            room_number: roomNumber,
            room_type: typeOfRoom,
            department_priority: selectedDepartments,
            description: description,
            room_image: image,
        };

        onSave(updatedRectangle);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button style={{ display: "none" }}>Edit Room</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Room Details</DialogTitle>
                    <DialogDescription>
                        Modify the details of the selected room.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Room Number */}
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="room_number" className="text-right">
                                Room Number
                            </Label>
                            <Input
                                type="text"
                                id="room_number"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>

                        {/* Type of Room */}
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label
                                htmlFor="type_of_room"
                                className="text-right"
                            >
                                Type of Room
                            </Label>
                            <Input
                                type="text"
                                id="type_of_room"
                                value={typeOfRoom}
                                onChange={(e) => setTypeOfRoom(e.target.value)}
                                className="col-span-3"
                                placeholder="Lecture Room, Laboratory Room, etc."
                                // required
                            />
                        </div>

                        {/* Department Priority */}
                        <div className="grid items-start grid-cols-4 gap-4">
                            <Label
                                htmlFor="department_priority"
                                className="text-right"
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
                                {programcodesArray
                                    .slice()
                                    .sort((a, b) =>
                                        a.program_name.localeCompare(
                                            b.program_name
                                        )
                                    )
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`department-${item.id}`}
                                                checked={selectedDepartments.includes(
                                                    item.program_code
                                                )}
                                                onCheckedChange={() =>
                                                    toggleDepartment(
                                                        item.program_code
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`department-${item.id}`}
                                            >
                                                {`Department of ${item.program_name.replace(
                                                    "Bachelor of Science in ",
                                                    ""
                                                )}`}
                                            </Label>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid items-start grid-cols-4 gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                rows={4}
                            />
                        </div>

                        {/* Image */}
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="image" className="text-right">
                                Image
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mb-2"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Room"
                                        className="object-cover w-32 h-32 mt-2 rounded"
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
