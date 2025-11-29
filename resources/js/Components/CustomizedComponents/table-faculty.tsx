import { Link } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { UserRoundCheck, UserRoundPen, UserRoundX } from "lucide-react";
import { Faculty, Meta, Department } from "@/types/my_types";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface ActiveTableFacultyProps {
    faculties: {
        data: Faculty[];
        meta: Meta;
    };
    departments: {
        data: Department[];
    };
    deactivateFaculty: (id: number) => void;
    inputValue: string;
    setInputValue: (term: string) => void;
    departmentId: string;
    setDepartmentId: (value: string) => void;
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
}

interface InActiveTableFacultyProps {
    faculties: {
        data: Faculty[];
        meta: Meta;
    };
    departments: {
        data: Department[];
    };
    activateFaculty: (id: number) => void;
    inputValue: string;
    setInputValue: (term: string) => void;
    departmentId: string;
    setDepartmentId: (value: string) => void;
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
}

const formatFacultyName = (name: string): string => {
    const nameParts = name.split(" ");

    if (nameParts.length === 3) {
        // Case: Engr. Raymund Pedro
        return `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2]}`;
    } else if (nameParts.length > 3) {
        // Case: Engr. Raymund Jan Pedro or any other name with more than 3 parts
        return `${nameParts[0]} ${nameParts[1][0]}. ${
            nameParts[nameParts.length - 1]
        }`;
    }
    return name;
};

export function ActiveFacultyTable({
    faculties,
    deactivateFaculty,
    userDepartmentId,
    userRole,
}: ActiveTableFacultyProps) {
    return (
        <Table>
            <TableCaption>List of Active Faculty Members</TableCaption>
            <TableHeader>
                <TableRow>
                    {/* <TableHead>ID</TableHead> */}
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {faculties.data.length > 0 ? (
                    faculties.data
                        .filter((faculty) => {
                            return (
                                faculty.role !== "super-admin" ||
                                (userRole === "super-admin" &&
                                    (faculty.is_dean === 1 ||
                                        faculty.role === "super-admin"))
                            );
                        })
                        .map((faculty) => (
                            <TableRow key={faculty.id}>
                                {/* <TableCell>{faculty.id}</TableCell> */}
                                <TableCell>{faculty.name}</TableCell>
                                <TableCell>{faculty.email}</TableCell>
                                <TableCell>{faculty.department.name}</TableCell>
                                <TableCell>{faculty.position.name}</TableCell>
                                <TableCell>{faculty.role}</TableCell>
                                <TableCell>{faculty.created_at}</TableCell>
                                <TableCell className="flex justify-center space-x-3 text-right">
                                    <Tooltip
                                        key={`tooltip_edit_faculty_${faculty.id}`}
                                    >
                                        <TooltipTrigger asChild>
                                            {userRole !== "admin" ||
                                            faculty.department.id ===
                                                userDepartmentId ? (
                                                <Link
                                                    href={route(
                                                        "faculties.edit",
                                                        faculty.id
                                                    )}
                                                >
                                                    <Button
                                                        id="edit-faculty"
                                                        variant="outline"
                                                        size="icon"
                                                        className="transition duration-300 ease-in-out hover:bg-blue-500"
                                                    >
                                                        <UserRoundPen />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    id="edit-faculty"
                                                    variant="outline"
                                                    size="icon"
                                                    className="transition duration-300 ease-in-out"
                                                    disabled
                                                >
                                                    <UserRoundPen />
                                                </Button>
                                            )}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                <span
                                                    style={{ color: "#3B82F6" }}
                                                >
                                                    Edit
                                                </span>{" "}
                                                Faculty{" "}
                                                {formatFacultyName(
                                                    faculty.name
                                                )}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip
                                        key={`tooltip_deactivate_faculty_${faculty.id}`}
                                    >
                                        <TooltipTrigger asChild>
                                            <Button
                                                id="deactivate-faculty"
                                                className="transition duration-300 ease-in-out hover:bg-yellow-500"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    deactivateFaculty(
                                                        faculty.id
                                                    )
                                                }
                                                disabled={
                                                    userRole === "admin" &&
                                                    faculty.department.id !==
                                                        userDepartmentId
                                                }
                                            >
                                                <UserRoundX />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {/* EAB308 = yellow-500 */}
                                                <span
                                                    style={{ color: "#EAB308" }}
                                                >
                                                    Deactivate
                                                </span>{" "}
                                                Faculty{" "}
                                                {formatFacultyName(
                                                    faculty.name
                                                )}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={8}
                            className="text-center text-red-600"
                        >
                            No faculty account activated
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export function InActiveFacultyTable({
    faculties,
    activateFaculty,
    userDepartmentId,
    userRole,
}: InActiveTableFacultyProps) {
    return (
        <Table>
            <TableCaption>List of Inactive Faculty Members</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {faculties.data.length > 0 ? (
                    faculties.data.map((faculty) => (
                        <TableRow key={faculty.id}>
                            <TableCell>{faculty.id}</TableCell>
                            <TableCell>{faculty.name}</TableCell>
                            <TableCell>{faculty.email}</TableCell>
                            <TableCell>{faculty.department.name}</TableCell>
                            <TableCell>{faculty.position.name}</TableCell>
                            <TableCell>{faculty.role}</TableCell>
                            <TableCell>{faculty.created_at}</TableCell>
                            <TableCell className="flex justify-center space-x-3 text-right">
                                <Tooltip
                                    key={`tooltip_activate_faculty_${faculty.id}`}
                                >
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="transition duration-300 ease-in-out hover:bg-green-500"
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                activateFaculty(faculty.id)
                                            }
                                            disabled={
                                                userRole === "admin" &&
                                                faculty.department.id !==
                                                    userDepartmentId
                                            }
                                        >
                                            <UserRoundCheck />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {/* 22C55E = green-500 */}
                                            <span style={{ color: "#22C55E" }}>
                                                Activate
                                            </span>{" "}
                                            Faculty{" "}
                                            {formatFacultyName(faculty.name)}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={8}
                            className="text-center text-red-600"
                        >
                            No faculty account deactivated
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
