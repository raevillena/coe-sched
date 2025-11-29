import { Button } from "@/Components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";
import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { router, useForm } from "@inertiajs/react";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

interface UpdateDeptLogoProps {
    selectedDepartment: {
        id: number;
        name: string;
        program_code: string;
        logo: File | null;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
}
export function UpdateDeptLogoDrawer({
    selectedDepartment,
    userTheme,
    systemTheme,
}: UpdateDeptLogoProps) {
    const baseUrl = import.meta.env.VITE_APP_URL;

    const { data, setData } = useForm({
        logo: null as File | null,
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const isImage = (file: File) => file.type.startsWith("image/");

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setIsButtonDisabled(true);
            return;
        }

        if (!isImage(file)) {
            toast_error({
                message: "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                userTheme: userTheme,
            });
            setIsButtonDisabled(true);
            event.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast_error({
                message: "File is too large. Please choose a file smaller than 10MB.",
                userTheme: userTheme,
            });
            setIsButtonDisabled(true);
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const imgElement = document.getElementById(
                "logo_preview"
            ) as HTMLImageElement;
            if (imgElement) imgElement.src = reader.result as string;
        };

        setIsButtonDisabled(false);
        reader.readAsDataURL(file);
        setData("logo", file);
    };

    const handleCancel = () => {
        const imgElement = document.getElementById(
            "logo_preview"
        ) as HTMLImageElement;

        if (imgElement && selectedDepartment?.logo) {
            imgElement.src = `${baseUrl}/storage/${selectedDepartment.logo}`;
        } else if (imgElement) {
            imgElement.src = "";
        }

        const fileInput = document.getElementById("logo") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        setData("logo", null);
        setIsButtonDisabled(true);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsButtonDisabled(true);

        const formData = new FormData();
        formData.append("logo", data.logo as File);

        toast
            .promise(
                axios.post(
                    route("departments.update_logo", {
                        department: selectedDepartment?.id,
                    }),
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                ),
                {
                    loading: "Updating logo...",
                    success: () => <span>Logo updated successfully!</span>,
                    error: () => (
                        <span>
                            Could not update logo. Please try again later.
                        </span>
                    ),
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then((response) => {
                router.reload();
            })
            .catch((error) => {
                toast_error({
                    message: "Error updating logo.",
                    userTheme: userTheme,
                });
            });
    };

    //remove image preview if changing department
    useEffect(() => {
        const fileInput = document.getElementById("logo") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        setData("logo", null);
        setIsButtonDisabled(true);

        const imgElement = document.getElementById(
            "logo_preview"
        ) as HTMLImageElement;
        if (imgElement) {
            if (selectedDepartment?.logo) {
                imgElement.src = `${baseUrl}/storage/${selectedDepartment.logo}`;
            } else {
                imgElement.src = "";
            }
        }
    }, [selectedDepartment]);

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" disabled={!selectedDepartment}>
                    Upload Logo
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="w-full max-w-xl mx-auto">
                    <DrawerHeader>
                        <DrawerTitle>
                            Logo for {selectedDepartment?.name} Department
                        </DrawerTitle>
                        <DrawerDescription>
                            Upload the official logo for the department. This
                            logo will be displayed on the login page to
                            represent the department. Ensure the logo is in PNG
                            or JPG format, with a maximum size of 10MB
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-2 p-4 mt-auto ">
                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-40 h-40 mb-4">
                                    <Avatar className="w-full h-full bg-white rounded-full shadow-lg">
                                        {data.logo ? (
                                            <img
                                                id="logo_preview"
                                                src={URL.createObjectURL(
                                                    data.logo
                                                )}
                                                alt="Logo Preview"
                                                className="object-cover w-full h-full rounded-full"
                                            />
                                        ) : selectedDepartment?.logo ? (
                                            <img
                                                id="logo_preview"
                                                src={
                                                    data.logo
                                                        ? URL.createObjectURL(
                                                              data.logo
                                                          )
                                                        : selectedDepartment?.logo
                                                        ? `${baseUrl}/storage/${selectedDepartment.logo}` // Show the existing logo
                                                        : selectedDepartment?.program_code
                                                }
                                                alt="Logo Preview"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-white rounded-full">
                                                {
                                                    selectedDepartment?.program_code
                                                }
                                            </div>
                                        )}
                                    </Avatar>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold">
                                        {selectedDepartment?.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Department ID: {selectedDepartment?.id}
                                    </p>
                                </div>

                                <div className="w-full max-w-xs">
                                    <Label htmlFor="logo">Picture</Label>
                                    <Input
                                        id="logo"
                                        name="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full max-w-xs mt-6"
                                    disabled={isButtonDisabled}
                                >
                                    Upload Logo
                                </Button>
                                <DrawerClose asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full max-w-xs mt-6"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </DrawerClose>
                            </div>
                        </form>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
