import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { RoomManagementProps } from "@/types/my_types";
import { toast, Toaster } from "sonner";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { toast_error } from "@/types/my_types/mytoast";
import { SelectFloor } from "@/Components/CustomizedComponents/room_management/select_floor";
import { SelectBuilding } from "@/Components/CustomizedComponents/room_management/select_building";
import axios from "axios";
import { FaMapMarkedAlt } from "react-icons/fa";
import { AddFloorPlan } from "@/Components/CustomizedComponents/room_management/add_floor_plan";
import useTour from "@/Composables/useTour";
import { Upload } from "lucide-react";

export default function RoomAddFloorPlan({
    auth,
    breadcrumbs,
    floors,
    buildings,
    academic_programs,
}: RoomManagementProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    useTour({
        user: auth.user,
        name: "showAddFloorPlanTour",
        steps: () => [
            {
                title: "🏗️ Add a New Floor Plan",
                intro: `Easily create a new <b>floor plan</b> to ensure efficient space management for classrooms, offices, and other facilities. <br><br>  
                        Follow these steps to properly define and organize your floor layouts.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `🏢 <b>Select a Building</b><br>  
                        Choose the building where you want to upload a floor plan. This helps in keeping spaces well-organized and easy to manage.`,
                element: document.querySelector("#building_id") as HTMLElement,
                tooltipClass: "steps-tool-tip"
            },
            {
                intro: `📍 <b>Select a Floor</b><br>  
                        Pick the floor that corresponds to your floor plan to ensure proper association with the right building section.`,
                element: document.querySelector("#floor_id") as HTMLElement,
                tooltipClass: "steps-tool-tip"
            },
            {
                intro: `🖼️ <b>Upload Floor Plan Image</b><br>  
                        Drag and drop the image into the upload area, or use the recommended resolution of <b>1280x720</b> for the best clarity.`,
                element: document.querySelector("#file-upload-area") as HTMLElement,
                tooltipClass: "steps-tool-tip"
            },
            {
                intro: `📂 <b>Browse Image</b><br>  
                        Alternatively, click the <b>'Browse Image'</b> button to select a file from your device.`,
                element: document.querySelector("#browse-image") as HTMLElement,
                tooltipClass: "steps-tool-tip"
            },
            {
                intro: `✅ <b>Proceed</b><br>  
                        Once the floor plan image is uploaded, click the <b>'Continue'</b> button to finalize the process.`,
                element: document.querySelector("#continue-button") as HTMLElement,
                tooltipClass: "steps-tool-tip"
            },
            {
                title: "🚀 Try it Yourself!",
                intro: `<b>Now it's your turn!</b><br><br>  
                        <i>Select a building</i>, <i>choose a floor</i>, <i>upload an image</i> with a resolution of <b>1280x720</b>, and click continue. <br><br>  
                        <b>🔹 Note:</b> If a floor plan already exists for the selected building and floor, you cannot add another one to avoid duplication. Instead, visit the <b>'Edit Floor Plan'</b> section to make modifications.`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
        
    });

    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [building, setBuilding] = useState<string | null>(null);
    const [floor, setFloor] = useState<string | null>(null);

    const isImage = (file: File) => file.type.startsWith("image/");

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [file]);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        if (formSubmitted && !editMode) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (formSubmitted && !editMode) return;
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (!isImage(droppedFile)) {
                toast_error({
                    message: "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                    userTheme,
                });
                return;
            }
            setFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        if (!isImage(selectedFile)) {
            toast_error({
                message: "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                userTheme,
            });
            e.target.value = "";
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            toast_error({
                message: "File is too large. Please choose a file smaller than 10MB.",
                userTheme,
            });
            e.target.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
        setFile(selectedFile);
        e.target.value = "";
    };

    //
    const handleSave = async () => {
        if (building && floor && preview) {
            try {
                const response = await axios.post(
                    route("check.building_floor"),
                    {
                        building: building,
                        floor: floor,
                    }
                );

                if (response.data.exists) {
                    toast_error({
                        message:
                            "A floor plan for this building and floor already exists.",
                        userTheme: userTheme,
                    });
                } else {
                    setFormSubmitted(true);
                    setEditMode(false);
                }
            } catch (error) {
                toast_error({
                    message: "An error occurred while checking the floor plan.",
                    userTheme: userTheme,
                });
            }
        } else {
            toast_error({
                message: "Please fill in all required fields.",
                userTheme: userTheme,
            });
        }
    };

    const handleEdit = () => {
        toast("Are you sure you want to edit?", {
            description: "This will reset all your current changes.",
            action: {
                label: "Confirm",
                onClick: () => {
                    setEditMode(true);
                    setFormSubmitted(false);
                    // resetFormFields();
                },
            },
        });
    };

    //reset form fields after successful adding of floor plan
    const resetFormFields = () => {
        setBuilding(null);
        setFloor(null);
        setFile(null);
        setPreview(null);
        setFormSubmitted(false);
        setEditMode(false);
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    };

    const hasPreview = formSubmitted && preview && floor && building;

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl font-semibold leading-tight justify-center items-center flex bg-muted/50 p-4 rounded-lg mb-3">
                    Add Floor Plan
                    <FaMapMarkedAlt fontSize="x-large" className="ml-2" />
                </h2>
            }
        >
            <Head title="Add Floor Plan" />

            <Toaster position="top-right" />

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <div
                    className={`flex ${
                        !hasPreview ? "justify-center" : "grid grid-flow-col"
                    }`}
                >
                    <div
                        className={`ml-4 mr-4 ${!hasPreview ? "w-64" : ""}`}
                        style={!hasPreview ? { width: "500px" } : {}}
                    >
                        {/* Select Building */}
                        <div className="mb-5">
                            <Label htmlFor="building_id" className="block mb-2">
                                Select Building
                            </Label>
                            <SelectBuilding
                                id={"building_id"}
                                building={buildings}
                                value={building || ""}
                                onChange={(value) => setBuilding(value)}
                                disabled={formSubmitted && !editMode}
                            />
                        </div>

                        {/* Select Floor */}
                        <div className="mb-5">
                            <Label htmlFor="floor_id" className="block mb-2">
                                Select Floor
                            </Label>
                            <SelectFloor
                                id={"floor_id"}
                                floor={floors}
                                value={floor || ""}
                                onChange={(value) => setFloor(value)}
                                disabled={formSubmitted && !editMode}
                            />
                        </div>

                        {/* Upload Floor Plan */}
                        <h2 className="text-md font-semibold flex justify-center bg-muted/50 p-2 rounded-lg mb-2">
                            Upload a Floor Plan
                        </h2>
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed p-4 rounded-xl ${
                                dragActive
                                    ? "border-blue-400"
                                    : "border-gray-300"
                            } flex flex-col items-center justify-center`}
                            id="file-upload-area"
                        >
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: "none" }}
                                onChange={handleChange}
                                accept="image/*"
                                disabled={formSubmitted && !editMode}
                            />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <p
                                        className="truncate"
                                        style={{ maxWidth: "150px" }}
                                    >
                                        {file.name}
                                    </p>
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mt-4 max-h-32 max-w-32"
                                        />
                                    )}
                                    <Button
                                        onClick={removeFile}
                                        className={`mt-2 ${
                                            formSubmitted && !editMode
                                                ? "hidden"
                                                : ""
                                        }`}
                                        variant="destructive"
                                        disabled={formSubmitted && !editMode}
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
                                        id="browse-image"
                                        className="mt-2"
                                        variant="outline"
                                        onClick={() =>
                                            document
                                                .getElementById("file-upload")
                                                ?.click()
                                        }
                                        disabled={formSubmitted && !editMode}
                                    >
                                        Browse Image
                                    </Button>
                                </div>
                            )}
                        </div>

                        <p className="text-xs font-thin flex justify-center mt-1">
                            Recommended Resolution: 1280 x 720
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end">
                            <Button
                                id="continue-button"
                                onClick={handleSave}
                                disabled={formSubmitted && !editMode}
                            >
                                Continue
                            </Button>
                            {formSubmitted && (
                                <Button
                                    onClick={handleEdit}
                                    className="ml-2"
                                    variant="destructive"
                                >
                                    Edit
                                </Button>
                            )}
                        </div>

                        {file && (
                            <div className="mt-10 left-4 p-2 rounded-lg shadow-md">
                                <p className="font-medium">Legend:</p>
                                <div className="flex items-center mt-2">
                                    <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                                    <p>Faculty Room</p>
                                </div>
                                <div className="flex items-center mt-2">
                                    <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                                    <p>Lecture Room</p>
                                </div>
                                <div className="flex items-center mt-2">
                                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                                    <p>Laboratory Room</p>
                                </div>
                                <div className="flex items-center mt-2">
                                    <div className="w-4 h-4 bg-gray-500 mr-2"></div>
                                    <p>Custom Room (User-Defined)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Large Preview Section */}
                    {hasPreview && (
                        <div className="mt-4 flex flex-col items-center">
                            <h3 className="text-xl font-semibold flex justify-center bg-muted/50 p-2 rounded-lg mb-2 w-1/2 border-b-2 border-blue-400">
                                Floor Plan
                            </h3>
                            {file && (
                                <AddFloorPlan
                                    preview={preview}
                                    file={file}
                                    building={building}
                                    floor={floor}
                                    academic_programs={academic_programs}
                                    resetFormFields={resetFormFields}
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
