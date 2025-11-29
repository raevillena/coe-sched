import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { SelectDeptCourseOffering } from "@/Components/CustomizedComponents/select-component";
import { useEffect, useState } from "react";
import { Label } from "@/Components/ui/label";
import axios from "axios";
import { Department } from "@/types/my_types";

export interface SelectYearAndSemesterProps {
    userRole: "user" | "admin" | "super-admin";
    userDepartmentId: number;
    year: string;
    period_name: string;
    departments: {
        data: Department[];
    };
    course: string;
    setCourse: React.Dispatch<React.SetStateAction<string>>;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    semester: string;
    setSemester: React.Dispatch<React.SetStateAction<string>>;
}

export default function SelectYearAndSemester({
    userRole,
    userDepartmentId,
    period_name,
    departments,
    course,
    setCourse,
    year,
    setYear,
    semester,
    setSemester,
}: SelectYearAndSemesterProps): JSX.Element {
    const [curriculumYear, setCurriculumYear] = useState<any[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);

    curriculumYear.sort((a, b) => b - a);

    useEffect(() => {
        axios
            .get(route("rooms_schedule.get_curriculum_year"))
            .then((response) => {
                const uniqueYears = Array.from(new Set(response.data));
                setCurriculumYear(uniqueYears);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (period_name) {
            axios
                .get(route("control.get_periods", { period_name }))
                .then((response) => {
                    setPeriods(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching periods:", error);
                });
        }
    }, [period_name]);

    const showSelectMessage = !year || !semester;

    useEffect(() => {
        const savedCourse = localStorage.getItem("selectedCourse");
        const savedYear = localStorage.getItem("selectedYear");
        const savedSemester = localStorage.getItem("selectedSemester");

        if (savedCourse) setCourse(JSON.parse(savedCourse));
        if (savedYear) setYear(JSON.parse(savedYear));
        if (savedSemester) setSemester(JSON.parse(savedSemester));
    }, [setCourse, setYear, setSemester]);

    const handleCourseChange = (selectedDept: string) => {
        setCourse(selectedDept);
        localStorage.setItem("selectedCourse", JSON.stringify(selectedDept));
    };

    const handleYearChange = (selectedYear: string) => {
        setYear(selectedYear);
        localStorage.setItem("selectedYear", JSON.stringify(selectedYear));
    };

    const handleSemesterChange = (selectedSemester: string) => {
        setSemester(selectedSemester);
        localStorage.setItem(
            "selectedSemester",
            JSON.stringify(selectedSemester)
        );
    };

    return (
        <div>
            {showSelectMessage && (
                <div className="mb-3 text-red-500">
                    Select a year and semester to proceed.
                </div>
            )}
            <div className="grid w-2/3 grid-cols-1 space-y-2 lg:space-y-0 lg:space-x-4 lg:grid-cols-4">
                {/* Select Department */}
                <div id="select-dept">
                    <Label htmlFor="department_id">Select Department</Label>
                    <SelectDeptCourseOffering
                        id="department_id"
                        departments={departments}
                        value={course}
                        onChange={handleCourseChange}
                        userDepartmentId={userDepartmentId}
                        userRole={userRole}
                    />
                </div>
                {/* Select Curriculum Year */}
                <div id="select-sy">
                    <Select
                        name="curriculum_year"
                        value={year}
                        onValueChange={handleYearChange}
                    >
                        <Label htmlFor="curriculum_year">
                            Select Academic Year
                        </Label>
                        <SelectTrigger id="curriculum_year">
                            <SelectValue placeholder="Select Academic Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Academic Years</SelectLabel>
                                {curriculumYear.length > 0 ? (
                                    curriculumYear.map((year) => (
                                        <SelectItem value={year} key={year}>
                                            {year} - {Number(year) + 1}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="null" disabled>
                                        No curriculum years available
                                    </SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Select Period */}
                <div id="select-period">
                    <Select
                        name="period"
                        value={semester}
                        onValueChange={handleSemesterChange}
                    >
                        <Label htmlFor="period">Select Semester</Label>
                        <SelectTrigger id="period">
                            <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Semesters</SelectLabel>
                                {periods.length > 0 ? (
                                    periods.map((period) => (
                                        <SelectItem
                                            value={period.period_name}
                                            key={period.id}
                                        >
                                            {period.period_name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="null" disabled>
                                        No semester available
                                    </SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
