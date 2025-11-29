import MagnifyingGlass from '@/Components/icons/MagnifyingGlass';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { FacultyProps, Links } from "@/types/my_types";
import { toast } from "react-hot-toast";

interface PageProps extends InertiaPageProps {
    search?: string;
    department_id?: string; 
}

export default function Index({ auth, faculties, departments, breadcrumbs }: FacultyProps) {
    const { props } = usePage();
    const pageProps = props as PageProps;

    const [searchTerm, setSearchTerm] = useState<string>(pageProps.search || "");
    const [inputValue, setInputValue] = useState<string>(pageProps.search || "");
    const [pageNumber, setPageNumber] = useState<string>("");
    const [departmentId, setDepartmentId] = useState<string>(pageProps.department_id || ""); 
    const isInitialRender = useRef<boolean>(true);

    const updatedPageNumber = (link: Links) => { 
        if (link.url) {
            setPageNumber(link.url.split("=")[1]);
        }
    };

    const facultiesUrl = useMemo(() => {
        const url = new URL(route("faculties.index"));

        url.searchParams.append("page", pageNumber);

        if (departmentId) {
            url.searchParams.append("department_id", departmentId);
            setPageNumber("1");
        }

        if (searchTerm) {
            url.searchParams.append("search", searchTerm);
        }

        return url;
    }, [searchTerm, pageNumber, departmentId]);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        router.visit(facultiesUrl, {
            preserveScroll: true,
            preserveState: true,
            // replace: true,
        });
    }, [facultiesUrl]);

    // debounce
    useEffect(() => {
        if (inputValue.length == 0) {
            setSearchTerm("");
            setPageNumber("");
            return;
        }

        const handler = setTimeout(() => {
            setSearchTerm(inputValue);
            setPageNumber("1");
        }, 1000); 

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue]);

    function deleteFaculty(id: number) {
        if (confirm('Are you sure you want to delete this faculty member account?')) {
            router.delete(route('faculties.destroy', id), {
                preserveScroll: true,
            });
        }
    }

    return (
        <AuthenticatedLayout
        
            user={auth.user}
            breadcrumbs={breadcrumbs} 
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Faculty Account List
                </h2>
            }
        >
            <Head title="Faculty List" />

            <div className="bg-gray-100 ">
                <div className="mx-auto max-w-7xl">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="mt-3 text-xl font-semibold text-gray-900">
                                    College of Engineering Faculty
                                </h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    A list of all the Faculty Members.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-start sm:flex-row mt-6">
                            <div className="relative text-sm text-gray-800 col-span-3">
                                <div className="absolute pl-2 left-0 top-0 bottom-0 flex items-center pointer-events-none text-gray-500">
                                    <MagnifyingGlass />
                                </div>

                                <input
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    value={inputValue}
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search faculty data..."
                                    id="search"
                                    className="block rounded-lg border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <select
                                name="departmentId"
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                className="block rounded-lg border-0 py-2 ml-5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            >
                                <option value="">Filter By Department</option>
                                {departments.data.map((department) => {
                                    return (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="mt-8 flex flex-col">
                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg relative">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        ID
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        Email
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        Role
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Department
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Position
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Created At
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                                    />
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {faculties.data.map((faculty) => {
                                                    return (
                                                        <tr key={faculty.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                {faculty.id}
                                                            </td>
                                                            <td className="whitespace-nowrap py-4 pl- 4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                {faculty.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {faculty.email}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {faculty.role}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {faculty.department.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {faculty.position.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {faculty.created_at}
                                                            </td>

                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                <Link
                                                                    href={route('faculties.edit', faculty.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button onClick={() => deleteFaculty(faculty.id)} className="ml-2 text-indigo-600 hover:text-indigo-900">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <Pagination updatedPageNumber={updatedPageNumber} meta={faculties.meta}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}