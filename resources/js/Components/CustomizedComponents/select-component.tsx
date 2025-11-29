import { useEffect, useState } from "react";
import {
    Department,
    Position,
    Period,
    Level,
    AcademicYear,
} from "@/types/my_types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import axios from "axios";
import { log } from "console";

interface SelectDeptProps {
    id: string;
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
    departments: { data: Department[] };
    value: string;
    onChange: (value: string) => void;
}

interface SelectPositionProps {
    id: string;
    position: { data: Position[] };
    departmentId: string;
    value: string | undefined;
    onChange: (value: string) => void;
    userRole: "user" | "admin" | "super-admin";
}

interface ControlPositionProps {
    id: string;
    position: { data: Position[] };
    value: string | undefined;
    onChange: (value: string) => void;
}

interface SelectPeriodProps {
    id: string;
    period: { data: Period[] };
    value: string | undefined;
    onChange: (value: string) => void;
}

interface SelectLevelProps {
    id: string;
    level: { data: Level[] };
    value: string | undefined;
    onChange: (value: string) => void;
}

interface SelectRoleProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    userRole: "user" | "admin" | "super-admin";
}

interface SelectAYProps {
    id: string;
    academic_years: { data: AcademicYear[] };
    value: string;
    onChange: (value: string) => void;
}

