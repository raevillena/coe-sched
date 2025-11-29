import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import { useEffect, useState } from "react";
import { Label } from "@/Components/ui/label";
import axios from "axios";

export interface SelectYearAndSemesterProps {
    userRole: "user" | "admin" | "super-admin";
    userDepartmentId: number;
    year: string;
    period_name: string;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    semester: string;
    setSemester: React.Dispatch<React.SetStateAction<string>>;
}

export default function SelectYearAndSemester({
    userRole,
    userDepartmentId,
    period_name,
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

    //save to local storage
    useEffect(() => {
        if (year) {
            localStorage.setItem("roomschedule_year", JSON.stringify(year));
        }
        if (semester) {
            localStorage.setItem("roomschedule_semester", JSON.stringify(semester));
        }
    }, [year, semester]);

    useEffect(() => {
        const savedYear = localStorage.getItem("roomschedule_year");
        const savedSemester = localStorage.getItem("roomschedule_semester");
        if (savedYear && setYear) setYear(JSON.parse(savedYear));
        if (savedSemester && setSemester) setSemester(JSON.parse(savedSemester));
    }, [setYear, setSemester]);

    return (
        <div className="lg:mt-5">
            {showSelectMessage && (
                <div className="text-red-500 mb-3">Select a year and semester to proceed.</div>
            )}
            <div className="grid w-2/3 grid-cols-1 space-y-2 mb-4 lg:mb-0 lg:space-y-0 lg:space-x-4 lg:grid-cols-4">
                {/* Select Curriculum Year */}
                <div id="select-sy">
                    <Select
                        name="curriculum_year"
                        value={year}
                        onValueChange={(value) => {
                            setYear(value);
                        }}
                    >
                        <Label>Select Academic Year</Label>
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
                        onValueChange={(value) => {
                            setSemester(value);
                        }}
                    >
                        <Label>Select Semester</Label>
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