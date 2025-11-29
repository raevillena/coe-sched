import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { FacultyProps } from "@/types/my_types";
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
import { ToastDeactivateWarning } from "@/Components/CustomizedComponents/toast-update-warning";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { UserRoundX, Users } from "lucide-react";
import { ActiveFacultyTable } from "@/Components/CustomizedComponents/table-faculty";
import useTour from "@/Composables/useTour";

export default function Index({
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
    } = useFacultiesSearch("faculties.index");

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        router.reload({ only: ["faculties"] });
    }, [reloadKey]);

    //deactivate Faculty
    const deactivateFaculty = (id: number) => {
        ToastDeactivateWarning({
            auth,
            question:
                "Are you sure you want to deactivate this faculty member account?",
            routeName: "faculties.active_status",
            params: { faculty: id },
            successMessage: "Faculty member deactivated successfully.",
            errorMessage: "Failed to deactivate faculty member.",
            onDeactivateSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    const userDepartmentId = auth?.user?.department_id;
    const userRole = auth?.user?.role;

    useTour({
        user: auth.user,
        name: "showIndexFacultyTalk",
        steps: () => [
            {
                title: `👨‍🏫 Faculty Account List`,
                intro: `This section provides a <b>comprehensive directory</b> of all faculty members. <br><br>  
                        You can <b>edit</b> their details, as well as <b>activate</b> or <b>deactivate</b> accounts when necessary. <br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "four-fifty-tool-tip",
            },
            {
                intro: `🔍 <b>Search Bar</b><br>  
                        Quickly locate a faculty member by typing their name here.`,
                element: document.querySelector("#search") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🏛️ <b>Department Filter</b><br>  
                        Select a department to display faculty members within that category.`,
                element: document.querySelector(
                    "#department_id"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `✏️ <b>Edit Faculty Details</b><br>  
                        Click this button to update a faculty member’s information.`,
                element: document.querySelector("#edit-faculty") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🚫 <b>Deactivate Faculty</b><br>  
                        Click this button to <b>disable</b> a faculty member’s account. <br><br>  
                        Once deactivated, the faculty member will lose access until reactivated.`,
                element: document.querySelector(
                    "#deactivate-faculty"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📋 <b>Inactive Faculty List</b><br>  
                        View deactivated faculty members and <b>reactivate</b> their accounts if needed.`,
                element: document.querySelector(
                    "#inactive-faculty-button"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
        ],
    });

    const [pageNumber, setPageNumber] = useState<string>("1");

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                // <h2 className="text-xl font-semibold leading-tight">
                //     Faculty Account List
                // </h2>
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
                                    A list of all active Faculty Members.
                                </p>
                            </div>
                            <div className="mt-4 lg:mt-0">
                                <Link
                                    href={route("faculties.index_in_active")}
                                    className="flex"
                                >
                                    <Button id="inactive-faculty-button">
                                        <UserRoundX/>
                                        Inactive Faculty
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex flex-col justify-start sm:flex-row mt-6 mb-5">
                            <div className="relative text-sm col-span-3">
                                <div className="absolute pl-2 left-0 top-0 bottom-0 flex items-center pointer-events-none">
                                    <MagnifyingGlass />
                                </div>

                                <Input
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        setPageNumber("1"); // Reset page number when search changes
                                    }}
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
                                    onValueChange={(value) => {
                                        setDepartmentId(value);
                                        setPageNumber("1"); // Reset page number when department filter changes
                                    }}
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
                        <ActiveFacultyTable
                            faculties={faculties}
                            departments={departments}
                            deactivateFaculty={deactivateFaculty}
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
