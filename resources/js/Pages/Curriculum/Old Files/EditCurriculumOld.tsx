import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
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

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useEffect, useState } from "react";
import { Archive, FilePenLine, FileX2 } from "lucide-react";
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
}: CurriculumProps) {
    const userTheme = auth?.user.theme;
    const [selectedLevel, setSelectedLevel] = useState("1st Year");
    const [isEditing, setIsEditing] = useState(false);
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

    const handleEdit = (curriculum: Curriculum) => {
        setData(curriculum);
        setIsEditing(true);
    };

    const handleArchive = (id: number) => {
        // console.log(`Delete curriculum with ID: ${id}`);
        // ToastDeleteWarning({
        //     auth,
        //     question: "Are you sure you want to delete this curriculum?",
        //     routeName: "curriculum.destroy",
        //     params: { curriculum: id },
        //     successMessage: "Curriculum deleted successfully",
        //     errorMessage: "Failed to delete curriculum.",
        //     onDeleteSuccess: () => {
        //         setUpdatedCurriculums((prev) => {
        //             const filtered = prev.filter((curriculum) => curriculum.id !== id);
        //             return filtered;
        //         });
        //     },
        // });
        ToastArchiveWarning({
            auth,
            question: "Are you sure you want to archive this curriculum?",
            routeName: "curriculum.archive",
            params: { curriculum: id },
            successMessage: "Curriculum archived successfully.",
            errorMessage: "Failed to archive curriculum.",
            onArchiveSuccess: () => {
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

    const submit = () => {
        // console.log("Submitting data:", data);
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

                const updatedList = curriculums.map((curriculum) =>
                    curriculum.id === data.id
                        ? { ...curriculum, ...data }
                        : curriculum
                );
                setUpdatedCurriculums(updatedList);
            })
            .catch((error) => {
                toast_error({
                    message: "An error has occurred.",
                    userTheme: userTheme,
                });
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-xl font-semibold leading-tight ">
                    List of Curriculum
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

                        <div className="ml-5">
                            <Button>
                                <Link
                                    href={route("curriculum.edit_archived", {
                                        program_code: program_code,
                                        curriculum_year: curriculum_year,
                                    })}
                                    className="flex"
                                >
                                    <Archive className="mr-1" />
                                    Archived Curriculum
                                </Link>
                            </Button>
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
                                                className="hover:bg-green-500"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(curriculum)
                                                }
                                            >
                                                <FilePenLine />
                                            </Button>
                                            <Button
                                                className="hover:bg-[#f9c79f]"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleArchive(curriculum.id)
                                                }
                                            >
                                                <Archive />
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
                                                className="hover:bg-green-500"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(curriculum)
                                                }
                                            >
                                                <FilePenLine />
                                            </Button>
                                            <Button
                                                className="hover:bg-[#f9c79f]"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleArchive(curriculum.id)
                                                }
                                            >
                                                <Archive />
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="curriculum_year"
                                        className="text-right"
                                    >
                                        Year
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="period"
                                        className="text-right"
                                    >
                                        Period
                                    </Label>
                                    <Select
                                        // id="period"
                                        name="period"
                                        value={data.period ?? ""}
                                        onValueChange={(value) =>
                                            setData("period", String(value))
                                        }
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1st Semester">
                                                1st Semester
                                            </SelectItem>
                                            <SelectItem value="2nd Semester">
                                                2nd Semester
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* level */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="level"
                                        className="text-right"
                                    >
                                        Level
                                    </Label>
                                    <Select
                                        // id="level"
                                        name="level"
                                        value={data.level ?? ""}
                                        onValueChange={(value) =>
                                            setData("level", String(value))
                                        }
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* course_code */}
                                <div className="grid grid-cols-4 items-center gap-4">
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
                                <div className="grid grid-cols-4 items-center gap-4">
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
                                <div className="grid grid-cols-4 items-center gap-4">
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
                                            if (/^[0-9]$/.test(value)) {
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
                                <div className="grid grid-cols-4 items-center gap-4">
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
                                            if (/^[0-9]$/.test(value)) {
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
                                <div className="grid grid-cols-4 items-center gap-4">
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
                                <div className="grid grid-cols-4 items-center gap-4">
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="is_complab"
                                        className="text-right"
                                    >
                                        Complab
                                    </Label>
                                    <Select
                                        // id="is_complab"
                                        name="is_complab"
                                        value={data.is_complab ? "1" : "0"}
                                        onValueChange={(value) =>
                                            setData("is_complab", value == "1")
                                        }
                                    >
                                        <SelectTrigger className="w-[85px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                Yes
                                            </SelectItem>
                                            <SelectItem value="0">
                                                No
                                            </SelectItem>
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
