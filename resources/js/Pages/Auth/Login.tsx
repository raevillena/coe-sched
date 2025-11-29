import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { LoginProps, User } from "@/types/my_types";
import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { ProfileForm } from "@/Components/CustomizedComponents/user-login-form";
import adminImage from "/Images/coe.png";
import axios from "axios";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Checkbox from "@/Components/Checkbox";

//svg
import metrics from "/Images/undraw/undraw_metrics.svg";
import add_information from "/Images/undraw/undraw_add_information.svg";
import schedule from "/Images/undraw/undraw_schedule.svg";

export default function Login({
    status,
    departments,
}: {
    status?: string;
} & LoginProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [roleError, setRoleError] = useState<string | null>(null);

    const departmentArray = Array.isArray(departments)
        ? departments
        : departments?.data || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const baseUrl = import.meta.env.VITE_APP_URL;

    const checkRoleAndLogin = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axios.post("/check-role", {
                email: data.email,
            });

            if (response.data.role !== "super-admin") {
                setRoleError("Credentials do not match our records.");
                return;
            }
            setRoleError(null);

            post(route("super-admin.login"), {
                onFinish: () => reset("password"),
            });
        } catch (error) {
            setRoleError("Credentials do not match our records.");
        }
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleUserModal = (departmentId: number) => {
        const department = departmentArray.find(
            (dept) => dept.id === departmentId
        );
        if (department) {
            setSelectedDepartment(department.name);
        }
        setModalOpen(true);
        setLoading(true);

        axios
            .get(`/${departmentId}`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAdminModal = () => {
        setShowAdminModal(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setShowAdminModal(false);
        setSelectedDepartment("");
    };

    const [hoveredLogo, setHoveredLogo] = useState<string>(
        "Sign in to your account"
    );

    const handleMouseEnter = (departmentName: string) => {
        setHoveredLogo(departmentName);
    };

    const handleMouseLeave = () => {
        setHoveredLogo("Sign in to your account");
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setData("email", savedEmail);
            setData("remember", true);
        }
    }, []);

    return (
        <GuestLayout>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <p className="mb-4 text-lg text-center text-white ">
                    {hoveredLogo}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {departmentArray.map((department) => (
                    <div
                        key={department.id}
                        className="p-3 transition-transform transform border border-gray-300 rounded-full cursor-pointer hover:shadow-lg hover:scale-105"
                        onMouseEnter={() => handleMouseEnter("Department of " + department.name)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleUserModal(department.id)}
                    >
                        {department?.logo ? (
                            <img
                                src={`${baseUrl}/storage/${department.logo}`}
                                alt={department.name}
                                className="object-cover w-24 h-24 bg-white rounded-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-24 h-24 text-gray-500 bg-white rounded-full">
                                {department.program_code}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div
                className="flex flex-col items-center mt-8 cursor-pointer"
                onMouseEnter={() => handleMouseEnter("Admin Access")}
                onMouseLeave={handleMouseLeave}
                onClick={handleAdminModal}
            >
                <img
                    src={adminImage}
                    alt="Admin Access"
                    className="object-cover w-32 h-32 transition-transform transform border border-gray-300 rounded-full hover:shadow-lg hover:scale-105"
                />
                <p className="mt-2 text-sm font-medium text-center text-white sm:text-base">
                    Admin Access
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black sm:p-0 backdrop-blur-md bg-opacity-90 dark:bg-opacity-80">
                    <div className="w-full max-w-screen-lg p-5 rounded-lg sm:w-auto">
                        <h2 className="mb-2 text-lg font-bold text-center text-white sm:text-2xl">
                            Department of {selectedDepartment}
                        </h2>
                        <p className="text-sm font-medium text-white sm:text-lg">
                            Faculty:
                        </p>
                        <div className="mt-5">
                            {loading ? (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {Array.from({ length: users.length }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-4"
                                            >
                                                <Skeleton className="w-24 h-24 rounded-full" />
                                                <div className="flex flex-col space-y-2">
                                                    <Skeleton className="h-7 w-[200px]" />
                                                    <Skeleton className="h-5 w-[100px]" />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <ProfileForm
                                    users={users}
                                    onUserSelect={(user_id) => {}}
                                    onUserChange={setSelectedUser}
                                />
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3 mt-4">
                            {selectedUser === null && (
                                <Button
                                    className="ms-1"
                                    variant="destructive"
                                    onClick={closeModal}
                                >
                                    Close
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black sm:p-0 backdrop-blur-md bg-opacity-90 dark:bg-opacity-80">
                    <div className="w-full max-w-screen-lg p-5 rounded-lg sm:w-auto">
                        <h2 className="mb-4 text-lg font-bold text-center text-white sm:text-xl">
                            Enter Super Admin Credentials
                        </h2>
                        <form onSubmit={checkRoleAndLogin}>
                            <div>
                                <Label htmlFor="email" className="text-white">
                                    Email
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block lg:w-[350px] mt-1"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <img
                                src={add_information}
                                alt="add_information"
                                className="fixed bottom-4 left-4 w-auto h-[90px] sm:h-[90px] lg:h-[200px] object-contain hidden sm:block opacity-75 pointer-events-none z-[5]"
                            />

                            <div className="mt-4">
                                <Label
                                    htmlFor="password"
                                    className="text-white"
                                >
                                    Password
                                </Label>
                                <div className="relative flex items-center">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        className="block w-full mt-1"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <Eye size={20} />
                                        ) : (
                                            <EyeOff size={20} />
                                        )}
                                    </div>
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>
                            {roleError && (
                                <p className="px-2 py-1 text-sm text-red-500 rounded">
                                    {roleError}
                                </p>
                            )}
                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="text-sm text-white ms-2">
                                        Remember me
                                    </span>
                                </label>
                            </div>
                            {/* <div className="flex flex-wrap items-center justify-end gap-3 mt-4"> */}
                            <div className="grid justify-center grid-cols-2 gap-2 mt-4">
                                <Button
                                    type="submit"
                                    className="ms-1"
                                    disabled={processing}
                                >
                                    Log in
                                </Button>
                                <Button
                                    className="ms-1"
                                    variant="destructive"
                                    onClick={closeModal}
                                >
                                    Close
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