// Select Department
export function SelectDept({
    departments,
    value,
    onChange,
    id,
    userDepartmentId,
    userRole,
}: SelectDeptProps) {
    const departmentArray = Array.isArray(departments)
        ? departments
        : departments.data || [];

    const filteredDepartments =
        userRole === "admin"
            ? departmentArray.filter(
                  (department) => department.id === userDepartmentId
              )
            : departmentArray;

    const sortedDepartments = filteredDepartments.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    return (
        <Select name="department_id" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>
                    {/* Add a "None" option */}
                    {/* <SelectItem value="null" key="none">
                        Select Department
                    </SelectItem> */}
                    {sortedDepartments.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Select Department for Course Offering - getting Program Code
// interface SelectDeptCourseOfferingProps {
//     id: string;
//     userDepartmentId: number;
//     userRole: "user" | "admin" | "super-admin";
//     departments: { data: Department[] };
//     value: { id: string, program_code: string };
//     onChange: (value: { id: string, program_code: string }) => void;
// }

// export function SelectDeptCourseOffering({
//     departments,
//     value,
//     onChange,
//     id,
//     userDepartmentId,
//     userRole,
// }: SelectDeptCourseOfferingProps) {
//     const departmentArray = Array.isArray(departments)
//         ? departments
//         : departments.data || [];

//     const filteredDepartments = userRole === 'admin'
//         ? departmentArray.filter(department => department.id === userDepartmentId)
//         : departmentArray;

//     return (
//         <Select name="department_id" value={value.id} onValueChange={(selectedValue) => {
//             const selectedDepartment = departmentArray.find(dept => dept.id.toString() === selectedValue);
//             if (selectedDepartment) {
//                 onChange({ id: selectedDepartment.id.toString(), program_code: selectedDepartment.program_code });
//             }
//         }}>
//             <SelectTrigger id={id}>
//                 <SelectValue placeholder="Select Department" />
//             </SelectTrigger>
//             <SelectContent>
//                 <SelectGroup>
//                     <SelectLabel>Departments</SelectLabel>
//                     {filteredDepartments.map((item) => (
//                         <SelectItem value={item.id.toString()} key={item.id}>
//                             {item.name}
//                         </SelectItem>
//                     ))}
//                 </SelectGroup>
//             </SelectContent>
//         </Select>
//     );
// }

//Select Department for Course Offering
export function SelectDeptCourseOffering({
    departments,
    value,
    onChange,
    id,
    userDepartmentId,
    userRole,
}: SelectDeptProps) {
    const departmentArray = Array.isArray(departments)
        ? departments
        : departments.data || [];

    const filteredDepartments =
        userRole !== "super-admin"
            ? departmentArray.filter(
                  (department) => department.id === userDepartmentId
              )
            : departmentArray;

    const sortedDepartments = filteredDepartments.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    useEffect(() => {
        if (
            userRole === "admin" &&
            filteredDepartments.length > 0 &&
            value !== filteredDepartments[0].program_code
        ) {
            onChange(filteredDepartments[0].program_code);
        }
    }, [userRole, userDepartmentId, departments]);

    return (
        <Select name="department_id" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>
                    {sortedDepartments.map((item) => (
                        <SelectItem value={item.program_code} key={item.id}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Select Position for Create Faculty
export function SelectPosition({
    id,
    position,
    departmentId,
    value,
    onChange,
    userRole, // Added userRole as a prop
}: SelectPositionProps) {
    const [positions, setPositions] = useState<Position[]>(
        position?.data || []
    );

    useEffect(() => {
        if (departmentId) {
            axios
                .get(route("positions.index", { department_id: departmentId }))
                .then((response) => {
                    setPositions(response.data.data);
                })
                .catch((error) => {
                    console.error("Error fetching positions:", error);
                });
        }
    }, [departmentId]);

    return (
        <Select name="position_id" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Positions</SelectLabel>
                    {/* <SelectItem value="null" key="none">
                        Select Position
                    </SelectItem> */}
                    {positions
                        .filter(
                            (item) =>
                                userRole === "super-admin" ||
                                (item.id !== 21 &&
                                    item.name.toLowerCase() !== "dean")
                        )
                        .map((item) => (
                            <SelectItem
                                value={item.id.toString()}
                                key={item.id}
                            >
                                {item.name}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Control Position
export function ControlPosition({
    id,
    position,
    value,
    onChange,
}: ControlPositionProps) {
    // const [positions, setPositions] = useState<Position[]>(
    //     position?.data || []
    // );

    const [positions, setPositions] = useState<Position[]>([]);

    useEffect(() => {
        if (Array.isArray(position?.data)) {
            setPositions(position.data);
        }
    }, [position]);

    return (
        <Select name="position_id" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Positions</SelectLabel>
                    {/* <SelectItem value="null" key="none">
                        Select Position
                    </SelectItem> */}
                    {positions.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Select Period
export function SelectPeriod({
    period,
    value,
    onChange,
    id,
}: SelectPeriodProps) {
    const [periods, setPeriods] = useState<Period[]>([]);

    useEffect(() => {
        if (Array.isArray(period?.data)) {
            setPeriods(period.data);
        }
    }, [period]);

    return (
        <Select name="period_id" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Semester</SelectLabel>
                    {/* <SelectItem value="null" key="none">
                        Select Period
                    </SelectItem> */}
                    {periods.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                            {item.period_name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Select Level
export function SelectLevel({ level, value, onChange, id }: SelectLevelProps) {
    const [levels, setLevels] = useState<Level[]>([]);

    useEffect(() => {
        if (Array.isArray(level?.data)) {
            setLevels(level.data);
        }
    }, [level]);

    return (
        <Select name="level_id" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Year Level" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Year Levels</SelectLabel>
                    {/* <SelectItem value="null" key="none">
                        Select Year Level
                    </SelectItem> */}
                    {levels.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                            {item.level_name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Select Role
export function SelectRole({ value, onChange, id, userRole }: SelectRoleProps) {
    return (
        <Select name="role" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    {/* <SelectItem value="null" key="none">
                        Select Role
                    </SelectItem> */}
                    {userRole === "super-admin" && (
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                    )}
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

//Select Academic Year
export function SelectAY({
    id,
    value,
    onChange,
    academic_years,
}: SelectAYProps) {
    const [academicYear, setAcademicYear] = useState<AcademicYear[]>([]);

    useEffect(() => {
        if (Array.isArray(academic_years?.data)) {
            const sortedYears = [...academic_years.data].sort(
                (a, b) => Number(b.academic_year) - Number(a.academic_year)
            );
            setAcademicYear(sortedYears);
        }
    }, [academic_years]);

    return (
        <Select name="ay_id" value={value} onValueChange={onChange}>
            <SelectTrigger id={id}>
                <SelectValue placeholder="Select Academic Year" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Academic Year</SelectLabel>
                    {academicYear.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                            {item.academic_year} - {Number(item.academic_year) + 1}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
