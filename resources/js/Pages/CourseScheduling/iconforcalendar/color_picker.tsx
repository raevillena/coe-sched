import React, {
    memo,
    useCallback,
    useRef,
    forwardRef,
    useMemo,
    useState,
    useEffect,
} from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { useForwardedRef } from "../iconforcalendar/use-forward-ref";
import type { ButtonProps } from "@/Components/ui/button";
import { Button } from "@/Components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Input } from "@/Components/ui/input";

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    id: string;
}

const ColorPicker = forwardRef<
    HTMLInputElement,
    Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
    (
        { disabled, value, onChange, onBlur, name, className, id, ...props },
        forwardedRef
    ) => {
        const ref = useForwardedRef(forwardedRef);
        const [open, setOpen] = useState(false);
        const debounceRef = useRef<NodeJS.Timeout | null>(null);

        const parsedValue = useMemo(() => {
            return value || "#FFFFFF";
        }, [value]);

        // Ensure popup state is reset when value changes externally
        useEffect(() => {
            if (!open) {
                ref.current?.blur();
            }
        }, [value]);

        const handleColorChange = useCallback(
            (newColor: string) => {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    onChange(newColor);
                }, 50); // adjust debounce timeout to your preference
            },
            [onChange]
        );

        return (
            <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger  id={id} asChild disabled={disabled} onBlur={onBlur}>
                    <Button
                        {...props}
                        className={cn("block", className)}
                        name={name}
                        onClick={() => {
                            setOpen(true);
                        }}
                        size="icon"
                        style={{
                            backgroundColor: parsedValue,
                        }}
                        variant="outline"
                    >
                        <div />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                    <HexColorPicker
                        color={parsedValue}
                        onChange={handleColorChange}
                    />
                    <div className="mt-2">
                    <Input
                        maxLength={7}
                        onChange={(e) => {
                            handleColorChange(e.currentTarget.value);
                        }}
                        ref={ref}
                        value={parsedValue}
                    />
                    </div>
                </PopoverContent>
            </Popover>
        );
    }
);
ColorPicker.displayName = "ColorPicker";

export default memo(ColorPicker);
