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
import { PeriodManagementTabsProps } from "@/types/my_types";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { ConfirmDialog } from "@/Components/CustomizedComponents/confirmation-dialog";
import { SelectPeriod } from "@/Components/CustomizedComponents/select-component";
import { ToggleActivePeriod } from "@/Components/CustomizedComponents/is-active";

//Period Management
export function PeriodManagementTabs({
    userTheme,
    systemTheme,
    periods,
}: PeriodManagementTabsProps) {
    const [periodId, setPeriodId] = useState<string>("");
    const [selectedPeriod, setSelectedPeriod] = useState<{
        id: number;
        period_name: string;
        is_active: number;
    } | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [periodName, setPeriodName] = useState<string>("");
    const [confirmName, setConfirmName] = useState<string>("");

    const handleToggle = (newState: number) => {
        if (selectedPeriod) {
            setSelectedPeriod({
                ...selectedPeriod,
                is_active: newState,
            });
            // console.log(
            //     `Period is now ${newState === 1 ? "Active" : "Inactive"}`
            // );
        }
    };

    //get name of the period
    useEffect(() => {
        if (periodId) {
            const period = periods.data.find(
                (period) => String(period.id) === periodId
            );
            if (period) {
                setSelectedPeriod({
                    id: period.id,
                    period_name: period.period_name,
                    is_active: period.is_active,
                });
            } else {
                setSelectedPeriod(null);
            }
        }
    }, [periodId, periods]);

    //add
    const addPeriod = () => {
        if (!periodName || !confirmName) {
            toast_error({
                message: "Please fill in all required fields.",
                userTheme: userTheme,
            });
            return;
        }

        if (periodName !== confirmName) {
            toast_error({
                message:
                    "The period you entered do not match. Please check and try again.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.post(
                    route("periods.store"),
                    {
                        period_name: periodName,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding period...",
                    success: () => <span>New period added successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add period. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setPeriodName("");
                setConfirmName("");
                router.reload();
            });
    };

    //update
    const updatePeriod = (enteredPeriod: string) => {
        if (!periodId || !selectedPeriod) {
            return;
        }

        if (enteredPeriod !== selectedPeriod?.period_name) {
            toast_error({
                message: "Period does not match.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.put(
                    route("periods.update", { periods: periodId }),
                    {
                        period_name: selectedPeriod.period_name,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Updating period...",
                    success: () => <span>Period updated successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not update the period. Please try again later.";

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
                        <CardTitle>Add Semester</CardTitle>
                        <CardDescription>
                            Set and manage academic semesters for scheduling.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="period_name">Semester</Label>
                            <Input
                                id="period_name"
                                placeholder="ex. 1st Semester"
                                autoComplete="off"
                                value={periodName}
                                onChange={(e) => setPeriodName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm_period_name">Confirm Semester</Label>
                            <Input
                                id="confirm_period_name"
                                placeholder="ex. 1st Semester"
                                autoComplete="off"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={addPeriod}>Submit</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Edit */}
            <TabsContent value="edit">
                <Card>
                    <CardHeader>
                        <CardTitle className="grid grid-cols-2">
                            <div>Edit Semester</div>

                            <div className="flex justify-end">
                                {selectedPeriod && (
                                    <ToggleActivePeriod
                                        selectedPeriod={selectedPeriod}
                                        onToggle={handleToggle}
                                        userTheme={userTheme}
                                        systemTheme={systemTheme}
                                    />
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Modify the details of existing academic semesters.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="period_id">Select Semester</Label>
                            <SelectPeriod
                                id={"period_id"}
                                period={periods}
                                value={periodId}
                                onChange={(value) => {
                                    setPeriodId(value);
                                }}
                            />
                        </div>

                        {selectedPeriod && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="period_name">
                                        Semester Name
                                    </Label>
                                    <Input
                                        id="period_name"
                                        autoComplete="off"
                                        value={selectedPeriod.period_name}
                                        onChange={(e) =>
                                            setSelectedPeriod({
                                                ...selectedPeriod,
                                                period_name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            disabled={!selectedPeriod}
                        >
                            Save Changes
                        </Button>

                        {/* Confirmation Dialog */}
                        <ConfirmDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            onConfirm={updatePeriod}
                            dialog_title={"Confirm Update"}
                            dialog_label={"Enter the semester to confirm changes"}
                            placeholder={"Enter the new semester name"}
                            dialog_description="semester"
                            userTheme={userTheme}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
