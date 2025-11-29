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

interface DynamicSearchBarRoomPropsForFullCalendar {
    className?: string;
    room: string;
    setRoom: React.Dispatch<React.SetStateAction<string>>;
    roomId: string;
}

export default function DynamicSearchBarRoomFullCalendar({
    className = "",
    room,
    setRoom,
    roomId,
}: DynamicSearchBarRoomPropsForFullCalendar) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [typedRoom, setTypedRoom] = useState(room); // Initialize with prop
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const [roomNumbers, setRoomNumbers] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

    // Sync typedRoom with room prop if it changes externally
    useEffect(() => {
        setTypedRoom(room);
    }, [room]);

    useEffect(() => {
        const fetchRoomNumbers = async () => {
            try {
                const response = await axios.get(
                    route("course_scheduling.get_rooms")
                );
                // Sort initial room numbers as well
                const sortedRoomNumbers = response.data.sort(
                    (a: string, b: string) =>
                        a.localeCompare(b, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        })
                );
                setRoomNumbers(sortedRoomNumbers);
            } catch (error) {
                console.error("Error fetching room numbers:", error);
            }
        };
        fetchRoomNumbers();
    }, []);

    const filteredItems = useMemo(() => {
        let itemsToShow;
        if (!typedRoom.trim()) {
            // If input is empty, show all rooms (already sorted)
            itemsToShow = roomNumbers;
        } else {
            itemsToShow = roomNumbers.filter((r) =>
                r.toLowerCase().includes(typedRoom.toLowerCase())
            );
        }
        // Sort the filtered items alphanumerically
        return itemsToShow.sort((a, b) =>
            a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );
    }, [typedRoom, roomNumbers]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTypedRoom(e.target.value); // Update local state for typing
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                setRoom(e.target.value); // Update parent state after debounce
            }, 200);
            setShowDropdown(true); // Keep dropdown open while typing
        },
        [setRoom]
    );

    // Removed useEffect that hides dropdown based on typedRoom.trim()

    const handleItemClick = (item: string) => {
        setRoom(item); // Update parent state
        setTypedRoom(item); // Update local state
        setShowDropdown(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && filteredItems.length > 0) {
            // Check for an exact match first
            const exactMatch = filteredItems.find(
                (r) => r.toLowerCase() === typedRoom.toLowerCase()
            );
            const itemToSet = exactMatch || filteredItems[0];
            setRoom(itemToSet);
            setTypedRoom(itemToSet);
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
                    <Label htmlFor={roomId} className="text-left">
                        {" "}
                        {/* Ensure htmlFor matches id */}
                        Select Room
                    </Label>
                    <Input
                        ref={inputRef} // Add ref
                        id={roomId}
                        type="text"
                        value={typedRoom} // Use local state for input value
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={handleInputFocus} // Show dropdown on focus
                        onBlur={handleInputBlur} // Hide dropdown on blur
                        placeholder="Search room..."
                        aria-label="Search for room numbers"
                        className="w-full"
                        autoComplete="off"
                    />
                </div>
                {showDropdown && (
                    <ul
                        className={`absolute z-10 w-full mt-2 border rounded-md shadow-sm bg-background border-input ${
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
                                    className="px-4 text-[0.875rem] py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => handleItemClick(item)}
                                    role="option"
                                    aria-selected={room === item} // Compare with parent state for selection highlight
                                    tabIndex={0}
                                >
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-center text-[0.875rem] text-gray-500">
                                {roomNumbers.length > 0 &&
                                typedRoom.trim() !== ""
                                    ? "No rooms found"
                                    : roomNumbers.length === 0
                                    ? "No rooms available"
                                    : "Type to search or select from list"}
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
