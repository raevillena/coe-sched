import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import { ArchiveRestore } from "lucide-react";
import { ToastRestoreArchiveWarning } from "@/Components/CustomizedComponents/toast-update-warning";

export default function ArchivedCurriculum({
    auth,
    curriculums,
    program_name,
    curriculum_year,
    periods,
    breadcrumbs,
    levels,
}: CurriculumProps) {
    const levelsArray = Array.isArray(levels) ? levels : levels.data || [];
    const [selectedLevel, setSelectedLevel] = useState(
        levelsArray.length > 0 ? levelsArray[0].level_name : "1st Year"
    );
    const [updatedCurriculums, setUpdatedCurriculums] = useState(curriculums);
    const [filteredCurriculums, setFilteredCurriculums] = useState(curriculums);

    const handle_level_change = (newLevel: string) => {
        setSelectedLevel(newLevel);
    };

    const handleRestoreArchive = (id: number) => {
        ToastRestoreArchiveWarning({
            auth,
            question: "Are you sure you want to unarchive this curriculum?",
            routeName: "curriculum.archive",
            params: { curriculum: id },
            successMessage: "Curriculum unarchived successfully.",
            errorMessage: "Failed to unarchive curriculum.",
            onRestoreArchiveSuccess: () => {
                setUpdatedCurriculums((prev) => {
                    const filtered = prev.filter(
                        (curriculum) => curriculum.id !== id
                    );
                    return filtered;
                });
            },
        });
    };

    useEffect(() => {
        const filtered = updatedCurriculums.filter(
            (curriculum) => curriculum.level === selectedLevel
        );
        setFilteredCurriculums(filtered);
    }, [updatedCurriculums, selectedLevel]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
                    List of Archived Curriculum
                </h2>
            }
        >
            <Head title="Archived Curriculum" />
            <div className="mx-auto max-w-7xl">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="mt-3 text-xl font-semibold ">
                                {program_name} - {curriculum_year}
                            </h1>
                        </div>

                        <div className="ml-0 mt-4 lg:mt-0 lg:ml-10">
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
                                filteredCurriculums.filter((curriculum) =>
                                    curriculum.period.includes(
                                        period.period_name
                                    )
                                );

                            return (
                                <div
                                    key={period.id}
                                    className="sm:flex-auto mt-5"
                                >
                                    <p className="mt-2 font-medium text-sm">
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
                                                                    key={`tooltip_unarchive_course_${curriculum.id}`}
                                                                >
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            className="hover:bg-[#009688] transition duration-300 ease-in-out"
                                                                            variant="outline"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                handleRestoreArchive(
                                                                                    curriculum.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <ArchiveRestore />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            <span
                                                                                style={{
                                                                                    color: "#009688",
                                                                                }}
                                                                            >
                                                                                Unarchive
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
                                                        colSpan={8}
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
            </div>
        </AuthenticatedLayout>
    );
}
