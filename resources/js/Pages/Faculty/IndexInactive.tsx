import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FacultyProps } from "@/types/my_types";
import { InActiveFacultyTable } from "@/Components/CustomizedComponents/table-faculty";
import { useFacultiesSearch } from "@/types/my_types/useFacultiesSearch";
import PaginationComponent from "@/Components/CustomizedComponents/pagination";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import MagnifyingGlass from "@/Components/icons/MagnifyingGlass";
import { ToastActivateWarning } from "@/Components/CustomizedComponents/toast-update-warning";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function IndexInactive({
    auth,
    faculties,
    departments,
    breadcrumbs,
}: FacultyProps) {
    const {
        inputValue,
        setInputValue,
        departmentId,
        setDepartmentId,
        updatedPageNumber,
    } = useFacultiesSearch("faculties.index_in_active");

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        router.reload({ only: ["faculties"] });
    }, [reloadKey]);

    //activate Faculty
    const activateFaculty = (id: number) => {
        ToastActivateWarning({
            auth,
            question:
                "Are you sure you want to activate this faculty member account?",
            routeName: "faculties.active_status",
            params: { faculty: id },
            successMessage: "Faculty member activated successfully.",
            errorMessage: "Failed to activate faculty member.",
            onActivateSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    const userDepartmentId = auth?.user?.department_id;
    const userRole = auth?.user?.role;

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl lg:text-3xl font-semibold text-center flex items-center justify-center">
                    Faculty Account List <Users size={36} className="ml-2" />
                </h2>
            }
        >
            <Head title="Faculty Account List" />

            <div>
                <div className="mx-auto max-w-7x1">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="flex items-center justify-center lg:justify-start text-xl font-semibold">
                                    College of Engineering Faculty
                                </h1>
                                <p className="mt-2 text-sm ">
                                    A list of all inactive Faculty Members.
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex flex-col justify-start sm:flex-row mt-6 mb-5">
                            <div className="relative text-sm col-span-3">
                                <div className="absolute pl-2 left-0 top-0 bottom-0 flex items-center pointer-events-none">
                                    <MagnifyingGlass />
                                </div>

                                <Input
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    value={inputValue}
                                    id="search"
                                    type="text"
                                    placeholder="Search faculty data..."
                                    autoComplete="off"
                                    className="border-0 py-2 pl-10 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div>
                                <Select
                                    name="department_id"
                                    value={departmentId}
                                    onValueChange={setDepartmentId}
                                >
                                    <SelectTrigger
                                        id="department_id"
                                        className="border-0 lg:ml-5 lg:mt-0 mt-4 ring-1 ring-inset ring-gray-200  sm:text-sm sm:leading-6"
                                    >
                                        <SelectValue placeholder="Filter by Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value=" ">
                                                Filter by Department
                                            </SelectItem>

                                            {departments.data
                                                .sort((a, b) =>
                                                    a.name.localeCompare(b.name)
                                                )
                                                .map((department) => (
                                                    <SelectItem
                                                        value={department.id.toString()}
                                                        key={department.id}
                                                    >
                                                        {department.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* table */}
                        <InActiveFacultyTable
                            faculties={faculties}
                            departments={departments}
                            activateFaculty={activateFaculty}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            departmentId={departmentId}
                            setDepartmentId={setDepartmentId}
                            userDepartmentId={userDepartmentId}
                            userRole={userRole}
                        />
                    </div>
                    <div>
                        <PaginationComponent
                            updatedPageNumber={updatedPageNumber}
                            meta={faculties.meta}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
