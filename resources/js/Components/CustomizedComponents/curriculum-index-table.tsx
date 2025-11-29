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
import { AcademicProgram } from "@/types/my_types";

interface CurriculumIndexTableProps {
    academic_programs: {
        data: AcademicProgram[];
    };
    Icon: React.ComponentType;
    routeName: string;
}

interface CourseOfferingIndexTableProps {
    academic_programs: {
        data: AcademicProgram[];
    };
    Icon: React.ComponentType;
    routeName: string;
    userRole: "user" | "admin" | "super-admin";
    userDepartmentId: string;
}

export function CurriculumIndexTable({
    academic_programs,
    Icon,
    routeName,
}: CurriculumIndexTableProps) {
    return (
        <Table>
            <TableCaption>Academic Programs Table</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Program Code</TableHead>
                    <TableHead>Program Name</TableHead>
                    <TableHead className="text-center">View</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {academic_programs.data
                    .sort((a, b) =>
                        a.program_name.localeCompare(b.program_name)
                    )
                    .map((academic_program) => (
                        <TableRow key={academic_program.id}>
                            <TableCell className="font-medium">
                                {academic_program.program_code}
                            </TableCell>
                            <TableCell>
                                {academic_program.program_name}
                            </TableCell>
                            <TableCell className="flex justify-center text-right">
                                <Link
                                    href={route(routeName, {
                                        program_code:
                                            academic_program.program_code,
                                    })}
                                    className="transition duration-300 ease-in-out"
                                >
                                    <Button variant="outline" size="icon">
                                        <Icon />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
}

export function CourseOfferingIndexTable({
    academic_programs,
    Icon,
    routeName,
    userRole,
    userDepartmentId,
}: CourseOfferingIndexTableProps) {
    return (
        <Table>
            <TableCaption>Academic Programs Table</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Program Code</TableHead>
                    <TableHead>Program Name</TableHead>
                    <TableHead className="text-center">View</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {academic_programs.data.map((academic_program) => (
                    <TableRow key={academic_program.id}>
                        <TableCell className="font-medium">
                            {academic_program.program_code}
                        </TableCell>
                        <TableCell>{academic_program.program_name}</TableCell>
                        <TableCell className="flex justify-center text-right">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={
                                    userRole === "admin" &&
                                    academic_program.program_code !==
                                        userDepartmentId
                                }
                            >
                                <Link
                                    href={route(routeName, {
                                        program_code:
                                            academic_program.program_code,
                                    })}
                                    className="transition duration-300 ease-in-out"
                                >
                                    <Icon />
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
