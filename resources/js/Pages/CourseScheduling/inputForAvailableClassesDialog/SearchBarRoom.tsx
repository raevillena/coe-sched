import React, {
    useState,
    useMemo,
    useCallback,
    useRef,
    useEffect,
} from "react";
import axios from "axios";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast_error } from "@/types/my_types/mytoast";
import { cn } from "@/lib/utils";

interface Room {
    roomNumber: string;
    isAvailable: boolean;
    departmentPriority?: string | string[];
    roomType?: string;
}

interface DynamicSearchBarRoomProps {
    className?: string;
    room: string;
    setRoom: React.Dispatch<React.SetStateAction<string>>;
    roomId: string;
    selectedDays: number[];
    startTime: string;
    endTime: string;
    year: string;
    semester: string;
    course: string; // Add course prop
}

export default function DynamicSearchBarRoom({
    className = "",
    room,
    setRoom,
    roomId,
    selectedDays,
    startTime,
    endTime,
    year,
    semester,
    course, // Destructure course prop
}: DynamicSearchBarRoomProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [typedRoom, setTypedRoom] = useState(room);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTypedRoom(room);
    }, [room]);

    // Fetch room availability when days, time, or search changes
    useEffect(() => {
        const checkRoomAvailability = async () => {
            if (!selectedDays.length || !startTime || !endTime) {
                return;
            }

            setIsLoading(true);
            try {
                // Fetch rooms with availability in a single request
                const response = await axios.get(
                    route("course_scheduling.get_rooms"),
                    {
                        params: {
                            selectedDays,
                            startTime,
                            endTime,
                            year,
                            semester,
                            course, // Added course parameter
                        },
                    }
                );

                // Sort rooms with available rooms first, then by room number
                const sortedRooms = response.data.sort((a: Room, b: Room) => {
                    if (a.isAvailable && !b.isAvailable) return -1;
                    if (!a.isAvailable && b.isAvailable) return 1;
                    return a.roomNumber.localeCompare(b.roomNumber, undefined, {
                        numeric: true,
                        sensitivity: "base",
                    });
                });

                setRooms(sortedRooms);
            } catch (error) {
                console.error("Error fetching room availability:", error);
                toast_error({
                    message: "Error checking room availability",
                    userTheme: "light",
                });
            } finally {
                setIsLoading(false);
            }
        };

        checkRoomAvailability();
    }, [selectedDays, startTime, endTime, year, semester]);

    const filteredItems = useMemo(() => {
        if (!typedRoom.trim()) {
            return rooms;
        }
        return rooms.filter((room) =>
            room.roomNumber.toLowerCase().includes(typedRoom.toLowerCase())
        );
    }, [typedRoom, rooms]);

    // Sort rooms: Laboratory Room first, then Lecture Room, then others
    const sortedFilteredItems = useMemo(() => {
        const getTypeOrder = (roomType?: string) => {
            if (roomType === "Laboratory Room") return 0;
            if (roomType === "Lecture Room") return 1;
            return 2;
        };
        return [...filteredItems].sort((a, b) => {
            const typeOrderA = getTypeOrder(a.roomType);
            const typeOrderB = getTypeOrder(b.roomType);
            if (typeOrderA !== typeOrderB) return typeOrderA - typeOrderB;
            // If same type, sort by room number
            return a.roomNumber.localeCompare(b.roomNumber, undefined, {
                numeric: true,
                sensitivity: "base",
            });
        });
    }, [filteredItems]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTypedRoom(e.target.value);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                setRoom(e.target.value);
            }, 200);
            setShowDropdown(true);
        },
        [setRoom]
    );

    const handleItemClick = (room: Room) => {
        setRoom(room.roomNumber);
        setTypedRoom(room.roomNumber);
        setShowDropdown(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && filteredItems.length > 0) {
            const exactMatch = filteredItems.find(
                (r) => r.roomNumber.toLowerCase() === typedRoom.toLowerCase()
            );
            const itemToSet = exactMatch || filteredItems[0];

            if (!itemToSet.isAvailable) {
                toast_error({
                    message:
                        "Warning: This room is occupied during the selected time slot",
                    userTheme: "light",
                });
            }

            setRoom(itemToSet.roomNumber);
            setTypedRoom(itemToSet.roomNumber);
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

    // Helper function to convert time to minutes
    const convertTimeToMinutes = (timeStr: string): number => {
        if (!timeStr) return 0;
        const parts = timeStr.split(":");
        if (parts.length < 2) return 0;
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };

    const isDeptAllowed = (room: Room) => {
        const dp = room.departmentPriority;
        // If there's no department priority set and the room is not a lab/lecture room,
        // it can be used by anyone
        if (!dp || (Array.isArray(dp) && dp.length === 0)) {
            return (
                room.roomType !== "Laboratory Room" &&
                room.roomType !== "Lecture Room"
            );
        }

        // Parse the department priority if it's a string
        const priorities = typeof dp === "string" ? JSON.parse(dp) : dp;

        // If it's a laboratory or lecture room, it must match the department
        if (
            room.roomType === "Laboratory Room" ||
            room.roomType === "Lecture Room"
        ) {
            return Array.isArray(priorities)
                ? priorities.includes(course)
                : priorities === course;
        }

        // For other room types, check if the course matches any priority
        return Array.isArray(priorities)
            ? priorities.includes(course)
            : priorities === course;
    };

    return (
        <div className={` ${className}`}>
            <div className="relative">
                <div className="grid items-center gap-2">
                    <Label htmlFor={roomId} className="text-left">
                        Select Room
                    </Label>
                    <Input
                        ref={inputRef}
                        id={roomId}
                        type="text"
                        value={typedRoom}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder={
                            isLoading ? "Loading rooms..." : "Search room..."
                        }
                        aria-label="Search for room numbers"
                        className={cn("w-full", isLoading && "opacity-50")}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                </div>
                {showDropdown && (
                    <ul
                        className={cn(
                            "absolute z-10 w-full mt-2 border rounded-md shadow-sm bg-background border-input",
                            filteredItems.length > 10 &&
                                "max-h-48 overflow-y-auto"
                        )}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {isLoading ? (
                            <li className="px-4 py-2 text-center text-[0.875rem] text-gray-500">
                                Loading...
                            </li>
                        ) : sortedFilteredItems.length > 0 ? (
                            sortedFilteredItems.map((room, index) => (
                                <li
                                    key={index}
                                    className={cn(
                                        "px-4 py-2 text-[0.875rem] flex items-center justify-between cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    )}
                                    onClick={() => handleItemClick(room)}
                                    role="option"
                                    aria-selected={
                                        typedRoom === room.roomNumber
                                    }
                                    tabIndex={0}
                                >
                                    <span className="flex items-center gap-2">
                                        {room.roomNumber}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span
                                            className={
                                                room.roomType ===
                                                "Laboratory Room"
                                                    ? "ml-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200"
                                                    : room.roomType ===
                                                      "Lecture Room"
                                                    ? "ml-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200"
                                                    : room.roomType ===
                                                      "Laboratory / Lecture Room"
                                                    ? "ml-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200"
                                                    : "ml-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
                                            }
                                        >
                                            {room.roomType}
                                        </span>
                                        <span
                                            className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium ml-2",
                                                room.isAvailable === true
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            )}
                                        >
                                            {room.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-center text-[0.875rem] text-gray-500">
                                {rooms.length > 0 && typedRoom.trim() !== ""
                                    ? "No rooms found"
                                    : rooms.length === 0
                                    ? "No rooms available"
                                    : selectedDays.length === 0
                                    ? "Select days to see available rooms"
                                    : "Type to search or select from list"}
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
