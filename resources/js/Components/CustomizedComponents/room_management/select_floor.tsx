import { useEffect, useState } from "react";
import { Floor } from "@/types/my_types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface SelectFloorProps {
    id: string;
    floor: { data: Floor[] };
    value: string | undefined;
    onChange: (value: string) => void;
    disabled: boolean; 
}

export function SelectFloor({
    id,
    floor,
    value,
    onChange,
    disabled, 
}: SelectFloorProps) {

    const [floors, setFloors] = useState<Floor[]>([]);

    useEffect(() => {
        if (Array.isArray(floor?.data)) {
            setFloors(floor.data);
        }
    }, [floor]);

    return (
        <Select name="floor_id" value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger id={id} disabled={disabled}>
                <SelectValue placeholder="Select Floor" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Floors</SelectLabel>
                    {floors.map((item) => (
                        <SelectItem value={item.floor_name} key={item.id}>
                            {item.floor_name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export function ManageSelectFloor({
    id,
    floor,
    value,
    onChange,
    disabled, 
}: SelectFloorProps) {

    const [floors, setFloors] = useState<Floor[]>([]);

    useEffect(() => {
        if (Array.isArray(floor?.data)) {
            setFloors(floor.data);
        }
    }, [floor]);

    return (
        <Select name="floor_id" value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger id={id} disabled={disabled}>
                <SelectValue placeholder="Select Floor" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Floors</SelectLabel>
                    <SelectItem value="null" key="none">
                        Select Floor
                    </SelectItem>
                    {floors.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                            {item.floor_name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}