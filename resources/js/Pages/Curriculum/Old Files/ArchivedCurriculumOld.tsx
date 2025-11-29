import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
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

import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import { ArchiveRestore } from "lucide-react";
import { ToastRestoreArchiveWarning } from "@/Components/CustomizedComponents/toast-update-warning";

export default function ArchivedCurriculum({
    auth,
    curriculums,
    program_name,
    curriculum_year,
    breadcrumbs,
}: CurriculumProps) {
    const [selectedLevel, setSelectedLevel] = useState("1st Year");
    const [updatedCurriculums, setUpdatedCurriculums] = useState(curriculums);

    const [first_sem, setFirstSem] = useState<Curriculum[]>([]);
    const [second_sem, setSecondSem] = useState<Curriculum[]>([]);

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
                router.reload();
            },
        });
    };

    useEffect(() => {
        const filteredCurriculums = updatedCurriculums.filter(
            (curriculum) => curriculum.level === selectedLevel
        );

        const updatedFirstSem = filteredCurriculums.filter((curriculum) =>
            curriculum.period.includes("1st Sem")
        );
        const updatedSecondSem = filteredCurriculums.filter((curriculum) =>
            curriculum.period.includes("2nd Sem")
        );

        setFirstSem(updatedFirstSem);
        setSecondSem(updatedSecondSem);
    }, [updatedCurriculums, selectedLevel]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-xl font-semibold leading-tight ">
                    List of Archived Curriculums
                </h2>
            }
        >
            <Head title="Edit Curriculum List" />
            <div className="mx-auto max-w-7xl">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="mt-3 text-xl font-semibold ">
                                {program_name} - {curriculum_year}
                            </h1>

                            <p className="mt-2 font-medium text-sm ">
                                1st Semester
                            </p>
                        </div>

                        <div className="ml-10">
                            <Select
                                onValueChange={handle_level_change}
                                value={selectedLevel}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Year Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Year Levels</SelectLabel>
                                        <SelectItem value="1st Year">
                                            1st Year
                                        </SelectItem>
                                        <SelectItem value="2nd Year">
                                            2nd Year
                                        </SelectItem>
                                        <SelectItem value="3rd Year">
                                            3rd Year
                                        </SelectItem>
                                        <SelectItem value="4th Year">
                                            4th Year
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Table>
                        <TableCaption>1st Semester</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Code</TableHead>
                                <TableHead>Course Description</TableHead>
                                <TableHead className="flex justify-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {first_sem.length > 0 ? (
                                first_sem.map((curriculum) => (
                                    <TableRow key={curriculum.id}>
                                        <TableCell className="w-[150px]">
                                            {curriculum.course_code}
                                        </TableCell>
                                        <TableCell className="w-[500px]">
                                            {curriculum.course_name}
                                        </TableCell>
                                        <TableCell className="flex justify-center space-x-3">
                                            <Button
                                                className="hover:bg-[#009688]"
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-red-600"
                                    >
                                        No curriculum found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-inherit">
                            <TableRow></TableRow>
                        </TableFooter>
                    </Table>

                    {/* 2nd Semester Table */}
                    <div className="sm:flex-auto">
                        <p className="mt-2 font-medium text-sm ">
                            2nd Semester
                        </p>
                    </div>
                    <Table>
                        <TableCaption>2nd Semester</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Code</TableHead>
                                <TableHead>Course Description</TableHead>
                                <TableHead className="flex justify-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {second_sem.length > 0 ? (
                                second_sem.map((curriculum) => (
                                    <TableRow key={curriculum.id}>
                                        <TableCell className="w-[150px]">
                                            {curriculum.course_code}
                                        </TableCell>
                                        <TableCell className="w-[500px]">
                                            {curriculum.course_name}
                                        </TableCell>
                                        <TableCell className="flex justify-center space-x-5">
                                            <Button
                                                className="hover:bg-red-500"
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-red-600"
                                    >
                                        No curriculum found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-inherit">
                            <TableRow></TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
