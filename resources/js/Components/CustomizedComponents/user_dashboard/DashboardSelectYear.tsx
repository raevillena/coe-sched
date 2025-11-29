import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import axios from "axios";

interface DashboardSelectYearProps {
    value: string;
    onChange: (value: string) => void;
}

export function DashboardSelectYear({
    value,
    onChange,
}: DashboardSelectYearProps) {
    const [curriculumYears, setCurriculumYears] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        axios
            .get(route("rooms_schedule.get_curriculum_year"))
            .then((response) => {
                const uniqueYears = Array.from(new Set(response.data)) as number[];
                setCurriculumYears(uniqueYears);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div>
                <Label htmlFor="curriculum_year">Academic Year</Label>
                <Select disabled value="">
                    <SelectTrigger id="curriculum_year">
                        <SelectValue placeholder="Loading..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="loading">Loading...</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Label htmlFor="curriculum_year">Academic Year</Label>
                <Select disabled value="">
                    <SelectTrigger
                        id="curriculum_year"
                        className="text-red-500"
                    >
                        <SelectValue placeholder="Error loading years" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="error">{error}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        );
    }

    return (
        <div>
            <Label htmlFor="curriculum_year">Academic Year</Label>
            <Select value={value || ""} onValueChange={onChange}>
                <SelectTrigger id="curriculum_year">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    {curriculumYears.length > 0 ? (
                        curriculumYears.map((year) => (
                            <SelectItem value={year.toString()} key={year}>
                                {year} - {Number(year) + 1}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="" disabled>
                            No curriculum years available
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
