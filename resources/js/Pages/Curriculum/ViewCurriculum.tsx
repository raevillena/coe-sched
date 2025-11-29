import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { CurriculumProps } from "@/types/my_types";
import debounce from "lodash.debounce";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { CopyPlus, Eye, SquarePen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    toast_error,
    toast_info,
    toast_style_promise,
} from "@/types/my_types/mytoast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { ViewCurriculumSelectYear } from "@/Components/CustomizedComponents/curriculum/select_curriculum_year";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "react-hot-toast";
import useTour from "@/Composables/useTour";

export default function ViewCurriculum({
    auth,
    curriculums,
    program_name,
    program_code,
    breadcrumbs,
}: CurriculumProps) {
    const userRole = auth?.user?.role;
    const userDepartmentId = auth?.user?.department_id;
    const userTheme = auth?.user?.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const [userProgramCode, setUserProgramCode] = useState<string>("");

    // unique curriculum years
    const unique_c_y = Array.from(
        new Set(curriculums.map((curriculum) => curriculum.curriculum_year))
    ).map(Number);

    //sort years tapno haan pangit kitan, nawara nu haan agsasaruno
    unique_c_y.sort((a, b) => b - a);

    useEffect(() => {
        const fetchUserDepartment = async () => {
            try {
                const response = await axios.get(
                    route("sections.getProgramCode", {
                        id: auth?.user?.department_id,
                    })
                );
                setUserProgramCode(response.data.program_code);
            } catch (error) {
                console.error("Error fetching user department:", error);
            }
        };

        fetchUserDepartment();
    }, [userDepartmentId]);

    //duplicate curriculum for new school year
    const [curriculumYear, setCurriculumYear] = useState<string>("");
    const [newCurriculumYear, setNewCurriculumYear] = useState<string>("");
    const [confirmNewCurriculumYear, setConfirmNewCurriculumYear] =
        useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleBlur = useCallback(
        debounce((value) => {
            if (value.length !== 4) {
                toast_info({
                    message:
                        "Please enter exactly 4 digits for the curriculum year.",
                    userTheme: userTheme,
                });
            }
        }, 500),
        []
    );

    const submit = () => {
        setIsSubmitting(true);

        toast
            .promise(
                axios.post(
                    route("curriculum.duplicate"),
                    {
                        program_code,
                        curriculumYear,
                        newCurriculumYear,
                    },
                    {
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    }
                ),
                {
                    loading: "Duplicating curriculum...",
                    success: () => (
                        <span>Curriculum duplicated successfully!</span>
                    ),
                    error: (error) => {
                        if (error.response && error.response.status === 400) {
                            return <span>Curriculum already exists.</span>;
                        }
                        return (
                            <span>
                                Could not duplicate curriculum. Please try again
                                later.
                            </span>
                        );
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then((response) => {
                router.reload(response.request.responseURL);
                setIsSubmitting(false);
                setIsDialogOpen(false);
            })
            .catch((error) => {
                console.error("Errors:", error);
                // toast_error({
                //     message: "An error has occurred",
                //     userTheme: userTheme,
                // });
            })
            .finally(() => {
                setIsSubmitting(false);
                setIsDialogOpen(false);
            });
    };

    useTour({
        user: auth.user,
        name: "showViewCurriculumTour",
        steps: () => [
            {
                intro: `📊 <b>Curriculum Overview</b><br>  
                        Get a structured view of all <b>academic programs</b>, organized by <i>academic years</i> (e.g., <b>2025-2026</b>). This table helps you navigate and manage curriculums efficiently.`,
                element: document.querySelector(
                    "#curriculum-view-table"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📋 <b>Subject List</b><br>  
                        Click to view the complete list of <b>subjects</b> within the selected curriculum. This ensures you have a clear overview of all courses included.`,
                element: document.querySelector("#view-button") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `✏️ <b>Edit Subject Details</b><br>  
                        Modify <b>course titles</b>, <b>descriptions</b>, and <b>statuses</b> to maintain accurate and up-to-date curriculum information.`,
                element: document.querySelector("#edit-button") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📌 <b>Duplicate Curriculum</b><br>  
                        Effortlessly <b>copy an existing curriculum</b> for a new academic year. This feature eliminates the need for manual entry and helps streamline your workflow.`,
                element: document.querySelector(
                    "#duplicate-curriculum"
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
                <h2 className="flex items-center justify-center text-2xl font-semibold text-center">
                    View Curriculum
                </h2>
            }
        >
            <Head title="View Curriculum" />
            <div className="mx-auto max-w-7xl">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="mt-3 text-xl font-semibold">
                                {program_name}
                            </h1>
                        </div>
                        <div className="mt-2 mb-5 lg:mt-0">
                            {/* duplicate old curriculum */}
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        className="flex"
                                        id="duplicate-curriculum"
                                    >
                                        <CopyPlus className="lg:mr-1" />
                                        Duplicate Curriculum.
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[90%] lg:w-full">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Duplicate Curriculum.
                                        </DialogTitle>
                                        <DialogDescription>
                                            Copy the curriculum to the new one.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="">
                                        <ViewCurriculumSelectYear
                                            id="view_curriculum_year"
                                            program_code={program_code}
                                            value={curriculumYear}
                                            onChange={(value) => {
                                                setCurriculumYear(value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>New Curriculum</Label>
                                        <Input
                                            disabled={!curriculumYear}
                                            id="new_curriculum_year"
                                            className="w-full"
                                            type="text"
                                            placeholder="2025"
                                            value={newCurriculumYear}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d{0,4}$/.test(value)) {
                                                    setNewCurriculumYear(value);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                handleBlur(e.target.value);
                                            }}
                                        />
                                    </div>
                                    {curriculumYear && newCurriculumYear && (
                                        <div>
                                            <Label>
                                                Confirm New Curriculum
                                            </Label>
                                            <Input
                                                id="confirm_new_curriculum_year"
                                                className="w-full"
                                                type="text"
                                                placeholder="2025"
                                                value={confirmNewCurriculumYear}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    if (
                                                        /^\d{0,4}$/.test(value)
                                                    ) {
                                                        setConfirmNewCurriculumYear(
                                                            value
                                                        );
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    handleBlur(e.target.value);
                                                }}
                                            />
                                            <p className="p-2 text-xs text-gray-400">
                                                Note: Please confirm before
                                                duplicating the curriculum. Once
                                                duplicated, it cannot be
                                                completely removed.
                                            </p>
                                            <p className="p-2 text-xs text-gray-400">
                                                If you encounter any issues,
                                                please contact us. -RN
                                                DevWorks💻
                                            </p>
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={
                                                isSubmitting ||
                                                newCurriculumYear !==
                                                    confirmNewCurriculumYear
                                            }
                                            onClick={submit}
                                        >
                                            Save changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            {/* end of duplicate old curriculum */}
                        </div>
                    </div>
                    <div id="curriculum-view-table">
                        <Table>
                            <TableCaption>View Curriculum Table</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Curriculum</TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {unique_c_y.length > 0 ? (
                                    unique_c_y.map((year) => (
                                        <TableRow key={year}>
                                            <TableCell>
                                                {year} - {Number(year) + 1}
                                            </TableCell>
                                            <TableCell className="flex justify-center space-x-3 text-right">
                                                <Tooltip
                                                    key={`tooltip_view_${userDepartmentId}`}
                                                >
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={route(
                                                                "curriculum.list",
                                                                {
                                                                    program_code,
                                                                    curriculum_year: `${year}-${
                                                                        Number(
                                                                            year
                                                                        ) + 1
                                                                    }`,
                                                                }
                                                            )}
                                                            className="transition duration-300 ease-in-out"
                                                        >
                                                            <Button
                                                                id="view-button"
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Eye />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip
                                                    key={`tooltip_edit_${userDepartmentId}`}
                                                >
                                                    <TooltipTrigger asChild>
                                                        {userRole !== "admin" ||
                                                        program_code ===
                                                            userProgramCode ? (
                                                            <Link
                                                                href={route(
                                                                    "curriculum.edit",
                                                                    {
                                                                        program_code,
                                                                        curriculum_year: `${year}-${
                                                                            Number(
                                                                                year
                                                                            ) +
                                                                            1
                                                                        }`,
                                                                    }
                                                                )}
                                                                className="transition duration-300 ease-in-out"
                                                            >
                                                                <Button
                                                                    id="edit-button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                >
                                                                    <SquarePen />
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <Button
                                                                id="edit-button"
                                                                variant="outline"
                                                                size="icon"
                                                                disabled
                                                            >
                                                                <SquarePen />
                                                            </Button>
                                                        )}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Edit
                                                            {/* Edit Curriculum Year {year} - {Number(year) + 1} */}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={2}
                                            className="text-center text-red-600"
                                        >
                                            No curriculums found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
