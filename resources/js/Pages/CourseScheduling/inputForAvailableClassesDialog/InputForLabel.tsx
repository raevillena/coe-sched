import React, { useState, useEffect, memo } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

interface InputForLabelProps {
    className?: string;
    label: string;
    setLabel: React.Dispatch<React.SetStateAction<string>>;
}

const InputForLabel = memo(
    ({ label, setLabel, className }: InputForLabelProps) => {
        const [localValue, setLocalValue] = useState(label);

        useEffect(() => {
            const handler = setTimeout(() => {
                setLabel(localValue);
            }, 300);

            return () => clearTimeout(handler);
        }, [localValue, setLabel]);

        return (
            <div className="grid items-center gap-2">
                <div className="flex flex-col">
                    <Label htmlFor="label" className="text-left">
                        Schedule Label
                    </Label>
                    <div className="mb-2 text-xs text-gray-500">
                        Note: Please indicate if the subject is for Laboratory
                        or has split sessions. Use labels such as “Lab” or
                        “Split 1 / Split 2” if needed.
                    </div>
                </div>
                <Input
                    id="label"
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    className={`col-span-4 ${className}`}
                    placeholder="Split # / Lab"
                    autoComplete="off"
                />
            </div>
        );
    }
);

export default InputForLabel;
