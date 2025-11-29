import React, {
    useState,
    useMemo,
    useCallback,
    useRef,
    useEffect,
} from "react";
import { Input } from "@/Components/ui/input";
import axios from "axios";
import { Label } from "@/Components/ui/label";

interface Teacher {
    id: number;
    name: string;
}

interface DynamicSearchBarTeacherProps {
    className?: string;
    teacher: string;
    setteacher: React.Dispatch<React.SetStateAction<string>>;
    teacherId: string;
}

export default function DynamicSearchBarTeacher({
    className = "",
    teacher,
    setteacher,
    teacherId,
}: DynamicSearchBarTeacherProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [typedTeacher, setTypedTeacher] = useState(teacher); // Initialize with prop
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

    // Sync typedTeacher with teacher prop if it changes externally
    useEffect(() => {
        setTypedTeacher(teacher);
    }, [teacher]);

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
            setTypedTeacher(e.target.value); // Update local state for typing
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                setteacher(e.target.value); // Update parent state after debounce
            }, 200);
            setShowDropdown(true); // Keep dropdown open while typing
        },
        [setteacher]
    );

    const handleItemClick = (item: string) => {
        setteacher(item); // Update parent state
        setTypedTeacher(item); // Update local state
        setShowDropdown(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && filteredItems.length > 0) {
            // Check for an exact match first
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
        // Delay hiding dropdown to allow click on dropdown items
        setTimeout(() => {
            setShowDropdown(false);
        }, 150); // Adjust delay as needed
    };

    return (
        <div className={` ${className}`}>
            <div className="relative">
                <div className="grid items-center gap-2">
                    <Label htmlFor={teacherId} className="text-left">
                        {" "}
                        {/* Ensure htmlFor matches id */}
                        Teacher
                    </Label>
                    <Input
                        ref={inputRef} // Add ref
                        id={teacherId}
                        type="text"
                        value={typedTeacher} // Use local state for input value
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus} // Show dropdown on focus
                        onBlur={handleInputBlur} // Hide dropdown on blur
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
                        // Prevent onBlur from input when clicking on dropdown items
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 cursor-pointer text-[0.875rem] hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => handleItemClick(item)}
                                    role="option"
                                    aria-selected={teacher === item} // Compare with parent state for selection highlight
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
