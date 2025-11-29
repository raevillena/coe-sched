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
import { LevelManagementTabsProps } from "@/types/my_types";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { ConfirmDialog } from "@/Components/CustomizedComponents/confirmation-dialog";
import { SelectLevel } from "@/Components/CustomizedComponents/select-component";
import { ToggleActiveLevel } from "@/Components/CustomizedComponents/is-active";

//Level Management
export function LevelManagementTabs({
    userTheme,
    systemTheme,
    levels,
}: LevelManagementTabsProps) {
    const [levelId, setLevelId] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<{
        id: number;
        level_name: string;
        is_active: number;
    } | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [levelName, setLevelName] = useState<string>("");
    const [confirmName, setConfirmName] = useState<string>("");

    const handleToggle = (newState: number) => {
        if (selectedLevel) {
            setSelectedLevel({
                ...selectedLevel,
                is_active: newState,
            });
            // console.log(
            //     `Year Level is now ${newState === 1 ? "Active" : "Inactive"}`
            // );
        }
    };

    useEffect(() => {
        if (levelId) {
            const level = levels.data.find(
                (level) => String(level.id) === levelId
            );
            if (level) {
                setSelectedLevel({
                    id: level.id,
                    level_name: level.level_name,
                    is_active: level.is_active,
                });
            } else {
                setSelectedLevel(null);
            }
        }
    }, [levelId, levels]);

    //add
    const addLevel = () => {
        if (!levelName || !confirmName) {
            toast_error({
                message: "Please fill in all required fields.",
                userTheme: userTheme,
            });
            return;
        }

        if (levelName !== confirmName) {
            toast_error({
                message:
                    "The year level you entered do not match. Please check and try again.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.post(
                    route("levels.store"),
                    {
                        level_name: levelName,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding level...",
                    success: () => <span>New level added successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add year level. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setLevelName("");
                setConfirmName("");
                router.reload();
            });
    };

    //update
    const updateLevel = (enteredLevel: string) => {
        if (!levelId || !selectedLevel) {
            return;
        }

        if (enteredLevel !== selectedLevel?.level_name) {
            toast_error({
                message: "Year Level does not match.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.put(
                    route("levels.update", { levels: levelId }),
                    {
                        level_name: selectedLevel.level_name,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Updating level...",
                    success: () => <span>Level updated successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not update the year level. Please try again later.";

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
                        <CardTitle>Add Year Level</CardTitle>
                        <CardDescription>
                            Assign and manage the year levels for students.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="level_name">Year Level</Label>
                            <Input
                                id="level_name"
                                placeholder="ex. 1st Year"
                                autoComplete="off"
                                value={levelName}
                                onChange={(e) => setLevelName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm_level_name">Confirm Year Level</Label>
                            <Input
                                id="confirm_level_name"
                                placeholder="ex. 1st Year"
                                autoComplete="off"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={addLevel}>Submit</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Edit */}
            <TabsContent value="edit">
                <Card>
                    <CardHeader>
                        <CardTitle className="grid grid-cols-2">
                            <div>Edit Year Level</div>

                            <div className="flex justify-end">
                                {selectedLevel && (
                                    <ToggleActiveLevel
                                        selectedLevel={selectedLevel}
                                        onToggle={handleToggle}
                                        userTheme={userTheme}
                                        systemTheme={systemTheme}
                                    />
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Modify the year levels assigned to students.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="level_id">Select Year Level</Label>
                            <SelectLevel
                                id={"level_id"}
                                level={levels}
                                value={levelId}
                                onChange={(value) => {
                                    setLevelId(value);
                                }}
                            />
                        </div>

                        {selectedLevel && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="level_name">
                                        Year Level Name
                                    </Label>
                                    <Input
                                        id="level_name"
                                        autoComplete="off"
                                        value={selectedLevel.level_name}
                                        onChange={(e) =>
                                            setSelectedLevel({
                                                ...selectedLevel,
                                                level_name: e.target.value,
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
                            disabled={!selectedLevel}
                        >
                            Save Changes
                        </Button>

                        {/* Confirmation Dialog */}
                        <ConfirmDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            onConfirm={updateLevel}
                            dialog_title={"Confirm Update"}
                            dialog_label={"Enter the year level to confirm changes"}
                            placeholder={"Enter the new year level name"}
                            dialog_description="year level"
                            userTheme={userTheme}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
