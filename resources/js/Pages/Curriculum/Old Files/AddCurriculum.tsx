import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import { CurriculumProps, Curriculum } from "@/types/my_types";
import { FilePlus2 } from "lucide-react";
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
    SelectTrigger,
    SelectValue,
    SelectLabel,
} from "@/Components/ui/select";

import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { CircleCheck, SquarePlus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    toast_error,
    toast_info,
    toast_style_promise,
} from "@/types/my_types/mytoast";

export default function AddCurriculum({
    auth,
    academic_programs,
    breadcrumbs,
    periods,
    levels,
}: CurriculumProps) {
    const userRole = auth?.user?.role;
    const userDepartmentId = auth?.user?.department_id;

    const programcodesArray = Array.isArray(academic_programs)
        ? academic_programs
        : academic_programs.data || [];

    const filteredDepartments =
        userRole === "admin"
            ? programcodesArray.filter(
                  (department) => department.id === userDepartmentId
              )
            : programcodesArray;

    const periodsArray = Array.isArray(periods) ? periods : periods.data || [];

    const levelsArray = Array.isArray(levels) ? levels : levels.data || [];

    const { setData } = useForm({
        rows: [] as Curriculum[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialRowData = {
        id: 0,
        curriculum_year: 0,
        period: "",
        level: "",
        program_code: "",
        program_name: "",
        control_code: "",
        course_code: "",
        course_name: "",
        lec: 0,
        lab: 0,
        units: 0,
        is_complab: false,
        pre_reqs: "",
    };

    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const [rows, setRows] = useState<Curriculum[]>([initialRowData]);

    const addRow = () => {
        if (validateCurrentRow(rows[rows.length - 1])) {
            setRows((prevRows) => [...prevRows, { ...initialRowData }]);
        } else {
            toast_error({
                message:
                    "Please fill in the required fields before adding a new row.",
                userTheme: userTheme,
            });
        }
    };

    const deleteRow = (index: number) => {
        setRows((prevRows) => prevRows.filter((_, i) => i !== index));
    };

    const updateRow = (
        index: number,
        field: keyof Curriculum,
        value: string
    ) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            const updatedRow = { ...updatedRows[index], [field]: value };

            if (field === "lec" || field === "lab") {
                const lec =
                    field === "lec"
                        ? Number(value)
                        : Number(updatedRow.lec || 0);
                const lab =
                    field === "lab"
                        ? Number(value)
                        : Number(updatedRow.lab || 0);
                updatedRow.units = lec + lab;
            }

            updatedRows[index] = updatedRow;
            return updatedRows;
        });
    };

    const validateCurrentRow = (row: Curriculum) => {
        return (
            row.curriculum_year &&
            row.period &&
            row.level &&
            row.program_code &&
            row.course_code &&
            row.course_name &&
            row.lec &&
            row.lab &&
            row.units &&
            row.is_complab
        );
    };

    //submit
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        if (rows.every(validateCurrentRow)) {
            setData({ rows });

            toast
                .promise(
                    axios.post(
                        route("curriculum.store"),
                        { rows },
                        {
                            headers: {
                                "X-Requested-With": "XMLHttpRequest",
                            },
                        }
                    ),
                    {
                        loading: "Saving curriculum...",
                        success: () => (
                            <span>Curriculum created successfully!</span>
                        ),
                        error: (
                            <span>
                                Could not create curriculum. Please try again
                                later.
                            </span>
                        ),
                    },
                    {
                        style: toast_style_promise({ userTheme, systemTheme }),
                    }
                )
                .then((response) => {
                    router.visit(response.request.responseURL);
                    setIsSubmitting(false);
                })
                .catch((error) => {
                    console.error("Errors:", error);
                    toast_error({
                        message: "An error has occured",
                        userTheme: userTheme,
                    });
                });
        } else {
            toast_error({
                message: "Please fill in all required fields..",
                userTheme: userTheme,
            });
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="flex items-center justify-center text-2xl font-semibold text-center">
                    Add Curriculum
                    <FilePlus2 fontSize="36" className="ml-2" />
                </h2>
            }
        >
            <Head title="Add Curriculum" />
            <div className="">
                <div className="mx-auto max-w-8xl">
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        <form onSubmit={submit}>
                            <Table>
                                <TableCaption>
                                    Add Curriculum Table
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Curriculum</TableHead>
                                        <TableHead>Semester</TableHead>
                                        <TableHead>Year Level</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Course Code</TableHead>
                                        <TableHead>Course Name</TableHead>
                                        <TableHead>Lec</TableHead>
                                        <TableHead>Lab</TableHead>
                                        <TableHead>Units</TableHead>
                                        <TableHead>Pre-requisite/s</TableHead>
                                        <TableHead>Complab</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {index === 0 ? (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        onClick={addRow}
                                                    >
                                                        <SquarePlus
                                                            size={32}
                                                            color="#1fd655"
                                                            strokeWidth={2.5}
                                                        />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="icon"
                                                        onClick={() =>
                                                            deleteRow(index)
                                                        }
                                                    >
                                                        <Trash2
                                                            size={32}
                                                            color="#ff0000"
                                                            strokeWidth={2.5}
                                                        />
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    id="curriculum_year"
                                                    className="w-[90px]"
                                                    type="text"
                                                    placeholder="2025"
                                                    value={
                                                        row.curriculum_year ===
                                                        0
                                                            ? ""
                                                            : row.curriculum_year
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        //4 digits lang
                                                        if (
                                                            /^\d{0,4}$/.test(
                                                                value
                                                            )
                                                        ) {
                                                            updateRow(
                                                                index,
                                                                "curriculum_year",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        if (
                                                            value.length !== 4
                                                        ) {
                                                            toast_info({
                                                                message:
                                                                    "Please enter exactly 4 digits for the curriculum year.",
                                                                userTheme:
                                                                    userTheme,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    name="period"
                                                    onValueChange={(value) => {
                                                        const selectedItem =
                                                            periodsArray.find(
                                                                (item) =>
                                                                    item.period_name ===
                                                                    value
                                                            );
                                                        if (selectedItem) {
                                                            updateRow(
                                                                index,
                                                                "period",
                                                                selectedItem.period_name
                                                            );
                                                        } else {
                                                            updateRow(
                                                                index,
                                                                "period",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[140px]">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Semesters
                                                            </SelectLabel>
                                                            {periodsArray.map(
                                                                (item) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={
                                                                            item.period_name
                                                                        }
                                                                    >
                                                                        {
                                                                            item.period_name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    name="level"
                                                    onValueChange={(value) => {
                                                        const selectedItem =
                                                            levelsArray.find(
                                                                (item) =>
                                                                    item.level_name ===
                                                                    value
                                                            );
                                                        if (selectedItem) {
                                                            updateRow(
                                                                index,
                                                                "level",
                                                                selectedItem.level_name
                                                            );
                                                        } else {
                                                            updateRow(
                                                                index,
                                                                "level",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[110px]">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Year Levels
                                                            </SelectLabel>
                                                            {levelsArray.map(
                                                                (item) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={
                                                                            item.level_name
                                                                        }
                                                                    >
                                                                        {
                                                                            item.level_name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>

                                            <TableCell>
                                                <Select
                                                    name="program_code"
                                                    onValueChange={(value) => {
                                                        const selectedItem =
                                                            programcodesArray.find(
                                                                (item) =>
                                                                    item.program_code ===
                                                                    value
                                                            );
                                                        if (selectedItem) {
                                                            updateRow(
                                                                index,
                                                                "program_code",
                                                                selectedItem.program_code
                                                            );
                                                            updateRow(
                                                                index,
                                                                "program_name",
                                                                selectedItem.program_name
                                                            );
                                                        } else {
                                                            updateRow(
                                                                index,
                                                                "program_code",
                                                                value
                                                            );
                                                            updateRow(
                                                                index,
                                                                "program_name",
                                                                ""
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[110px]">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Departments
                                                            </SelectLabel>
                                                            {filteredDepartments.map(
                                                                (item) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={
                                                                            item.program_code
                                                                        }
                                                                    >
                                                                        {
                                                                            item.program_code
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>

                                            <TableCell>
                                                <Input
                                                    id="course_code"
                                                    className="w-[110px]"
                                                    type="text"
                                                    placeholder="CPE 115_K12"
                                                    value={row.course_code}
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.value;
                                                        updateRow(
                                                            index,
                                                            "course_code",
                                                            newValue
                                                        );
                                                        updateRow(
                                                            index,
                                                            "control_code",
                                                            newValue
                                                        );
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    id="control_name"
                                                    className="w-[220px]"
                                                    type="text"
                                                    placeholder="Operating Systems for CpE"
                                                    value={row.course_name}
                                                    onChange={(e) =>
                                                        updateRow(
                                                            index,
                                                            "course_name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    id="lec"
                                                    className="w-[40px]"
                                                    type="text"
                                                    placeholder="0"
                                                    value={
                                                        row.lec === 0
                                                            ? ""
                                                            : row.lec
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        if (
                                                            value === "" ||
                                                            /^[0-9]$/.test(
                                                                value
                                                            )
                                                        ) {
                                                            updateRow(
                                                                index,
                                                                "lec",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    id="lab"
                                                    className="w-[40px]"
                                                    type="text"
                                                    placeholder="0"
                                                    value={
                                                        row.lab === 0
                                                            ? ""
                                                            : row.lab
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        if (
                                                            value === "" ||
                                                            /^[0-9]$/.test(
                                                                value
                                                            )
                                                        ) {
                                                            updateRow(
                                                                index,
                                                                "lab",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    id="units"
                                                    className="w-[40px]"
                                                    type="text"
                                                    placeholder="0"
                                                    value={
                                                        row.units === 0
                                                            ? ""
                                                            : row.units
                                                    }
                                                    readOnly
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    // disabled={
                                                    //     row.curriculum_year.toString()
                                                    //         .length !== 4 || row.course_code === ""
                                                    // }
                                                    id="pre_reqs"
                                                    className="w-[300px]"
                                                    type="text"
                                                    placeholder="Data Structure and Algorithms (CPE 113)"
                                                    value={row.pre_reqs}
                                                    onChange={(e) =>
                                                        updateRow(
                                                            index,
                                                            "pre_reqs",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    name="is_complab"
                                                    onValueChange={(value) =>
                                                        updateRow(
                                                            index,
                                                            "is_complab",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-[85px]">
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
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell
                                            colSpan={20}
                                            className="py-4 text-right"
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <CircleCheck /> Save Changes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
