import React, {
    useState,
    useMemo,
    useRef,
    useEffect,
    useCallback,
} from "react";
import { Input } from "@/Components/ui/input";
import axios from "axios";
import { Label } from "@/Components/ui/label";

interface Teacher {
    id: number;
    name: string;
}

interface DynamicSearchBarTeacherPropsForFullCalendar {
    className?: string;
    teacher: string;
    setteacher: React.Dispatch<React.SetStateAction<string>>;
    teacherId: string;
}

export default function DynamicSearchBarTeacherFullCalendar({
    className = "",
    teacher,
    setteacher,
    teacherId,
}: DynamicSearchBarTeacherPropsForFullCalendar) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [typedTeacher, setTypedTeacher] = useState(teacher);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch teachers on component mount
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get("/api/teachers");
                setTeachers(response.data);
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        };

        fetchTeachers();
    }, []);

    const filteredItems = useMemo(() => {
        if (!typedTeacher.trim()) {
            // If input is empty, show all teachers, sorted alphabetically
            return teachers
                .map((t) => t.name)
                .sort((a, b) => a.localeCompare(b));
        }
        return teachers
            .map((t) => t.name)
            .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
            .filter((name) =>
                name.toLowerCase().includes(typedTeacher.toLowerCase())
            );
    }, [typedTeacher, teachers]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTypedTeacher(e.target.value);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                setteacher(e.target.value);
            }, 200);
            setShowDropdown(true);
        },
        [setteacher]
    );

    const handleItemClick = (item: string) => {
        setteacher(item);
        setTypedTeacher(item);
        setShowDropdown(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && filteredItems.length > 0) {
            const exactMatch = filteredItems.find(
                (name) => name.toLowerCase() === typedTeacher.toLowerCase()
            );
            const itemToSet = exactMatch || filteredItems[0];
            setteacher(itemToSet);
            setTypedTeacher(itemToSet);
            setShowDropdown(false);
        }
    };

    const handleInputFocus = () => {
        setShowDropdown(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 150);
    };

    return (
        <div className={` ${className}`}>
            <div className="relative">
                <div className="grid items-center gap-2">
                    <Label htmlFor="TeacherSearch" className="text-left">
                        Teacher
                    </Label>
                    <Input
                        ref={inputRef}
                        id={teacherId}
                        type="text"
                        value={typedTeacher}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Search teacher..."
                        aria-label="Search for teacher names"
                        className="w-full"
                        autoComplete="off"
                    />
                </div>
                {showDropdown && (
                    <ul
                        className={`absolute z-10 w-full mt-2 Sborder rounded-md shadow-sm bg-background border-input ${
                            filteredItems.length > 10
                                ? "max-h-48 overflow-y-auto"
                                : ""
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="px-4 text-[0.875rem] py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => handleItemClick(item)}
                                    role="option"
                                    aria-selected={teacher === item}
                                    tabIndex={0}
                                >
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-center text-[0.875rem] text-gray-500">
                                {teachers.length > 0 &&
                                typedTeacher.trim() !== ""
                                    ? "No teachers found"
                                    : teachers.length === 0
                                    ? "No teachers available"
                                    : "Type to search or select from list"}
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
