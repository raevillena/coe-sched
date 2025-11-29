import { useEffect, useState } from "react";
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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import axios from "axios";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Minus, SquarePlus } from "lucide-react";

////Select Level
interface SelectLevelProps {
    id: string;
    level_name: string;
    value: string;
    onChange: (value: string) => void;
}
export function SelectLevel({
    id,
    level_name,
    value,
    onChange,
}: SelectLevelProps) {
    const [levels, setLevels] = useState<any[]>([]);

    useEffect(() => {
        if (level_name) {
            axios
                .get(route("control.get_levels", { level_name }))
                .then((response) => {
                    setLevels(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching levels:", error);
                });
        }
    }, [level_name]);

    return (
        <Select name="level" value={value} onValueChange={onChange}>
            <Label htmlFor={id}>Select Year Level</Label>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Year Level" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Year Levels</SelectLabel>
                    {levels.length > 0 ? (
                        levels.map((level) => (
                            <SelectItem value={level.level_name} key={level.id}>
                                {level.level_name}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="null" disabled>
                            No year level available
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

/////Select Section
interface SelectSectionProps {
    id: string;
    program_code: string;
    level: string;
    value: string;
    onChange: (value: string) => void;
}

export function SelectSection({
    id,
    program_code,
    level,
    value,
    onChange,
}: SelectSectionProps) {
    const [sections, setSections] = useState<any[]>([]);

    useEffect(() => {
        if (level && program_code) {
            axios
                .get(route("control.get_sections", { program_code, level }))
                .then((response) => {
                    // console.log("Fetched sections response:", response.data);
                    setSections(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching sections:", error);
                });
        }
    }, [level, program_code]);

    return (
        <Select name="section" value={value} onValueChange={onChange}>
            <Label htmlFor={id}>Select Section</Label>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sections</SelectLabel>
                    {sections.length > 0 ? (
                        sections.map((section) => (
                            <SelectItem
                                value={section.section_name}
                                key={section.id}
                            >
                                {section.section_name}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="null" disabled>
                            No sections available
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

////Search Curriculum Year
interface SelectCurriculumYearProps {
    id: string;
    program_code: string;
    level: string;
    value: string;
    onChange: (value: string) => void;
}

export function SelectCurriculumYear({
    id,
    level,
    program_code,
    value,
    onChange,
}: SelectCurriculumYearProps) {
    const [curriculumYear, setCurriculumYear] = useState<any[]>([]);

    curriculumYear.sort((a, b) => b - a);

    useEffect(() => {
        if (program_code && level) {
            axios
                .get(
                    route("control.get_academic_years", { program_code, level })
                )
                .then((response) => {
                    const uniqueYears = Array.from(new Set(response.data));
                    setCurriculumYear(uniqueYears);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [program_code, level]);

    return (
        <Select name="curriculum_year" value={value} onValueChange={onChange}>
            <Label htmlFor={id}>Select Academic Year</Label>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Curriculum Year" />
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
                            No Academic years available
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Select Period
interface SelectPeriodProps {
    id: string;
    period_name: string;
    value: string;
    onChange: (value: string) => void;
}

export function SelectPeriod({
    id,
    period_name,
    value,
    onChange,
}: SelectPeriodProps) {
    const [periods, setPeriods] = useState<any[]>([]);

    useEffect(() => {
        if (period_name) {
            axios
                .get(route("control.get_periods", { period_name }))
                .then((response) => {
                    //console.log("Fetched sections response:", response.data);
                    setPeriods(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching periods:", error);
                });
        }
    }, [period_name]);

    return (
        <Select name="period" value={value} onValueChange={onChange}>
            <Label htmlFor={id}>Select Semester</Label>
            <SelectTrigger id={id}>
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
    );
}

// Add a new section for SelectAcademicYear
interface SelecAcademicYearProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    program_code: string;
    level: string;
}

 {/* Select Course Curriculum */}
export function SelectAcademicYear({
    id,
    value,
    onChange,
    program_code,
    level,
}: SelecAcademicYearProps) {
    const [academicYears, setCurriculumYear] = useState<any[]>([]);
    academicYears.sort((a, b) => b - a);
    useEffect(() => {
        if (level && program_code) {
            axios
                .get(route("control.get_cy", { program_code, level }))
                .then((response) => {
                    const uniqueYears = Array.from(new Set(response.data));
                    setCurriculumYear(uniqueYears);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [level, program_code]);
    return (
        <Select name="academic_year" value={value} onValueChange={onChange}>
            <Label htmlFor={id}>Select Curriculum</Label>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Curriculum" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Curriculums</SelectLabel>
                    {academicYears.length > 0 ? (
                        academicYears.map((year) => (
                            <SelectItem value={year} key={year}>
                                {year} - {Number(year) + 1}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="null" disabled>
                            No Curriculum available
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
//courses to offer table
interface TableProps {
    addCourseOffering: (course: any) => void;
    data: any[];
    isAddingCourse: boolean;
}

export function OfferTable({
    addCourseOffering,
    data,
    isAddingCourse,
}: TableProps) {
    return (
        <Table>
            <TableCaption>Courses to Offer Table</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Description</TableHead>
                    <TableHead>Lec</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.length > 0 ? (
                    data.map((course, index) => (
                        <TableRow key={index}>
                            <TableCell>{course.course_code}</TableCell>
                            <TableCell>{course.course_name}</TableCell>
                            <TableCell>{course.lec}</TableCell>
                            <TableCell>{course.lab}</TableCell>
                            <TableCell>{course.units}</TableCell>
                            <TableCell>
                                <Button
                                    type="button"
                                    size="icon"
                                    onClick={() => addCourseOffering(course)}
                                    disabled={isAddingCourse}
                                >
                                    <SquarePlus
                                        size={32}
                                        color="#1fd655"
                                        strokeWidth={2.5}
                                    />
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
                            No courses to offer.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

//offered table
interface OfferedTableProps {
    removeCourseOffering: (course: any) => void;
    offeredData: any[];
    isRemovingCourse: boolean;
}

export function OfferedTable({
    removeCourseOffering,
    offeredData,
    isRemovingCourse,
}: OfferedTableProps) {
    return (
        <Table>
            <TableCaption>Courses Offered Table</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Description</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Lec</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {offeredData.length > 0 ? (
                    offeredData.map((offered, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {offered.curriculums?.course_code}
                            </TableCell>
                            <TableCell>{offered.course_name}</TableCell>
                            <TableCell>{offered.section_name}</TableCell>
                            <TableCell>{offered.curriculums?.lec}</TableCell>
                            <TableCell>{offered.curriculums?.lab}</TableCell>
                            <TableCell>{offered.curriculums?.units}</TableCell>
                            <TableCell>
                                <Button
                                    type="button"
                                    size="icon"
                                    onClick={() =>
                                        removeCourseOffering(offered)
                                    }
                                    disabled={isRemovingCourse}
                                >
                                    <Minus
                                        size={32}
                                        color="#ff0000"
                                        strokeWidth={2.5}
                                    />
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
                            No offered courses available.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
