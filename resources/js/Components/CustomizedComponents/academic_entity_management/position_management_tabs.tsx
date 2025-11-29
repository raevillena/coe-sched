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
import { PositionManagementTabsProps } from "@/types/my_types";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { ConfirmDialog } from "@/Components/CustomizedComponents/confirmation-dialog";
import { ControlPosition } from "@/Components/CustomizedComponents/select-component";
import { ToggleActivePos } from "@/Components/CustomizedComponents/is-active";

//Position Management
export function PositionManagementTabs({
    userTheme,
    systemTheme,
    positions,
}: PositionManagementTabsProps) {
    const [positionId, setPositionId] = useState<string>("");
    const [selectedPosition, setSelectedPosition] = useState<{
        id: number;
        name: string;
        is_active: number;
    } | null>(null);

    const handleToggle = (newState: number) => {
        if (selectedPosition) {
            setSelectedPosition({
                ...selectedPosition,
                is_active: newState,
            });
            // console.log(
            //     `Position is now ${newState === 1 ? "Active" : "Inactive"}`
            // );
        }
    };

    useEffect(() => {
        if (positionId) {
            const position = positions.data.find(
                (pos) => String(pos.id) === positionId
            );
            if (position) {
                setSelectedPosition({
                    id: position.id,
                    name: position.name,
                    is_active: position.is_active,
                });
            } else {
                setSelectedPosition(null);
            }
        }
    }, [positionId, positions]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [name, setName] = useState<string>("");
    const [confirmName, setConfirmName] = useState<string>("");

    //add
    const addPosition = () => {
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
                    "The position names do not match. Please check and try again.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.post(
                    route("positions.store"),
                    {
                        name: name,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding position...",
                    success: () => (
                        <span>New position added successfully!</span>
                    ),
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add position. Please try again later.";

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
    const updatePosition = (enteredPosition: string) => {
        if (!positionId || !selectedPosition) {
            return;
        }

        if (enteredPosition !== selectedPosition?.name) {
            toast_error({
                message: "Position does not match.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.put(
                    route("positions.update", { positions: positionId }),
                    {
                        name: selectedPosition.name,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Updating position...",
                    success: () => <span>Position updated successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.errors?.name ||
                            "Could not update the position. Please try again later.";

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
                        <CardTitle>Add Position</CardTitle>
                        <CardDescription>
                            Define and manage different faculty positions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="position_name">
                                Position Title
                            </Label>
                            <Input
                                id="position_name"
                                placeholder="ex. Instructor I"
                                autoComplete="off"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm_pos_name">
                                Confirm Position
                            </Label>
                            <Input
                                id="confirm_pos_name"
                                placeholder="ex. Instructor I"
                                autoComplete="off"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={addPosition}>Submit</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Edit */}
            <TabsContent value="edit">
                <Card>
                    <CardHeader>
                        <CardTitle className="grid grid-cols-2">
                            <div>Edit Position</div>

                            <div className="flex justify-end">
                                {selectedPosition && (
                                    <ToggleActivePos
                                        selectedPosition={selectedPosition}
                                        onToggle={handleToggle}
                                        userTheme={userTheme}
                                        systemTheme={systemTheme}
                                    />
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Modify the details of existing faculty positions.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="position_id">Select Position</Label>
                            <ControlPosition
                                id={"position_id"}
                                position={positions}
                                value={positionId}
                                onChange={(value) => {
                                    setPositionId(value);
                                }}
                            />
                        </div>

                        {selectedPosition && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="position_name">
                                        Position Name
                                    </Label>
                                    <Input
                                        id="position_name"
                                        autoComplete="off"
                                        value={selectedPosition.name}
                                        onChange={(e) =>
                                            setSelectedPosition({
                                                ...selectedPosition,
                                                name: e.target.value,
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
                            disabled={!selectedPosition}
                        >
                            Save Changes
                        </Button>

                        {/* Confirmation Dialog */}
                        <ConfirmDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            onConfirm={updatePosition}
                            dialog_title={"Confirm Update"}
                            dialog_label={
                                "Enter the position to confirm changes"
                            }
                            placeholder={"Enter the new position name"}
                            dialog_description="position"
                            userTheme={userTheme}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
