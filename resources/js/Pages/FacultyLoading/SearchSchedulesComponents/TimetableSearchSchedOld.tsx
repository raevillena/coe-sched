import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import debounce from "lodash.debounce";
import { SelectCurriculumYear, SelectPeriod } from "@/Components/CustomizedComponents/select-search-table";

interface TimetableSearchSchedProps {
    searchEvent: string;
    setSearchEvent: React.Dispatch<React.SetStateAction<string>>;
    setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
    initialYear: string;
    initialSemester: string;
    course: string;
    level: string;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    setSemester: React.Dispatch<React.SetStateAction<string>>;
    period_name: string;
}

interface FilterCriteria {
    year: string;
    semester: string;
    searchTerm: string;
}

export default function TimetableSearchSched({
    searchEvent,
    setSearchEvent,
    setFilterCriteria,
    initialYear,
    initialSemester,
    course,
    level,
    setYear,
    setSemester,
    period_name,
}: TimetableSearchSchedProps) {
    const roomNumbers = [
        "Room 101",
        "Room 102",
        "Room 103",
        "Room 104",
        "Room 105",
        "Room 106",
        "Room 107",
        "Room 108",
        "Room 109",
        "Room 110",
    ];

    const teachers = [
        "Nathaniel Miguel",
        "John Doe",
        "Jane Doe",
        "Juan Dela Cruz",
        "Maria Clara",
        "Alice Johnson",
        "Bob Smith",
        "Charlie Brown",
        "David Wilson",
        "Eve Davis",
    ];
    const subjects = [
        "CPE 143",
        "CPE 144",
        "CPE 145",
        "CPE 146",
        "CPE 147",
        "CPE 148",
        "CPE 149",
        "CPE 150",
        "CPE 151",
        "CPE 152",
    ];
    const sections = [
        "BSCpE 1A",
        "BSCpE 1B",
        "BSCpE 2A",
        "BSCpE 2B",
        "BSCpE 3A",
        "BSCpE 3B",
        "BSCpE 4A",
        "BSCpE 4B",
        "BSCpE 5A",
        "BSCpE 5B",
    ];

    const data = useMemo(
        () => [
            ...roomNumbers.map((room) => ({ type: "Room", value: room })),
            ...teachers.map((teacher) => ({ type: "Teacher", value: teacher })),
            ...subjects.map((subject) => ({ type: "Subject", value: subject })),
            ...sections.map((section) => ({ type: "Section", value: section })),
        ],
        [roomNumbers, teachers, subjects, sections]
    );

    type Suggestion = { type: string; value: string };

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>(initialYear);
    const [selectedSemester, setSelectedSemester] =
        useState<string>(initialSemester);

    useEffect(() => {
        setSelectedYear(initialYear);
        setSelectedSemester(initialSemester);
    }, [initialYear, initialSemester]);

    const handleInputChange = useCallback(
        debounce((value: string) => {
            if (value) {
                const filteredSuggestions = data
                    .filter((item) =>
                        item.value.toLowerCase().includes(value.toLowerCase())
                    )
                    .slice(0, 10); //Limit to 10 suggestions
                setSuggestions(filteredSuggestions);
            } else {
                setSuggestions([]);
            }
        }, 300),
        [data]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchEvent(value);
        handleInputChange(value);
    };

    const handleSuggestionClick = (value: string) => {
        setSearchEvent(value);
        setSuggestions([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && suggestions.length > 0) {
            handleSuggestionClick(suggestions[0].value);
        }
    };

    const handleSearch = () => {
        setFilterCriteria({
            year: selectedYear,
            semester: selectedSemester,
            searchTerm: searchEvent,
        });
    };

    return (
        <div>
            <div className="flex gap-4 mb-4">
                <div>
                    <SelectCurriculumYear
                        id="curriculum_year"
                        program_code={course}
                        level={level}
                        value={initialYear}
                        onChange={(value) => {
                            setYear(value);
                            setSemester("");
                        }}
                    />
                </div>
                <div>
                    <SelectPeriod
                        id="period"
                        period_name={period_name}
                        value={initialSemester}
                        onChange={(value) => {
                            setSemester(value);
                        }}
                    />
                </div>
            </div>

            <Label htmlFor="search">Find Schedule</Label>
            <div className="flex gap-1">
                <div className="relative ">
                    <Input
                        placeholder="Room, Teacher, Subject, Section"
                        id="search"
                        className="mb-2 "
                        value={searchEvent}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />

                    {suggestions.length > 0 && (
                        <div className="absolute z-10 w-full pt-1 pb-1 pl-3 mt-12 overflow-y-auto bg-white border border-gray-300 dropdown max-h-85 ">
                            {suggestions.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-2 cursor-pointer dropdown-item hover:bg-gray-200"
                                    onClick={() =>
                                        handleSuggestionClick(item.value)
                                    }
                                >
                                    {item.value}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <Button variant="default" onClick={handleSearch}>
                        <Search />
                    </Button>
                </div>
            </div>
        </div>
    );
}
