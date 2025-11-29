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

interface SearchCurriculumYearPropsForDuplicate {
    id: string;
    program_code: string;
    level: string;
    value: string;
    onChange: (value: string) => void;
}
export function SelectYearForDuplicate({
    id,
    program_code,
    level,
    value,
    onChange,
}: SearchCurriculumYearPropsForDuplicate) {
    const [curriculumYear, setCurriculumYear] = useState<any[]>([]);

    curriculumYear.sort((a, b) => b - a);

    useEffect(() => {
        if (level && program_code) {
            axios
                .get(
                    route("control.get_academic_years", {
                        program_code,
                        level,
                    })
                )
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
        <Select name="curriculum_year" value={value} onValueChange={onChange}>
            <Label>Select Academic Year</Label>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Please Select" />
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
