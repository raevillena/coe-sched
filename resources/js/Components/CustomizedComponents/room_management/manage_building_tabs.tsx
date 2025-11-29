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
import { BuildingManagementProps } from "@/types/my_types";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { ConfirmDialog } from "@/Components/CustomizedComponents/confirmation-dialog";
import { ToggleActiveBuilding } from "@/Components/CustomizedComponents/is-active";
import { ManageSelectBuilding } from "@/Components/CustomizedComponents/room_management/select_building";

//Building Management
export function BuildingManagementTabs({
    userTheme,
    systemTheme,
    buildings,
}: BuildingManagementProps) {
    const [buildingId, setBuildingId] = useState<string>("");
    const [selectedBuilding, setSelectedBuilding] = useState<{
        id: number;
        building_name: string;
        is_active: number;
    } | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buildingName, setBuildingName] = useState<string>("");
    const [confirmName, setConfirmName] = useState<string>("");

    const handleToggle = (newState: number) => {
        if (selectedBuilding) {
            setSelectedBuilding({
                ...selectedBuilding,
                is_active: newState,
            });
        }
    };

    useEffect(() => {
        if (buildingId) {
            const building = buildings.data.find(
                (building) => String(building.id) === buildingId
            );
            if (building) {
                setSelectedBuilding({
                    id: building.id,
                    building_name: building.building_name,
                    is_active: building.is_active,
                });
            } else {
                setSelectedBuilding(null);
            }
        }
    }, [buildingId, buildings]);

    //add
    const addBuilding = () => {
        if (!buildingName || !confirmName) {
            toast_error({
                message: "Please fill in all required fields.",
                userTheme: userTheme,
            });
            return;
        }

        if (buildingName !== confirmName) {
            toast_error({
                message:
                    "The name of the building you entered do not match. Please check and try again.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.post(
                    route("buildings.store"),
                    {
                        building_name: buildingName,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding building...",
                    success: () => <span>New building added successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add building. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setBuildingName("");
                setConfirmName("");
                router.reload();
            });
    };

    //update
    const updateLevel = (enteredBuilding: string) => {
        if (!buildingId || !selectedBuilding) {
            return;
        }

        if (enteredBuilding !== selectedBuilding?.building_name) {
            toast_error({
                message: "Building name does not match.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.put(
                    route("buildings.update", { buildings: buildingId }),
                    {
                        building_name: selectedBuilding.building_name,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Updating building...",
                    success: () => <span>Building updated successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not update the building name. Please try again later.";

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
                        <CardTitle>Add Building</CardTitle>
                        <CardDescription>
                            Add a new building. 
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="building_name">Building</Label>
                            <Input
                                id="building_name"
                                placeholder="ex. Main Building"
                                autoComplete="off"
                                value={buildingName}
                                onChange={(e) => setBuildingName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm_building_name">
                                Confirm Building
                            </Label>
                            <Input
                                id="confirm_building_name"
                                placeholder="ex. Main Building"
                                autoComplete="off"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={addBuilding}>Submit</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Edit */}
            <TabsContent value="edit">
                <Card>
                    <CardHeader>
                        <CardTitle className="grid grid-cols-2">
                            <div>Edit Building</div>

                            <div className="flex justify-end">
                                {selectedBuilding && (
                                    <ToggleActiveBuilding
                                        selectedBuilding={selectedBuilding}
                                        onToggle={handleToggle}
                                        userTheme={userTheme}
                                        systemTheme={systemTheme}
                                    />
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Update building name
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="building_id">Select Building</Label>
                            <ManageSelectBuilding
                                id={"building_id"}
                                building={buildings}
                                value={buildingId}
                                onChange={(value) => {
                                    setBuildingId(value);
                                }}
                                disabled={false}
                            />
                        </div>

                        {selectedBuilding && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="building_name">
                                        Building Name
                                    </Label>
                                    <Input
                                        id="building_name"
                                        autoComplete="off"
                                        value={selectedBuilding.building_name}
                                        onChange={(e) =>
                                            setSelectedBuilding({
                                                ...selectedBuilding,
                                                building_name: e.target.value,
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
                            disabled={!selectedBuilding}
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
                                "Enter the building name to confirm changes"
                            }
                            placeholder={"Enter the new building name"}
                            dialog_description="building"
                            userTheme={userTheme}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
