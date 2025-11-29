import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { FloorPlan, RoomManagementProps } from "@/types/my_types";
import { useState, useEffect } from "react";
import { SelectFloor } from "@/Components/CustomizedComponents/room_management/select_floor";
import { SelectBuilding } from "@/Components/CustomizedComponents/room_management/select_building";
import { BsBuildingFillGear } from "react-icons/bs";
import { Label } from "@/Components/ui/label";
import EditFloorPlan from "@/Components/CustomizedComponents/room_management/edit_floor_plan";
import { toast, Toaster } from "sonner";
import { ToggleActiveFloorPlan } from "@/Components/CustomizedComponents/is-active";
import useTour from "@/Composables/useTour";

export default function RoomEditFloorPlan({
    auth,
    breadcrumbs,
    floors,
    buildings,
    floor_plans,
    academic_programs,
}: RoomManagementProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    useTour({
        user: auth.user,
        name: "showEditFloorPlanTour",
        steps: () => [
            {
                title: "🛠️ Edit Floor Plan",
                intro: `Modify an existing <b>floor plan</b> to ensure efficient space management for classrooms, offices, and other facilities. <br><br>  
                            Follow these steps to update and organize your layouts seamlessly.<br><br>  
                            <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `🏢 <b>Select a Building</b><br>  
                            Choose the building where you want to edit the floor plan. This ensures that updates are applied correctly.`,
                element: document.querySelector("#building_id") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📍 <b>Select a Floor</b><br>  
                            After selecting the building, pick the specific floor you need to modify.`,
                element: document.querySelector("#floor_id") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🟢🔴 <b>Activate or Deactivate Floor Plan</b><br>  
                            Click this button to <b>Activate</b> or <b>Deactivate</b> the floor plan. <br><br>  
                            🔹 When activated, the floor plan will be visible, and rooms will become accessible.`,
                element: document.querySelector(
                    "#active-button"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `✏️ <b>Edit Floor Plan</b><br>  
                            Click the <b>'Edit'</b> button to modify the floor plan layout. <br><br>  
                            🔹 Don't forget to save your changes once you're done!`,
                element: document.querySelector("#edit-button") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🎨 <b>Editing Area</b><br>  
                            This is where you can <b>view and modify</b> the floor plan. <br><br>  
                            Use the available tools to make necessary adjustments.`,
                element: document.querySelector(
                    "#editing-area-2"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🚀 Try it Yourself!",
                intro: `<b>Now it's your turn!</b><br><br>  
                            <i>Select a building</i>, <i>choose a floor</i>, and <i>edit the layout</i> as needed. <br><br>  
                            <b>🔹 Note:</b> Be sure to <b>save your changes</b> to avoid losing modifications.`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });

    const [floorPlanId, setFloorPlanId] = useState<string>("");
    const [building, setBuilding] = useState<string | null>("Main Building");
    const [floor, setFloor] = useState<string | null>("Ground Floor");
    const [selectedFloorPlan, setSelectedFloorPlan] =
        useState<FloorPlan | null>(null);
    const [isEditable, setIsEditable] = useState<boolean>(false);

    useEffect(() => {
        let floorPlan = null;
        if (building && floor) {
            floorPlan = floor_plans.find(
                (plan) => plan.building === building && plan.floor === floor
            );
        } else if (floor) {
            floorPlan = floor_plans.find((plan) => plan.floor === floor);
        }
        setSelectedFloorPlan(floorPlan || null);
    }, [building, floor, floor_plans]);

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleCancel = () => {
        toast("Are you sure you want to cancel?", {
            description: "This will reset all your current changes.",
            action: {
                label: "Confirm",
                onClick: () => {
                    setIsEditable(false);
                    setBuilding("Main Building");
                    setFloor("Ground Floor");
                },
            },
        });
    };

    //update status of floor plan
    const handleToggle = (newState: number) => {
        if (selectedFloorPlan) {
            setSelectedFloorPlan({
                ...selectedFloorPlan,
                is_active: newState,
            });
        }
    };

    useEffect(() => {
        if (floorPlanId) {
            const floorplan = floor_plans.find(
                (floor_plans) => String(floor_plans.id) === floorPlanId
            );
            if (floorplan) {
                setSelectedFloorPlan({
                    id: floorplan.id,
                    building: floorplan.building,
                    floor: floorplan.floor,
                    floor_plan_map: floorplan.floor_plan_map,
                    rectangles: floorplan.rectangles,
                    is_active: floorplan.is_active,
                });
            } else {
                setSelectedFloorPlan(null);
            }
        }
    }, [floorPlanId, floor_plans]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl font-semibold leading-tight justify-center items-center flex bg-muted/50 p-4 rounded-lg mb-3">
                    Edit Floor Plan
                    <BsBuildingFillGear fontSize="x-large" className="ml-2" />
                </h2>
            }
        >
            <Head title="Room Management" />

            <Toaster position="top-right" />

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-1/2 mx-auto">
                    {/* Select Building */}
                    <div className="mb-5">
                        <Label htmlFor="building_id" className="block mb-2">
                            Select Building
                        </Label>
                        <SelectBuilding
                            id={"building_id"}
                            building={buildings}
                            value={building || ""}
                            onChange={(value) => {
                                setBuilding(value);
                            }}
                            disabled={isEditable}
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
                            onChange={(value) => {
                                setFloor(value);
                            }}
                            disabled={isEditable}
                        />
                    </div>

                    {/* Active Inactive */}
                    <div className="flex justify-normal">
                        {selectedFloorPlan && (
                            <ToggleActiveFloorPlan
                                selectedFloorPlan={selectedFloorPlan}
                                onToggle={handleToggle}
                                userTheme={userTheme}
                                systemTheme={systemTheme}
                            />
                        )}
                    </div>
                </div>
            </div>

            {selectedFloorPlan && (
                <div className="mt-6">
                    <EditFloorPlan
                        floor_plans={[selectedFloorPlan]}
                        isEditable={isEditable}
                        handleEdit={handleEdit}
                        handleCancel={handleCancel}
                        academic_programs={academic_programs}
                        userTheme={userTheme}
                        systemTheme={systemTheme}
                        //onSelectRoom={(roomId) => console.log(`Room selected: ${roomId}`)} unused
                    />
                </div>
            )}

            {selectedFloorPlan && (
                <div className="w-full max-w-[1280px] mx-auto p-2 rounded-lg shadow-md">
                    <p className="font-medium">Legend:</p>
                    <p></p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                            <p>Faculty Room</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                            <p>Lecture Room</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 mr-2"></div>
                            <p>Laboratory Room</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-500 mr-2"></div>
                            <p>Custom Room (User-Defined)</p>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
