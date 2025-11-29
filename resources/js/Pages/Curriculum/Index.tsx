import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { CurriculumProps } from "@/types/my_types";
import { FileCog, FilePlus2, View } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { CurriculumIndexTable } from "@/Components/CustomizedComponents/curriculum-index-table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import useTour from "@/Composables/useTour";

export default function Index({
    auth,
    academic_programs,
    breadcrumbs,
}: CurriculumProps) {
    useTour({
        user: auth.user,
        name: "showIndexCurriculumTour",
        steps: () => [
            {
                title: "📚 Curriculum Management",
                intro: `Hello, <b>${auth?.user?.name}</b>! 👋<br><br>  
                        This page allows you to efficiently manage <b>curriculums, academic programs, and courses</b> within the institution.<br><br>  
                        Let's take a quick tour of the key features.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `📊 <b>Curriculum Index Table</b><br>  
                        This section provides a visual representation of your curriculums, including all assigned academic programs.`,
                element: document.querySelector(
                    "#curriculum-index-table"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📌 <b>Add a New Curriculum</b><br>  
                        Click this button to create a new curriculum, helping you organize and structure academic programs effectively.`,
                element: document.querySelector(
                    "#new-curriculum"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `⚙️ <b>Customize PDF Header & Footer</b><br>  
                        Modify existing PDF headers and footers to ensure consistency across all curriculum documents.`,
                element: document.querySelector(
                    "#customize_pdf"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 You're All Set!",
                intro: `That's it! You are now familiar with the <b>Curriculum Management</b> page. <br><br>  
                        <b>Feel free to explore</b> and manage curriculums with ease!<br><br>  
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
                <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
                    View Curriculum
                </h2>
            }
        >
            <Head title="View Curriculum" />
            <div>
                <div className="mx-auto max-w-7x1">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="mt-3 text-xl font-semibold ">
                                    Curricula
                                </h1>
                            </div>

                            <div className="mt-2 mb-2 lg:mb-5 lg:mt-0">
                                {/* <Tooltip key="customize_pdf">
                                    <TooltipTrigger asChild> */}
                                <Link
                                    href={route("curriculum.add")}
                                    className="flex"
                                >
                                    <Button id="new-curriculum">
                                        <FilePlus2 />
                                        New Curriculum
                                    </Button>
                                </Link>
                                {/* </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Create New Curriculum</p>
                                    </TooltipContent>
                                </Tooltip> */}
                            </div>

                            <div className="mb-5 lg:ml-3">
                                {/* <Tooltip key="customize_pdf">
                                    <TooltipTrigger asChild> */}
                                {/* <Button
                                            id="customize_pdf"
                                            onClick={() =>
                                                window.open(
                                                    route(
                                                        "customize_pdf.index"
                                                    ),
                                                    "_blank"
                                                )
                                            }
                                        >
                                            <FileCog />
                                            Customize PDF
                                        </Button> */}
                                {/* </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Customize PDF Header & Footer</p>
                                    </TooltipContent>
                                </Tooltip> */}
                            </div>
                        </div>

                        {/* table */}
                        <div id="curriculum-index-table">
                            <CurriculumIndexTable
                                academic_programs={academic_programs}
                                Icon={View}
                                routeName={"curriculum.view"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
