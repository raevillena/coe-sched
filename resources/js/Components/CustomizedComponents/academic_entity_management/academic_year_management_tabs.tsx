import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { AcademicYearManagementTabsProps } from "@/types/my_types";
import {
    toast_error,
    toast_info,
    toast_style_promise,
} from "@/types/my_types/mytoast";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { ConfirmDialog } from "@/Components/CustomizedComponents/confirmation-dialog";
import { SelectAY } from "@/Components/CustomizedComponents/select-component";
import { ToggleActiveAY } from "@/Components/CustomizedComponents/is-active";

//Academic Year Management
export function AcademicYearManagementTabs({
    userTheme,
    systemTheme,
    academic_years,
}: AcademicYearManagementTabsProps) {
    const [ayId, setAYId] = useState<string>("");
    const [selectedAY, setSelectedAY] = useState<{
        id: number;
        academic_year: string;
        is_active: number;
    } | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [name, setName] = useState<string>("");
    const [confirmName, setConfirmName] = useState<string>("");

    const handleToggle = (newState: number) => {
        if (selectedAY) {
            setSelectedAY({
                ...selectedAY,
                is_active: newState,
            });
        }
    };

    useEffect(() => {
        if (ayId) {
            const ay = academic_years.data.find((ay) => String(ay.id) === ayId);
            if (ay) {
                setSelectedAY({
                    id: ay.id,
                    academic_year: ay.academic_year,
                    is_active: ay.is_active,
                });
            } else {
                setSelectedAY(null);
            }
        }
    }, [ayId, academic_years]);

    //add
    const addAY = () => {
        if (!name || !confirmName) {
            toast_error({
                message: "Please fill in all required fields.",
                userTheme: userTheme,
            });
            return;
        }

        if (name !== confirmName) {
            toast_error({
                message:
                    "The academic years do not match. Please check and try again.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.post(
                    route("academic_year.store"),
                    {
                        academic_year: name,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding academic year...",
                    success: () => (
                        <span>New academic year added successfully!</span>
                    ),
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add academic year. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setName("");
                setConfirmName("");
                router.reload();
            });
    };

    //update
    const updateAY = (enteredAY: string) => {
        if (!ayId || !selectedAY) {
            return;
        }

        if (enteredAY !== selectedAY?.academic_year) {
            toast_error({
                message: "Academic Year does not match.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.put(
                    route("academic_year.update", { academic_years: ayId }),
                    {
                        academic_year: selectedAY.academic_year,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Updating academic year...",
                    success: () => (
                        <span>Academic year updated successfully!</span>
                    ),
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.errors?.name ||
                            "Could not update the academic year. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setIsDialogOpen(false);
                router.reload();
            });
    };

    return (
        <Tabs defaultValue="add" className="w-[700px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">Add</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>

            {/* Add */}
            <TabsContent value="add">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Academic Year</CardTitle>
                        <CardDescription>
                            Create and manage academic years to organize
                            schedules, subjects, and faculty assignments.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="position_name">Academic Year</Label>
                            <Input
                                id="academic_year"
                                type="text"
                                placeholder="ex. 2025 for 2025-2026"
                                value={name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    //4 digits lang
                                    if (/^\d{0,4}$/.test(value)) {
                                        setName(e.target.value);
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value.length !== 4) {
                                        toast_info({
                                            message:
                                                "Please enter exactly 4 digits for the academic year.",
                                            userTheme: userTheme,
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm_pos_name">
                                Confirm New Academic Year
                            </Label>
                            <Input
                                id="confirm_ay_name"
                                placeholder="ex. 2025"
                                autoComplete="off"
                                value={confirmName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,4}$/.test(value)) {
                                        setConfirmName(e.target.value);
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value.length !== 4) {
                                        toast_info({
                                            message:
                                                "Please enter exactly 4 digits for the academic year.",
                                            userTheme: userTheme,
                                        });
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={addAY}>Submit</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Edit */}
            <TabsContent value="edit">
                <Card>
                    <CardHeader>
                        <CardTitle className="grid grid-cols-2">
                            <div>Edit Academic Year</div>

                            <div className="flex justify-end">
                                {selectedAY && (
                                    <ToggleActiveAY
                                        selectedAY={selectedAY}
                                        onToggle={handleToggle}
                                        userTheme={userTheme}
                                        systemTheme={systemTheme}
                                    />
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Modify the details of existing academic years.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="ay_id">Select Academic Year</Label>
                            <SelectAY
                                id={"ay_id"}
                                academic_years={academic_years}
                                value={ayId}
                                onChange={(value) => {
                                    setAYId(value);
                                }}
                            />
                        </div>

                        {selectedAY && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="academic_year">
                                        Academic Year
                                    </Label>
                                    <Input
                                        id="academic_year"
                                        autoComplete="off"
                                        value={selectedAY.academic_year}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,4}$/.test(value)) {
                                                setSelectedAY({
                                                    ...selectedAY,
                                                    academic_year:
                                                        e.target.value,
                                                });
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const value = e.target.value;
                                            if (value.length !== 4) {
                                                toast_info({
                                                    message:
                                                        "Please enter exactly 4 digits for the academic year.",
                                                    userTheme: userTheme,
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            disabled={!selectedAY}
                        >
                            Save Changes
                        </Button>

                        {/* Confirmation Dialog */}
                        <ConfirmDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            onConfirm={updateAY}
                            dialog_title={"Confirm Update"}
                            dialog_label={
                                "Enter the academic year to confirm changes"
                            }
                            placeholder={"Enter the new academic year"}
                            dialog_description="academic year"
                            userTheme={userTheme}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
