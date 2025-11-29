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

interface ViewCurriculumSelectYearProps {
    id: string;
    program_code: string;
    value: string;
    onChange: (value: string) => void;
}

export function ViewCurriculumSelectYear({
    id,
    program_code,
    value,
    onChange,
}: ViewCurriculumSelectYearProps) {
    const [curriculumYear, setCurriculumYear] = useState<any[]>([]);

    curriculumYear.sort((a, b) => b - a);

    useEffect(() => {
        axios
            .get(route("view_curriculum.get_cy", { program_code }))
            .then((response) => {
                const uniqueYears = Array.from(new Set(response.data));
                setCurriculumYear(uniqueYears);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [program_code]);

    return (
        <Select
            name="select_view_curriculum_year"
            value={value}
            onValueChange={onChange}
        >
            <Label>Select Previous Curriculum</Label>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Please Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Curricula</SelectLabel>
                    {curriculumYear.length > 0 ? (
                        curriculumYear.map((year) => (
                            <SelectItem value={year} key={year}>
                                {year} - {Number(year) + 1}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="null" disabled>
                            No curricula available
                        </SelectItem>
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
