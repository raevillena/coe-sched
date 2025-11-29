import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import InputError from "@/Components/InputError";
import def_profile_pic from "/Images/def_profile_pic.png";
import { FacultyProps } from "@/types/my_types";

export default function Edit({ auth, faculty, departments, breadcrumbs }: FacultyProps) {
    const departmentArray = Array.isArray(departments)
    ? departments
    : departments.data || [];
    const [positions, setPositions] = useState<Array<{ id: number; name: string }>>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: faculty.data.name,
        email: faculty.data.email,
        password: faculty.data.password, 
        position_id: faculty.data.position.id,
        department_id: faculty.data.department.id,
        profile_picture: null as File | null,
        role: faculty.data.role,
    });

    useEffect(() => {
        if (data.department_id) {
            axios
                .get(route("positions.index", { department_id: data.department_id }))
                .then((response) => {
                    setPositions(response.data.data || []);
                })
                .catch((error) => {
                    console.error("Error fetching positions:", error);
                });
        }
    }, [data.department_id]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.size <= 10 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imgElement = document.getElementById("profile_picture_preview") as HTMLImageElement;
                if (imgElement) imgElement.src = reader.result as string;
            };
            reader.readAsDataURL(file);
            setData("profile_picture", file);
        } else {
            alert("File is too large. Please choose a file smaller than 10MB.");
        }
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("faculties.update", { faculty: faculty.data.id }), {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        });
    };

    // Load profile picture 
    const baseUrl = import.meta.env.VITE_APP_URL;
    const imagePath = faculty.data.profile_picture
        ? `${baseUrl}/storage/${faculty.data.profile_picture}`
        : def_profile_pic;

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs} 
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Faculty Account
                </h2>
            }
        >
            <Head title="Edit Faculty Member Account" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-12">
                        <form onSubmit={submit}>
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                                    <div className="flex items-center">
                                        <div className="relative w-24 h-24">
                                            <img
                                                id="profile_picture_preview"
                                                className="rounded-full w-full h-full object-cover"
                                                src={imagePath}
                                                alt="Profile Preview"
                                            />
                                            <input
                                                id="profile_picture"
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Faculty Information
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Use this form to update a faculty
                                            member account.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData("name", e.target.value)
                                                }
                                                id="name"
                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    errors.name
                                                        ? "ext-red-900 focus:ring-red-500 focus:border-red-500 border-red-300"
                                                        : ""
                                                }`}
                                            />

                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                id="password"
                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    errors.password
                                                        ? "ext-red-900 focus:ring-red-500 focus:border-red-500 border-red-300"
                                                        : ""
                                                }`}
                                            />

                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="department_id"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Department
                                            </label>
                                            <select
                                                id="department_id"
                                                value={data.department_id}
                                                onChange={(e: any) => {
                                                    setData({
                                                        ...data,
                                                        department_id: e.target.value,
                                                        position_id: 0, 
                                                    });
                                                }}
                                                // onChange={(e:any) =>
                                                //     setData("department_id", e.target.value)

                                                // }
                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    errors.department_id
                                                        ? "ext-red-900 focus:ring-red-500 focus:border-red-500 border-red-300"
                                                        : ""
                                                }`}
                                            >
                                                <option value="">
                                                    Select a Department
                                                </option>
                                                {departmentArray.map((item) => {
                                                    return (
                                                        <option
                                                        value={item.id}
                                                        key={item.id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                    )
                                                })}
                                            </select>
                                            <InputError
                                                message={errors.department_id}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="position_id"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Position
                                            </label>
                                            <select
                                                id="position_id"
                                                value={data.position_id}
                                                onChange={(e:any) =>
                                                    setData("position_id", e.target.value)
                                                }
                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    errors.position_id
                                                        ? "ext-red-900 focus:ring-red-500 focus:border-red-500 border-red-300"
                                                        : ""
                                                }`}
                                            >
                                                <option value="">
                                                    Select a Position
                                                </option>
                                                {positions.map((position) => {
                                                    return(
                                                        <option
                                                        value={position.id}
                                                        key={position.id}
                                                    >
                                                        {position.name}
                                                    </option>
                                                    )
                                                })}
                                            </select>
                                            <InputError
                                                message={errors.position_id}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                                id="email"
                                                autoComplete="email"
                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    errors.email
                                                        ? "ext-red-900 focus:ring-red-500 focus:border-red-500 border-red-300"
                                                        : ""
                                                }`}
                                            />

                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="role"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Role
                                            </label>
                                            <select
                                                id="role"
                                                value={data.role}
                                                onChange={(e) =>
                                                    setData(
                                                        "role",
                                                        e.target.value
                                                    )
                                                }
                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    errors.role
                                                        ? "ext-red-900 focus:ring-red-500 focus:border-red-500 border-red-300"
                                                        : ""
                                                }`}
                                            >
                                                <option value="">
                                                    Select a Role
                                                </option>
                                                <option value="super-admin">
                                                    Super Admin
                                                </option>
                                                <option value="admin">
                                                    Admin
                                                </option>
                                                <option value="user">
                                                    User
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.role}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <Link
                                        href={route("faculties.index")}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}