import { useEffect, useState } from "react";
import { Building } from "@/types/my_types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface SelectBuildingProps {
    id: string;
    building: { data: Building[] };
    value: string | undefined;
    onChange: (value: string) => void;
    disabled: boolean; 
}


//for storing
export function SelectBuilding({
    id,
    building,
    value,
    onChange,
    disabled, 
}: SelectBuildingProps) {

    const [buildings, setBuildings] = useState<Building[]>([]);

    useEffect(() => {
        if (Array.isArray(building?.data)) {
            setBuildings(building.data);
        }
    }, [building]);

    return (
        <Select name="building_id" value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger id={id} disabled={disabled}>
                <SelectValue placeholder="Select Building" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Buildings</SelectLabel>
                    {buildings.map((item) => (
                        <SelectItem value={item.building_name} key={item.id}>
                            {item.building_name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//for editing
export function ManageSelectBuilding({
    id,
    building,
    value,
    onChange,
    disabled, 
}: SelectBuildingProps) {

    const [buildings, setBuildings] = useState<Building[]>([]);

    useEffect(() => {
        if (Array.isArray(building?.data)) {
            setBuildings(building.data);
        }
    }, [building]);

    return (
        <Select name="building_id" value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger id={id} disabled={disabled}>
                <SelectValue placeholder="Select Building" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Buildings</SelectLabel>
                    <SelectItem value="null" key="none">
                        Select Building
                    </SelectItem>
                    {buildings.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                            {item.building_name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
