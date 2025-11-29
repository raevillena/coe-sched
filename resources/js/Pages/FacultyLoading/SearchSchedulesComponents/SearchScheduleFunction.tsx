import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

interface SearchScheduleFunctionProps {
    semester: string;
    setSemester: React.Dispatch<React.SetStateAction<string>>;
    year: string;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchScheduleFunction({
    semester,
    setSemester,
    year,
    setYear,
    search,
    setSearch,
}: SearchScheduleFunctionProps) {
    const [curriculumYear, setCurriculumYear] = useState<number[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState(search);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios
            .get(route("rooms_schedule.get_curriculum_year"))
            .then((response) => {
                const uniqueYears = Array.from(
                    new Set(response.data)
                ) as number[];
                setCurriculumYear(uniqueYears.sort((a, b) => b - a));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios
            .get(route("control.get_periods"))
            .then((response) => {
                setPeriods(response.data);
            })
            .catch((error) => {
                console.error("Error fetching periods:", error);
            });
    }, []);

    const handleSearch = async () => {
        setIsLoading(true);
        setSearch(searchInput);
        // Add a small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isLoading) {
            handleSearch();
        }
    };

    const showSelectMessage = !year || !semester;

    //save to local storage
    useEffect(() => {
        if (year) {
            localStorage.setItem("searchschedule_year", JSON.stringify(year));
        }
        if (semester) {
            localStorage.setItem(
                "searchschedule_semester",
                JSON.stringify(semester)
            );
        }
    }, [year, semester]);

    useEffect(() => {
        const savedYear = localStorage.getItem("searchschedule_year");
        const savedSemester = localStorage.getItem("searchschedule_semester");
        if (savedYear && setYear) setYear(JSON.parse(savedYear));
        if (savedSemester && setSemester)
            setSemester(JSON.parse(savedSemester));
    }, [setYear, setSemester]);

    return (
        <div>
            {showSelectMessage && (
                <div className="mt-5 mb-3 text-red-500">
                    Select a year and semester to proceed.
                </div>
            )}
            <div className="grid w-2/3 grid-cols-1 lg:mt-5 mb-4 lg:space-x-4 space-y-2 lg:space-y-0 lg:grid-cols-3">
                <div id="select-cy">
                    <Select
                        name="curriculum_year"
                        value={year}
                        onValueChange={setYear}
                    >
                        <Label htmlFor="curriculum_year">
                            Select Academic Year
                        </Label>
                        <SelectTrigger id="curriculum_year">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Academic Years</SelectLabel>
                                {curriculumYear.length > 0 ? (
                                    curriculumYear.map((year) => (
                                        <SelectItem
                                            value={year.toString()}
                                            key={year}
                                        >
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

                <div id="select-sem">
                    {/* Select Semester */}
                    <Select
                        name="period"
                        value={semester}
                        onValueChange={setSemester}
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

            <div className="w-full md:w-[700px]" id="search-bar">
                <div className="relative flex gap-2">
                    <Input
                        id="search"
                        type="search"
                        placeholder="Search teacher, room, section..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="h-10"
                        disabled={!semester || !year || isLoading}
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={!semester || !year || isLoading}
                        size="icon"
                        type="submit"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
