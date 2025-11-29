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
import axios from "axios";
import { Label } from "@/Components/ui/label";

interface FacultyLoadingSelectCYProps {
    id: string;
    program_code: string;
    value: string;
    onChange: (value: string) => void;
}

export function FacultyLoadingSelectCY({
    id,
    program_code,
    value,
    onChange,
}: FacultyLoadingSelectCYProps) {
    const [curriculumYear, setCurriculumYear] = useState<any[]>([]);

    curriculumYear.sort((a, b) => b - a);

    useEffect(() => {
        if (program_code) {
            axios
                .get(route("faculty_loading.get_cy", { program_code }))
                .then((response) => {
                    const uniqueYears = Array.from(new Set(response.data));
                    setCurriculumYear(uniqueYears);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [program_code]);

    return (
        <Select name="curriculum_year" value={value} onValueChange={onChange}>
            <Label>Select Academic Year</Label>
            <SelectTrigger id={id}>
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
    );
}
