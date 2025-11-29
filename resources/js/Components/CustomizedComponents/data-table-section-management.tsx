import React, { useEffect, useState } from "react";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Section } from "@/types/my_types";
import axios from "axios";
import { toast_error, toast_success } from "@/types/my_types/mytoast";
import { router } from "@inertiajs/react";

const updateSectionActiveStatus = (
    id: number,
    newState: number,
    userTheme: "dark" | "light" | "system",
    section_name: string
) => {
    axios
        .put(
            route("sections.active_status", { id }),
            {
                is_active: Number(newState),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            toast_success({
                message: `${section_name} status updated successfully!`,
                userTheme,
            });
            router.reload();
        })
        .catch((error) => {
            toast_error({
                message: error.response?.data?.message || error.message,
                userTheme,
            });
        });
};

interface SectionDataTableProps {
    sections: Section[];
    userTheme: "dark" | "light" | "system";
    userRole: "user" | "admin" | "super-admin";
    userDepartmentProgramCode: string;
}

export function SectionDataTable({
    sections,
    userTheme,
    userRole,
    userDepartmentProgramCode,
}: SectionDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "program_name", desc: false },
    ]);
    const [filter, setFilter] = useState("");

    const data = sections ?? [];

    // Count active and total sections
    const totalSections = data.length;
    const activeSections = data.filter(
        (section) => section.is_active === 1
    ).length;

    const columns: ColumnDef<Section>[] = [
        {
            accessorKey: "program_name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Department
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("program_name")}</div>
            ),
            filterFn: "includesString",
        },
        {
            accessorKey: "level",
            header: "Year Level",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("level")}</div>
            ),
        },
        {
            accessorKey: "section_name",
            header: "Section Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("section_name")}</div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => (
                <div
                    className={`capitalize ${
                        row.getValue("is_active") === 1
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    {row.getValue("is_active") === 1 ? "Active" : "Inactive"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const section = row.original;

                const [isActive, setIsActive] = useState(
                    section.is_active === 1
                );

                const handleToggle = () => {
                    const newState = isActive ? 0 : 1;
                    setIsActive(!isActive);
                    section.is_active = newState;
                    updateSectionActiveStatus(
                        section.id,
                        newState,
                        userTheme,
                        section.section_name
                    );
                };

                useEffect(() => {
                    setIsActive(section.is_active === 1);
                }, [section.is_active]);

                const isDisabled =
                    userRole === "admin" &&
                    section.program_code !== userDepartmentProgramCode;

                return (
                    <div
                        className="flex items-center space-x-3"
                        id="active-section-toggle"
                    >
                        <div
                            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                                isActive ? "bg-green-500" : "bg-red-500"
                            } ${
                                isDisabled
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }`}
                            onClick={!isDisabled ? handleToggle : undefined}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                    isActive ? "translate-x-6" : "translate-x-0"
                                }`}
                            ></div>
                        </div>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filter },
    });

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between py-6 space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                    id="filter_dept"
                    placeholder="Filter departments..."
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className="w-full sm:max-w-sm"
                />

                <div className="flex items-center text-sm font-medium space-x-2 p-2 rounded-lg border">
                    <span className="font-semibold flex items-center">
                        <svg
                            className="text-green-600 w-5 h-5 inline-block mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Active Sections:
                    </span>
                    <span>{activeSections}</span>
                    <span className="text-gray-500">/</span>
                    <span>{totalSections}</span>
                </div>
            </div>
            <div className="rounded-md border">
                <div className="max-h-96 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SectionDataTable;
