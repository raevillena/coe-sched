import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { RoomManagementProps } from "@/types/my_types";
import { RiFunctionAddFill } from "react-icons/ri";
import { Button } from "@/Components/ui/button";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import { FaMapMarkedAlt } from "react-icons/fa";
import { BsBuildingFillGear } from "react-icons/bs";
import { PreviewFloorPlan } from "@/Components/CustomizedComponents/room_management/preview_floor_plan";
import { MdEditLocationAlt } from "react-icons/md";
import useTour from "@/Composables/useTour";

export default function RoomManagement({
    auth,
    breadcrumbs,
    floor_plans,
}: RoomManagementProps) {
    useTour({
        user: auth.user,
        name: "showRoomManagementTour",
        steps: () => [
            {
                title: "🏢 Room Management",
                intro: `Hello, <b>${auth?.user?.name}</b>! 👋<br><br>  
                        This page allows you to efficiently manage <b>rooms, floor plans, and facilities</b> within the College of Engineering.<br><br>  
                        Let’s take a quick tour of the key features.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `📌 <b>Add a New Floor Plan</b><br>  
                        Click this button to create a new floor plan, helping you organize and allocate rooms effectively.`,
                element: document.querySelector(
                    "#new-floor-plan"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `✏️ <b>Edit Floor Plan</b><br>  
                        Modify existing floor plans to update room arrangements and improve space allocation.`,
                element: document.querySelector(
                    "#edit-floor-plan"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🏗️ <b>Manage Facilities</b><br>  
                        Here, you can <b>add buildings</b>, <b>create floors</b>, and <b>edit structures</b> to ensure efficient space utilization.`,
                element: document.querySelector(
                    "#manage-facilities"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🗺️ <b>Interactive Floor Plan</b><br>  
                        This section provides a visual representation of your floor plan, including all assigned rooms.`,
                element: document.querySelector(
                    "#preview-floor-plan"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 You're All Set!",
                intro: `That's it! You are now familiar with the <b>Room Management</b> page. <br><br>  
                        <b>Feel free to explore</b> and manage rooms with ease!<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="container mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                        <h2 className="text-xl lg:text-3xl font-semibold text-center flex items-center justify-center">
                            Room Management
                            <RoomPreferencesIcon
                                fontSize="large"
                                className="ml-2"
                            />
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Room Management" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-4s">
                {/* buttons */}
                <div className="mt-5 flex justify-center items-center">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* add floor plan button */}
                        <div className="flex justify-center">
                            <Link
                                href={route("room_management.add_floor_plan")}
                                // target="_blank"
                                // rel="noopener noreferrer"
                                className="flex items-center justify-center"
                            >
                                <Button
                                    className="w-full lg:w-[175px]"
                                    id="new-floor-plan"
                                >
                                    <FaMapMarkedAlt />
                                    Add Floor Plan
                                </Button>
                            </Link>
                        </div>

                        <div className="flex justify-center">
                            <Link
                                href={route("room_management.edit_floor_plan")}
                                // target="_blank"
                                // rel="noopener noreferrer"
                                className="flex items-center justify-center"
                            >
                                <Button
                                    className="w-full lg:w-[175px]"
                                    id="edit-floor-plan"
                                >
                                    <MdEditLocationAlt />
                                    Edit Floor Plan
                                </Button>
                            </Link>
                        </div>

                        {/* manage facilities button */}
                        <div className="flex justify-center">
                            <Link
                                href={route(
                                    "room_management.manage_facilities"
                                )}
                                className="flex items-center justify-center"
                            >
                                <Button
                                    className="w-full lg:w-[175px]"
                                    id="manage-facilities"
                                    variant="outline"
                                >
                                    <BsBuildingFillGear />
                                    Manage Facilities
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* floor plan with indicated rooms */}
                <div
                    className="bg-muted/50 p-4 rounded-xl mt-8 overflow-hidden"
                    id="preview-floor-plan"
                >
                    <h2 className="text-2xl font-semibold mb-4 flex justify-center items-center">
                        Floor Plan
                    </h2>
                    <div>
                        <PreviewFloorPlan floor_plans={floor_plans} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
