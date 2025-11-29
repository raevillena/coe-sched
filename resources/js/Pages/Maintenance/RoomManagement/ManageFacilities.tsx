import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { RoomManagementProps } from "@/types/my_types";
import { BsBuildingFillGear } from "react-icons/bs";
import { BuildingManagementTabs } from "@/Components/CustomizedComponents/room_management/manage_building_tabs";
import { FloorManagementTabs } from "@/Components/CustomizedComponents/room_management/manage_floor_tabs";
import useTour from "@/Composables/useTour";

export default function RoomManageFacilities({
    auth,
    breadcrumbs,
    buildings,
    floors,
}: RoomManagementProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    useTour({
        user: auth.user,
        name: "showFacilityManagementTalk",
        steps: () => [
            {
                title: "🏢 Welcome to Facility Management!",
                intro: `Manage your <b>buildings</b> and <b>floors</b> with ease! 🏗️<br><br>  
                        🔹 Add new structures, edit details, and activate or deactivate functionalities as needed.  
                        Keep everything organized and up to date!<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
            {
                intro: `🏢 <b>Building Management</b><br>  
                        In this section, you can <b>add</b> new buildings, <b>edit</b> existing ones, and <b>manage their status</b>.`,
                element: document.querySelector(
                    "#building-management"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🏢 <b>Floor Management</b><br>  
                        Here, you can <b>add</b> or <b>edit floors</b> within a building and control their status.`,
                element: document.querySelector(
                    "#floor-management"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
        ],
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="container space-y-6 mx-auto px-4 sm:px-6 lg:px-4">
                    <h2 className="text-xl lg:text-3xl font-semibold leading-tight justify-center items-center flex bg-muted/50 p-4 rounded-lg">
                        Facility Management
                        <BsBuildingFillGear
                            fontSize="x-large"
                            className="ml-2"
                        />
                    </h2>
                </div>
            }
        >
            <Head title="Manage Room Status" />

            <div className="container mt-5 space-y-6 mx-auto px-4 sm:px-6 lg:px-4">
                {/* <div className="p-1">
                    <div className="bg-muted/50 rounded-xl p-4 mt-0">
                        <h2 className="text-2xl font-semibold flex">
                            Manage Room Status
                            <GiLockedDoor fontSize="32" className="ml-2" />
                        </h2>
                        <RoomDataTable
                            rooms={rooms.data}
                            userTheme={userTheme}
                            // academic_programs={academic_programs}
                        />
                    </div>
                </div> */}

                <div className="container mx-auto px-0">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-">
                        <div
                            className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col"
                            id="building-management"
                        >
                            <h2 className="text-center mt-2 text-lg sm:text-xl font-semibold leading-tight">
                                Building Management
                            </h2>
                            <div className="flex justify-center mt-3 mb-4">
                                <BuildingManagementTabs
                                    buildings={buildings}
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                />
                            </div>
                        </div>

                        <div
                            className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col"
                            id="floor-management"
                        >
                            <h2 className="text-center mt-2 text-lg sm:text-xl font-semibold leading-tight">
                                Floor Management
                            </h2>
                            <div className="flex justify-center mt-3 mb-4">
                                <FloorManagementTabs
                                    floors={floors}
                                    userTheme={userTheme}
                                    systemTheme={systemTheme}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
