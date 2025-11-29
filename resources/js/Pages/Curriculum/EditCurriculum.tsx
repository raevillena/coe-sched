import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { CurriculumProps, Curriculum } from "@/types/my_types";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/Components/ui/sheet";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import useTour from "@/Composables/useTour";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useState } from "react";
import { Archive, FilePenLine } from "lucide-react";
import axios from "axios";
import { toast_error, toast_success } from "@/types/my_types/mytoast";
import { ToastArchiveWarning } from "@/Components/CustomizedComponents/toast-update-warning";

export default function EditCurriculum({
    auth,
    curriculums,
    program_name,
    curriculum_year,
    breadcrumbs,
    program_code,
    periods,
    levels,
}: CurriculumProps) {
    const userTheme = auth?.user.theme;
    const levelsArray = Array.isArray(levels) ? levels : levels.data || [];
    const [selectedLevel, setSelectedLevel] = useState(
        levelsArray.length > 0 ? levelsArray[0].level_name : "1st Year"
    );
    const [isEditing, setIsEditing] = useState(false);
    const [updatedCurriculums, setUpdatedCurriculums] = useState(curriculums);

    useTour({
        user: auth.user,
        name: "showEditCurriculumListTour",
        steps: () => [
            {
                intro: `✏️ <b>Edit Subject</b><br>  
                            Click this button to <b>modify subject details</b>, such as course code, units, and pre-requisite.`,
                element: document.querySelector(
                    "#edit-subject-button"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📁 <b>Archive Subject</b><br>  
                            Use this button to <b>move a subject to the archive</b>. This is useful for keeping inactive or outdated subjects separate from active ones.`,
                element: document.querySelector(
                    "#archive-button"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📜 <b>View Archived Subjects</b><br>  
                            Click here to <b>review all archived subjects</b>. You can restore subjects if needed or keep track of previous course structures.`,
                element: document.querySelector(
                    "#check-archived-selection"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
        ],
    });

    // capture the original curriculum year for comparison later.
    const originalCurriculumYear = curriculums[0]?.curriculum_year || 0;
    const { data, setData, post, processing } = useForm<Curriculum>({
        id: curriculums.length > 0 ? curriculums[0].id : 0,
        curriculum_year:
            curriculums.length > 0 ? curriculums[0].curriculum_year : 0,
        period: curriculums.length > 0 ? curriculums[0].period : "",
        level: curriculums.length > 0 ? curriculums[0].level : "",
        control_code: curriculums.length > 0 ? curriculums[0].control_code : "",
        course_code: curriculums.length > 0 ? curriculums[0].course_code : "",
        course_name: curriculums.length > 0 ? curriculums[0].course_name : "",
        lec: curriculums.length > 0 ? curriculums[0].lec : 0,
        lab: curriculums.length > 0 ? curriculums[0].lab : 0,
        units: curriculums.length > 0 ? curriculums[0].units : 0,
        pre_reqs: curriculums.length > 0 ? curriculums[0].pre_reqs : "",
        is_complab: curriculums.length > 0 ? curriculums[0].is_complab : false,
        program_code: "",
        program_name: "",
    });

    const handle_level_change = (newLevel: string) => {
        setSelectedLevel(newLevel);
    };

    const handleEdit = (curriculum: Curriculum) => {
        setData(curriculum);
        setIsEditing(true);
    };

    const filtered_curriculums = updatedCurriculums.filter(
        (curriculum) => curriculum.level === selectedLevel
    );

    const submit = () => {
        axios
            .post(
                route("curriculum.update", {
                    curriculum: data.id,
                    curriculum_year: data.curriculum_year,
                    program_code: data.program_code,
                }),
                {
                    ...data,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                }
            )
            .then((response) => {
                toast_success({
                    message: "Curriculum updated successfully.",
                    userTheme: userTheme,
                });

                const updatedCurriculum = response.data.curriculum;

                // If the curriculum year was edited, redirect to curriculum.view
                if (
                    updatedCurriculum.curriculum_year !== originalCurriculumYear
                ) {
                    router.visit(
                        route("curriculum.view", {
                            program_code: program_code,
                            curriculum_year: updatedCurriculum.curriculum_year,
                        })
                    );
                    return;
                }

                const updatedList = updatedCurriculums.map((curriculum) =>
                    curriculum.id === updatedCurriculum.id
                        ? updatedCurriculum
                        : curriculum
                );
                setUpdatedCurriculums(updatedList);
                setIsEditing(false);
            })
            .catch((error) => {
                toast_error({
                    message: "An error has occurred.",
                    userTheme: userTheme,
                });
            });
    };

    const handleArchive = (id: number) => {
        ToastArchiveWarning({
            auth,
            question: "Are you sure you want to archive this curriculum?",
            routeName: "curriculum.archive",
            params: { curriculum: id },
            successMessage: "Curriculum archived successfully.",
            errorMessage: "Failed to archive curriculum.",
            onArchiveSuccess: () => {
                setUpdatedCurriculums((prev) => {
                    return prev.filter((curriculum) => curriculum.id !== id);
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="flex items-center justify-center text-2xl font-semibold text-center">
                    Edit Curriculum
                </h2>
            }
        >
            <Head title="Edit Curriculum" />
            <div className="mx-auto max-w-7xl">
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="mt-0 text-xl font-semibold lg:mt-3">
                                {program_name} - {curriculum_year}
                            </h1>
                        </div>

                        <div className="mt-4 lg:mt-0">
                            <Link
                                href={route("curriculum.edit_archived", {
                                    program_code: program_code,
                                    curriculum_year: curriculum_year,
                                })}
                                className="flex"
                            >
                                <Button id="check-archived-selection">
                                    <Archive />
                                    Archived Course
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-4 ml-0 lg:ml-10 lg:mt-0">
                            <Select
                                onValueChange={handle_level_change}
                                value={selectedLevel}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Year Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Select Year Level
                                        </SelectLabel>
                                        {levelsArray.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.level_name}
                                            >
                                                {item.level_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {periods.data
                        .filter((period) => period.is_active)
                        .map((period) => {
                            const period_curriculums =
                                filtered_curriculums.filter((curriculum) =>
                                    curriculum.period.includes(
                                        period.period_name
                                    )
                                );

                            return (
                                <div
                                    key={period.id}
                                    className="mt-5 sm:flex-auto"
                                >
                                    <p className="mt-2 text-sm font-medium">
                                        {period.period_name}
                                    </p>
                                    <Table>
                                        <TableCaption>
                                            {period.period_name}
                                        </TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Course Code
                                                </TableHead>
                                                <TableHead>
                                                    Course Description
                                                </TableHead>
                                                <TableHead className="flex justify-center">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {period_curriculums.length > 0 ? (
                                                period_curriculums.map(
                                                    (curriculum) => (
                                                        <TableRow
                                                            key={curriculum.id}
                                                        >
                                                            <TableCell className="w-[150px]">
                                                                {
                                                                    curriculum.course_code
                                                                }
                                                            </TableCell>
                                                            <TableCell className="w-[500px]">
                                                                {
                                                                    curriculum.course_name
                                                                }
                                                            </TableCell>
                                                            <TableCell className="flex justify-center space-x-3">
                                                                <Tooltip
                                                                    key={`tooltip_edit_course_${curriculum.id}`}
                                                                >
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            id="edit-subject-button"
                                                                            className="transition duration-300 ease-in-out hover:bg-green-500"
                                                                            variant="outline"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                handleEdit(
                                                                                    curriculum
                                                                                )
                                                                            }
                                                                        >
                                                                            <FilePenLine />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            <span
                                                                                style={{
                                                                                    color: "#22C55E",
                                                                                }}
                                                                            >
                                                                                Edit
                                                                            </span>{" "}
                                                                            Course:{" "}
                                                                            {
                                                                                curriculum.course_code
                                                                            }
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>

                                                                <Tooltip
                                                                    key={`tooltip_archive_course_${curriculum.id}`}
                                                                >
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            id="archive-button"
                                                                            className="hover:bg-[#f9c79f] transition duration-300 ease-in-out"
                                                                            variant="outline"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                handleArchive(
                                                                                    curriculum.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <Archive />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            <span
                                                                                style={{
                                                                                    color: "#f9c79f",
                                                                                }}
                                                                            >
                                                                                Archive
                                                                            </span>{" "}
                                                                            Course:{" "}
                                                                            {
                                                                                curriculum.course_code
                                                                            }
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        className="text-center text-red-600"
                                                    >
                                                        No data found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                        <TableFooter className="bg-inherit">
                                            <TableRow></TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            );
                        })}
                </div>

                {/* Edit Modal */}
                {isEditing && data && (
                    <Sheet open={isEditing} onOpenChange={setIsEditing}>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Edit Curriculum</SheetTitle>
                                <SheetDescription>
                                    Edit the subject details here. Click save
                                    when finished.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                {/* curriculum year */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="curriculum_year"
                                        className="text-right"
                                    >
                                        Curriculum
                                    </Label>
                                    <Input
                                        id="curriculum_year"
                                        className="col-span-3"
                                        type="text"
                                        value={data.curriculum_year ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,4}$/.test(value)) {
                                                setData(
                                                    "curriculum_year",
                                                    Number(value)
                                                );
                                            }
                                        }}
                                    />
                                </div>

                                {/* period */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="period_id"
                                        className="text-right"
                                    >
                                        Semester
                                    </Label>

                                    <Select
                                        name="period"
                                        value={data.period ?? ""}
                                        onValueChange={(value) =>
                                            setData("period", String(value))
                                        }
                                    >
                                        <SelectTrigger
                                            id="period_id"
                                            className="w-[140px]"
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Semesters
                                                </SelectLabel>
                                                {periods.data.map((item) => (
                                                    <SelectItem
                                                        value={item.period_name}
                                                        key={item.id}
                                                    >
                                                        {item.period_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* level */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="level_id"
                                        className="text-right"
                                    >
                                        Year Levels
                                    </Label>
                                    <Select
                                        name="level"
                                        value={data.level ?? ""}
                                        onValueChange={(value) =>
                                            setData("level", String(value))
                                        }
                                    >
                                        <SelectTrigger
                                            id="level_id"
                                            className="w-[140px]"
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Year Levels
                                                </SelectLabel>
                                                {levelsArray.map((item) => (
                                                    <SelectItem
                                                        value={item.level_name}
                                                        key={item.id}
                                                    >
                                                        {item.level_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* course_code */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="course_code"
                                        className="text-right"
                                    >
                                        Course Code
                                    </Label>
                                    <Input
                                        id="course_code"
                                        className="col-span-3"
                                        type="text"
                                        value={data.course_code ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData({
                                                ...data,
                                                course_code: value,
                                                control_code: value,
                                            });
                                        }}
                                    />
                                </div>

                                {/* course_name */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="course_name"
                                        className="text-right"
                                    >
                                        Course Description
                                    </Label>
                                    <Input
                                        id="course_name"
                                        className="col-span-3"
                                        type="text"
                                        value={data.course_name ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData("course_name", value);
                                        }}
                                    />
                                </div>

                                {/* lec */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label htmlFor="lec" className="text-right">
                                        Lec
                                    </Label>
                                    <Input
                                        id="lec"
                                        className="col-span-3"
                                        type="number"
                                        value={data.lec ?? 0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[0-9]*$/.test(value)) {
                                                const lecValue = Number(value);
                                                setData({
                                                    ...data,
                                                    lec: lecValue,
                                                    units:
                                                        lecValue +
                                                        (data.lab ?? 0),
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                {/* lab */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label htmlFor="lab" className="text-right">
                                        Lab
                                    </Label>
                                    <Input
                                        id="lab"
                                        className="col-span-3"
                                        type="number"
                                        value={data.lab ?? 0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[0-9]*$/.test(value)) {
                                                const labValue = Number(value);
                                                setData({
                                                    ...data,
                                                    lab: labValue,
                                                    units:
                                                        (data.lec ?? 0) +
                                                        labValue,
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                {/* units */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="units"
                                        className="text-right"
                                    >
                                        Units
                                    </Label>
                                    <Input
                                        id="units"
                                        className="col-span-3"
                                        type="number"
                                        value={data.units ?? 0}
                                        readOnly
                                    />
                                </div>

                                {/* pre_reqs */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="pre_reqs"
                                        className="text-right"
                                    >
                                        Pre-requisite/s
                                    </Label>
                                    <Input
                                        id="pre_reqs"
                                        className="col-span-3"
                                        type="text"
                                        value={data.pre_reqs ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData("pre_reqs", value);
                                        }}
                                    />
                                </div>

                                {/* is_complab */}
                                <div className="grid items-center grid-cols-4 gap-4">
                                    <Label
                                        htmlFor="is_complab_id"
                                        className="text-right"
                                    >
                                        Complab
                                    </Label>
                                    <Select
                                        name="is_complab"
                                        value={data.is_complab ? "1" : "0"}
                                        onValueChange={(value) =>
                                            setData("is_complab", value === "1")
                                        }
                                    >
                                        <SelectTrigger
                                            id="is_complab_id"
                                            className="w-[85px]"
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Complab
                                                </SelectLabel>
                                                <SelectItem value="1">
                                                    Yes
                                                </SelectItem>
                                                <SelectItem value="0">
                                                    No
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button
                                        onClick={submit}
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Save changes
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
