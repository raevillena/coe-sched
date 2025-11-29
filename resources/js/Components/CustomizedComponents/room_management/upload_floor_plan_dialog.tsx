import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { toast_error } from "@/types/my_types/mytoast";
import { FloorPlan } from "@/types/my_types";

interface UploadFloorPlanDialogProps {
    isOpen: boolean;
    onClose: () => void;
    building: string;
    floor: string;
    currentFloorPlan: number;
    userTheme: "dark" | "light" | "system";
    onUpload: (newFloorPlan: FloorPlan, file: File | null) => void;
}

export function UploadFloorPlanDialog({
    isOpen,
    onClose,
    building,
    floor,
    userTheme,
    onUpload,
    currentFloorPlan,
}: UploadFloorPlanDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    
    const isImage = (file: File) => file.type.startsWith("image/");

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }, [file]);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (!isImage(selectedFile)) {
                toast_error({
                    message: "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                    userTheme: userTheme,
                });
                return;
            }
            if (selectedFile.size <= 10 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                    setFile(selectedFile);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                toast_error({
                    message:
                        "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                    userTheme: userTheme,
                });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!isImage(selectedFile)) {
            toast_error({
                message: "Unsupported file type. Only image files are accepted.",
                userTheme: userTheme,
            });
            e.target.value = "";
            return;
        }

        if (selectedFile.size <= 10 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(selectedFile);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            toast_error({
                message:
                    "File is too large. Please choose a file smaller than 10MB.",
                userTheme: userTheme,
            });
        }
        e.target.value = "";
    };

    const handleUpload = () => {
        if (file) {
            const newFloorPlan: FloorPlan = {
                id: currentFloorPlan,
                is_active: 1,
                building: building,
                floor: floor,
                floor_plan_map: file,
                rectangles: [],
            };
            onUpload(newFloorPlan, file);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {building} - {floor}
                    </DialogTitle>
                    <DialogDescription>
                        Click upload when you're done.
                    </DialogDescription>
                </DialogHeader>

                <p className="text-xs font-thin flex justify-end">
                    Recommended Resolution: 1280 x 720
                </p>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-4 rounded-xl ${
                        dragActive ? "border-blue-400" : "border-gray-300"
                    } flex flex-col items-center justify-center`}
                >
                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: "none" }}
                        onChange={handleChange}
                        accept="image/*"
                    />
                    {file ? (
                        <div className="flex flex-col items-center">
                            <p>Uploaded Image</p>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-4 max-h-24 max-w-24"
                                />
                            )}
                            <Button
                                onClick={removeFile}
                                className="mt-2"
                                variant="destructive"
                            >
                                Remove Image
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-500 bg-opacity-50 p-4 rounded-full">
                                <Upload size={28} strokeWidth={2.5} />
                            </div>
                            <span className="mt-2">
                                Drag & Drop to Upload Image
                            </span>
                            <span className="mt-2">OR</span>
                            <Button
                                className="mt-2"
                                variant="outline"
                                onClick={() =>
                                    document
                                        .getElementById("file-upload")
                                        ?.click()
                                }
                            >
                                Browse Image
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button disabled={!file} onClick={handleUpload}>
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}