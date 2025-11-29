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
import { FloorManagementProps } from "@/types/my_types";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { ConfirmDialog } from "@/Components/CustomizedComponents/confirmation-dialog";
import { ToggleActiveFloor } from "@/Components/CustomizedComponents/is-active";
import { ManageSelectFloor } from "@/Components/CustomizedComponents/room_management/select_floor";

//Floor Management
export function FloorManagementTabs({
    userTheme,
    systemTheme,
    floors,
}: FloorManagementProps) {
    const [floorId, setFloorId] = useState<string>("");
    const [selectedFloor, setSelectedFloor] = useState<{
        id: number;
        floor_name: string;
        is_active: number;
    } | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [floorName, setFloorName] = useState<string>("");
    const [confirmName, setConfirmName] = useState<string>("");

    const handleToggle = (newState: number) => {
        if (selectedFloor) {
            setSelectedFloor({
                ...selectedFloor,
                is_active: newState,
            });
        }
    };

    useEffect(() => {
        if (floorId) {
            const floor = floors.data.find(
                (floor) => String(floor.id) === floorId
            );
            if (floor) {
                setSelectedFloor({
                    id: floor.id,
                    floor_name: floor.floor_name,
                    is_active: floor.is_active,
                });
            } else {
                setSelectedFloor(null);
            }
        }
    }, [floorId, floors]);

    //add
    const addFloor = () => {
        if (!floorName || !confirmName) {
            toast_error({
                message: "Please fill in all required fields.",
                userTheme: userTheme,
            });
            return;
        }

        if (floorName !== confirmName) {
            toast_error({
                message:
                    "The floor name you entered do not match. Please check and try again.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.post(
                    route("floors.store"),
                    {
                        floor_name: floorName,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding floor...",
                    success: () => <span>New floor added successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add floor. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setFloorName("");
                setConfirmName("");
                router.reload();
            });
    };

    //update
    const updateLevel = (enteredFloor: string) => {
        if (!floorId || !selectedFloor) {
            return;
        }

        if (enteredFloor !== selectedFloor?.floor_name) {
            toast_error({
                message: "Floor name does not match.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.put(
                    route("floors.update", { floors: floorId }),
                    {
                        floor_name: selectedFloor.floor_name,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Updating floor...",
                    success: () => <span>Floor updated successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not update the floor name. Please try again later.";

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
                        <CardTitle>Add Floor</CardTitle>
                        <CardDescription>
                            Add floor within the building.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="floor_name">Floor</Label>
                            <Input
                                id="floor_name"
                                placeholder="ex. 1st Floor"
                                autoComplete="off"
                                value={floorName}
                                onChange={(e) => setFloorName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm_floor_name">
                                Confirm Floor
                            </Label>
                            <Input
                                id="confirm_floor_name"
                                placeholder="ex. 1st Floor"
                                autoComplete="off"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={addFloor}>Submit</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Edit */}
            <TabsContent value="edit">
                <Card>
                    <CardHeader>
                        <CardTitle className="grid grid-cols-2">
                            <div>Edit Floor</div>

                            <div className="flex justify-end">
                                {selectedFloor && (
                                    <ToggleActiveFloor
                                        selectedFloor={selectedFloor}
                                        onToggle={handleToggle}
                                        userTheme={userTheme}
                                        systemTheme={systemTheme}
                                    />
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Edit the floors within the building.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="floor_id">Select Floor</Label>
                            <ManageSelectFloor
                                id={"floor_id"}
                                floor={floors}
                                value={floorId}
                                onChange={(value) => {
                                    setFloorId(value);
                                }}
                                disabled={false}
                            />
                        </div>

                        {selectedFloor && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="floor_name">
                                        Floor Name
                                    </Label>
                                    <Input
                                        id="floor_name"
                                        autoComplete="off"
                                        value={selectedFloor.floor_name}
                                        onChange={(e) =>
                                            setSelectedFloor({
                                                ...selectedFloor,
                                                floor_name: e.target.value,
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
                            disabled={!selectedFloor}
                        >
                            Save Changes
                        </Button>

                        {/* Confirmation Dialog */}
                        <ConfirmDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            onConfirm={updateLevel}
                            dialog_title={"Confirm Update"}
                            dialog_label={
                                "Enter the floor name to confirm changes"
                            }
                            placeholder={"Enter the new floor name"}
                            dialog_description="floor"
                            userTheme={userTheme}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
