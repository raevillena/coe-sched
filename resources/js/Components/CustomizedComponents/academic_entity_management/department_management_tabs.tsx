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
import { SelectDept } from "@/Components/CustomizedComponents/select-component";
import { DepartmentManagementTabsProps } from "@/types/my_types";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { ConfirmDialog } from "@/Components/CustomizedComponents/confirmation-dialog";
import { UpdateDeptLogoDrawer } from "@/Components/CustomizedComponents/upload-logo-drawer";
import {ToggleActiveDept } from "@/Components/CustomizedComponents/is-active";

//Department Management
export function DepartmentManagementTabs({
    departments,
    userTheme,
    systemTheme,
    userRole,
    userDepartmentId,
}: DepartmentManagementTabsProps) {
    const [departmentId, setDepartmentId] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<{
        id: number;
        name: string;
        program_code: string;
        logo: File | null;
        is_active: number;
    } | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [name, setName] = useState<string>("");
    const [programCode, setProgramCode] = useState<string>("");

    const handleToggle = (newState: number) => {
        if (selectedDepartment) {
            setSelectedDepartment({
                ...selectedDepartment,
                is_active: newState,
            });
            // console.log(
            //     `Department is now ${newState === 1 ? "Active" : "Inactive"}`
            // );
        }
    };

    //get name and program_code based on the selected department
    useEffect(() => {
        if (departmentId) {
            const department = departments.data.find(
                (dept) => String(dept.id) === departmentId
            );
            if (department) {
                setSelectedDepartment({
                    id: department.id,
                    name: department.name,
                    program_code: department.program_code,
                    logo: department.logo,
                    is_active: department.is_active,
                });
            } else {
                setSelectedDepartment(null);
            }
        }
    }, [departmentId, departments]);

    //add
    const addDepartment = () => {
        if (!name || !programCode) {
            toast_error({
                message: "Please fill in all required fields.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.post(
                    route("departments.store"),
                    {
                        name,
                        program_code: programCode,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding department...",
                    success: () => <span>New department added successfully!</span>,
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not create department. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setName("");
                setProgramCode("");
                router.reload();
            });
    };

    //update
    const updateDepartment = (enteredProgramCode: string) => {
        if (!departmentId || !selectedDepartment) {
            return;
        }

        if (enteredProgramCode !== selectedDepartment?.program_code) {
            toast_error({
                message: "Program code does not match.",
                userTheme: userTheme,
            });
            return;
        }

        toast
            .promise(
                axios.put(
                    route("departments.update", { departments: departmentId }),
                    {
                        name: selectedDepartment.name,
                        program_code: selectedDepartment.program_code,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Updating department...",
                    success: () => (
                        <span>Department updated successfully!</span>
                    ),
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.errors?.name ||
                            error.response?.data?.errors?.program_code ||
                            "Could not update the department. Please try again later.";

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

    //Delete removed
    // const deleteDepartment = (enteredProgramCode: string) => {
    //     if (!departmentId || !selectedDepartment) {
    //         return;
    //     }

    //     if (enteredProgramCode !== selectedDepartment?.program_code) {
    //         toast_error({
    //             message: "Program code does not match.",
    //             userTheme: userTheme,
    //         });
    //         return;
    //     }

    //     toast
    //         .promise(
    //             axios.delete(
    //                 route("departments.delete", { departments: departmentId })
    //             ),
    //             {
    //                 loading: "Deleting department...",
    //                 success: () => (
    //                     <span>Department deleted successfully!</span>
    //                 ),
    //                 error: (error) => {
    //                     const errorMessage =
    //                         error.response?.data?.errors?.name ||
    //                         error.response?.data?.errors?.program_code ||
    //                         "Could not update the department. Please try again later.";

    //                     return <span>{errorMessage}</span>;
    //                 },
    //             },
    //             {
    //                 style: toast_style_promise({ userTheme, systemTheme }),
    //             }
    //         )
    //         .then(() => {
    //             setIsDialogOpen(false);
    //             router.reload();
    //         });
    // };

    return (
        <Tabs defaultValue="add" className="w-[700px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">Add</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                {/* <TabsTrigger value="delete">Delete</TabsTrigger> */}
            </TabsList>

            {/* Add */}
            <TabsContent value="add">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Department</CardTitle>
                        <CardDescription>
                            Manage and add new departments to the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="department_name">Department Name</Label>
                            <Input
                                id="department_name"
                                placeholder="ex. Computer Engineering"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="program_code">
                                Department Code
                            </Label>
                            <Input
                                id="program_code"
                                placeholder="ex. BSCPE"
                                value={programCode}
                                onChange={(e) => setProgramCode(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={addDepartment}>Submit</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Edit */}
            <TabsContent value="edit">
                <Card>
                    <CardHeader>
                        <CardTitle className="grid grid-cols-2">
                            <div>Edit Department</div>

                            <div className="flex justify-end">
                                {selectedDepartment && (
                                    <ToggleActiveDept
                                        selectedDepartment={selectedDepartment}
                                        onToggle={handleToggle}
                                        userTheme={userTheme} 
                                        systemTheme={systemTheme} 
                                    />
                                )}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Modify the details of existing departments in the
                            system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="department_id">
                                Select Department
                            </Label>
                            <SelectDept
                                id={"department_id"}
                                departments={departments}
                                value={departmentId}
                                onChange={(value) => {
                                    setDepartmentId(value);
                                }}
                                userDepartmentId={userDepartmentId}
                                userRole={userRole}
                            />
                        </div>

                        {selectedDepartment && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="dept_name">
                                        Department Name
                                    </Label>
                                    <Input
                                        id="dept_name"
                                        autoComplete="off"
                                        value={selectedDepartment.name}
                                        onChange={(e) =>
                                            setSelectedDepartment({
                                                ...selectedDepartment,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="program_code">
                                        Department Code
                                    </Label>
                                    <Input
                                        id="program_code"
                                        autoComplete="off"
                                        value={selectedDepartment.program_code}
                                        onChange={(e) =>
                                            setSelectedDepartment({
                                                ...selectedDepartment,
                                                program_code: e.target.value,
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
                            disabled={!selectedDepartment}
                        >
                            Save Changes
                        </Button>

                        <UpdateDeptLogoDrawer
                            selectedDepartment={selectedDepartment}
                            userTheme={userTheme}
                            systemTheme={systemTheme}
                        />

                        {/* Confirmation Dialog */}
                        <ConfirmDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            onConfirm={updateDepartment}
                            dialog_title={"Confirm Update"}
                            dialog_label={
                                "Enter the program code to confirm changes"
                            }
                            placeholder={"Enter the new department code"}
                            dialog_description="department"
                            userTheme={userTheme}
                        />
                    </CardFooter>
                </Card>
            </TabsContent>

            {/* Delete --removed--
            <TabsContent value="delete">
                <Card>
                    <CardHeader>
                        <CardTitle>Delete Department</CardTitle>
                        <CardDescription>
                            Deleting a department will remove it permanently
                            from the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="department_id">
                                Select Department
                            </Label>
                            <SelectDept
                                id={"department_id"}
                                departments={departments}
                                value={departmentId}
                                onChange={(value) => {
                                    setDepartmentId(value);
                                }}
                            />
                        </div>

                        {selectedDepartment && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="name">
                                        Department Name
                                    </Label>
                                    <Input
                                        id="name"
                                        autoComplete="off"
                                        value={selectedDepartment.name}
                                        onChange={(e) =>
                                            setSelectedDepartment({
                                                ...selectedDepartment,
                                                name: e.target.value,
                                            })
                                        }
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="program_code">
                                        Department Code
                                    </Label>
                                    <Input
                                        id="program_code"
                                        autoComplete="off"
                                        value={selectedDepartment.program_code}
                                        onChange={(e) =>
                                            setSelectedDepartment({
                                                ...selectedDepartment,
                                                program_code: e.target.value,
                                            })
                                        }
                                        readOnly
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="destructive"
                            onClick={() => setIsDialogOpen(true)}
                            disabled={!selectedDepartment}
                        >
                            Delete
                        </Button>

                        <ConfirmDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            onConfirm={deleteDepartment}
                            dialog_title={"Confirm Deletetion"}
                            dialog_label={
                                "Enter the program code to confirm deletion"
                            }
                        />
                    </CardFooter>
                </Card>
            </TabsContent>
            */}
        </Tabs>
    );
}
