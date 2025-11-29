"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Input } from "@/Components/ui/input";

export interface SelectOption {
    value: number;
    label: number;
}

export interface SelectLoadingProps {
    options?: SelectOption[];
    value?: number;
    onChange?: (value: number | undefined) => void;
    name?: string;
    id?: string;
    className?: string;
}

export const SelectLoading = React.forwardRef<
    HTMLInputElement,
    SelectLoadingProps
>(
    ({
        options = [
            { value: 3, label: 3 },
            { value: 6, label: 6 },
            { value: 9, label: 9 },
        ],
        className = "",
        value,
        onChange,
        id,
        name,
    }) => {
        const [open, setOpen] = React.useState(false);

        function handleSelect(val: number | undefined) {
            if (onChange) onChange(val);
            setOpen(false);
        }

        function handleCustomInput(e: React.ChangeEvent<HTMLInputElement>) {
            const numValue = e.target.value
                ? Number(e.target.value)
                : undefined;
            if (onChange) onChange(numValue);
        }

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            "pl-10",
                            className
                        )}
                        onClick={() => setOpen(!open)}
                        tabIndex={0}
                    >
                        <span className="flex-1 text-left">
                            {value !== undefined && value !== null
                                ? options.find(
                                      (option) => option.value === value
                                  )?.label ?? value
                                : "Select deloading..."}
                        </span>
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[200px] p-0"
                    align="start"
                    sideOffset={4}
                >
                    <Command className="w-full">
                        <div className="px-3 py-3 border-b">
                            <Input
                                type="number"
                                className="w-full"
                                placeholder="Custom number"
                                value={
                                    value !== undefined &&
                                    value !== null &&
                                    !options.some(
                                        (option) => option.value === value
                                    )
                                        ? value
                                        : ""
                                }
                                onChange={handleCustomInput}
                                onClick={(e) => e.stopPropagation()}
                                id={id}
                                name={name}
                            />
                        </div>
                        <CommandList>
                            <CommandEmpty>No option found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value.toString()}
                                        onSelect={() => {
                                            handleSelect(
                                                option.value === value
                                                    ? undefined
                                                    : option.value
                                            );
                                        }}
                                    >
                                        <span>{option.label}</span>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === option.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }
);

SelectLoading.displayName = "SelectLoading";
