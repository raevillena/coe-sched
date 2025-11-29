import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import { FacultyProps, Position } from "@/types/my_types";
import {
    SelectDept,
    SelectPosition,
    SelectRole,
} from "@/Components/CustomizedComponents/select-component";
import def_profile_pic from "/Images/def_profile_pic.png";
import axios, { AxiosError } from "axios";
import { UserPlus, X, Eye, EyeOff } from "lucide-react";
import useTour from "@/Composables/useTour";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const response = await axios.get(route("check_email"), {
            params: { email: email },
        });
        return response.data.exists;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const formSchema = z
    .object({
        name: z.string().min(2, {
            message: "Full name must be at least 2 characters.",
        }),
        email: z
            .string()
            .min(1, { message: "Email is required." })
            .email("Invalid email address."),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter.",
            })
            .regex(/[a-z]/, {
                message: "Password must contain at least one lowercase letter.",
            })
            .regex(/[0-9]/, {
                message: "Password must contain at least one number.",
            }),
        confirmPassword: z.string().min(8, {
            message: "Confirm password must be at least 8 characters",
        }),
        department_id: z
            .string()
            .min(1, { message: "Please choose a department first." }),
        position_id: z
            .string()
            .min(1, {
                message:
                    "Please select a position after choosing a department.",
            })
            .optional(),
        role: z.string().min(1, "Please choose the Role of the user."),
        profile_picture: z.instanceof(File).nullable(),
        is_dean: z.number().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });

export default function CreateUserForm({
    auth,
    breadcrumbs,
    departments,
}: FacultyProps) {
    useTour({
        user: auth.user,
        name: "showCreateFacultyTalk",
        steps: () => [
            {
                title: `👨‍🏫 Create a New Faculty Account`,
                intro: `Fill in the required details to register a new faculty member and grant them access to the system.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "four-fifty-tool-tip",
            },
            {
                intro: `✍️ <b>Full Name</b><br>  
                        Enter the faculty member's complete name as it should appear in the system.`,
                element: document.querySelector("#name") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📧 <b>Email Address</b><br>  
                        Provide a valid and active email for communication and login purposes.`,
                element: document.querySelector("#email") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🔒 <b>Set a Password</b><br>  
                        Create a strong and unique password for the faculty member's account.`,
                element: document.querySelector("#password") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `✅ <b>Confirm Password</b><br>  
                        Re-enter the password to ensure accuracy and prevent login issues.`,
                element: document.querySelector(
                    "#confirmPassword"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🎓 <b>Select Department</b><br>  
                        Choose the department the faculty member belongs to.`,
                element: document.querySelector(
                    "#department_id"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📌 <b>Select Position</b><br>  
                        Assign the faculty member's position from the available options.`,
                element: document.querySelector("#position_id") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🔑 <b>Assign Role</b><br>  
                        Define the faculty member's permissions and system access.`,
                element: document.querySelector("#role") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🖼️ <b>Upload Profile Picture (Optional)</b><br>  
                        Add a profile picture to personalize the faculty member's account.`,
                element: document.querySelector(
                    "#profile_picture"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `👔 <b>Dean</b><br>
                This shows who the current dean of the college is.`,
                element: document.querySelector("#is_dean") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: `🎉 All Set!`,
                intro: `Click the button to <b>submit</b> and create the faculty account.`,
                element: document.querySelector(
                    "button[type='submit']"
                ) as HTMLElement,
                tooltipClass: "three-hundred-tool-tip",
            },
        ],
    });

    const [departmentId, setDepartmentId] = useState<string>("");
    const [positions, setPositions] = useState<Position[]>([]);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            department_id: "",
            position_id: "",
            role: "",
            profile_picture: null as File | null,
            is_dean: 0,
        },
    });

    const userTheme = auth?.user.theme;
    const userDepartmentId = auth?.user?.department_id;
    const userRole = auth?.user?.role;

    const isImage = (file: File) => file.type.startsWith("image/");

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
        if (!isImage(file)) {
            toast_error({
                message: "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                userTheme: userTheme,
            });
            event.target.value = "";
            return;
        }
        if (file.size <= 10 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imgElement = document.getElementById(
                    "profile_picture_preview"
                ) as HTMLImageElement;
                if (imgElement) imgElement.src = reader.result as string;
            };
            reader.readAsDataURL(file);
            form.setValue("profile_picture", file);
        } else {
            toast_error({
                message: "File is too large. Please choose a file smaller than 10MB.",
                userTheme: userTheme,
            });
            event.target.value = "";
        }
    }
};

    //edit this
    // window.onbeforeunload = () => true;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.table(values);

        const isEmailTaken = await checkEmailExists(values.email);

        if (isEmailTaken) {
            form.setError("email", {
                type: "manual",
                message: "Email already exists.",
            });
            return;
        }

        const userTheme = auth?.user.theme;
        const systemTheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        toast
            .promise(
                axios.post(route("faculties.store"), values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }),
                {
                    loading: "Saving faculty account...",
                    success: () => (
                        <span>
                            Faculty account has been successfully created!
                            <Link
                                href={route("faculties.index")}
                                className="ml-2 text-blue-500 hover:underline"
                            >
                                View Faculty List
                            </Link>
                            <div className="flex justify-end space-x-2">
                                <div className="absolute top-1 right-1">
                                    <X
                                        size={20}
                                        onClick={() => toast.dismiss()}
                                    />
                                </div>
                            </div>
                        </span>
                    ),
                    error: (
                        <span>
                            Could not create the account. Please try again
                            later.
                        </span>
                    ),
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then((response) => {
                form.reset();

                const imgElement = document.getElementById(
                    "profile_picture_preview"
                ) as HTMLImageElement;

                if (imgElement) {
                    imgElement.src = def_profile_pic;
                }

                const fileInput = document.getElementById(
                    "profile_picture"
                ) as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = "";
                }
            })
            .catch((error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 422) {
                        if (error.response.data.errors.profile_picture) {
                            toast_error({
                                message:
                                    "Profile picture must not exceed 10MB.",
                                userTheme: userTheme,
                            });
                        }

                        if (error.response.data.errors.password) {
                            form.setError("password", {
                                type: "manual",
                                message:
                                    "The password you've chosen has appeared in a data leak. Please choose a different password.",
                            });
                        }

                        if (error.response.data.errors.is_dean) {
                            form.setError("is_dean", {
                                type: "manual",
                                message: error.response.data.errors.is_dean[0],
                            });
                        }
                    } else {
                        toast_error({
                            message:
                                "An unexpected error occurred. Please try again later.",
                            userTheme: userTheme,
                        });
                    }
                } else {
                    toast_error({
                        message: "An unexpected error occurred.",
                        userTheme: userTheme,
                    });
                }
            });

        console.log("Form values before submission:", values);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="container mx-auto px-4 sm:px-6 lg:px-32">
                    <div className="bg-muted/50 rounded-xl p-4">
                        <h2 className="text-xl lg:text-3xl font-semibold text-center flex items-center justify-center">
                            Create Faculty Account
                            <UserPlus size={36} className="ml-2" />
                        </h2>
                    </div>
                </div>
            }
        >
            {/* form */}
            <Head title="Create Faculty Account" />
            <div className="max-w-7xl mx-auto py-5 sm:px-6 lg:px-0">
                <div className="lg: grid lg:grid-cols-12 gap-x-5">
                    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-12">
                        <div className="bg-muted/50 rounded-xl p-4">
                            <Form {...form}>
                                <div className="flex justify-center items-center">
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="w-2/3 space-y-5"
                                    >
                                        {/* Profile Picture */}
                                        <div className="flex justify-center items-center">
                                            <Avatar className="relative w-32 h-32">
                                                <AvatarImage
                                                    id="profile_picture_preview"
                                                    className="w-full h-full object-cover"
                                                    src={def_profile_pic}
                                                    alt="Profile Picture"
                                                />
                                                <input
                                                    id="profile_picture"
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={handleImageUpload}
                                                />
                                            </Avatar>
                                        </div>

                                        <div>
                                            <h3 className="text-xl leading-6 font-medium ">
                                                Faculty Information
                                            </h3>
                                            <p className="mt-1 text-md ">
                                                Use this form to create a new
                                                faculty member account.
                                            </p>
                                        </div>

                                        {/* Username */}
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                htmlFor="name"
                                                                className={`${
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .name
                                                                        ? "text-red-500"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Full Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    id="name"
                                                                    placeholder="Engr. "
                                                                    {...field}
                                                                    autoComplete="on"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="col-span-6 sm:col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                htmlFor="email"
                                                                className={`${
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .email
                                                                        ? "text-red-500"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Email
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    id="email"
                                                                    placeholder="coe@gmail.com "
                                                                    {...field}
                                                                    autoComplete="on"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="col-span-6 sm:col-span-3 relative">
                                                <FormField
                                                    control={form.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                htmlFor="password"
                                                                className={`${
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .password
                                                                        ? "text-red-500"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Password
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative flex items-center">
                                                                    <Input
                                                                        id="password"
                                                                        type={
                                                                            showPassword
                                                                                ? "text"
                                                                                : "password"
                                                                        }
                                                                        placeholder="Password"
                                                                        {...field}
                                                                        autoComplete="off"
                                                                    />
                                                                    <div
                                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                                                        onClick={() =>
                                                                            setShowPassword(
                                                                                !showPassword
                                                                            )
                                                                        }
                                                                    >
                                                                        {showPassword ? (
                                                                            <Eye
                                                                                size={
                                                                                    20
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <EyeOff
                                                                                size={
                                                                                    20
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="col-span-6 sm:col-span-3 relative">
                                                <FormField
                                                    control={form.control}
                                                    name="confirmPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                htmlFor="confirmPassword"
                                                                className={`${
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .confirmPassword
                                                                        ? "text-red-500"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Confirm Password
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative flex items-center">
                                                                    <Input
                                                                        id="confirmPassword"
                                                                        type={
                                                                            showConfirmPassword
                                                                                ? "text"
                                                                                : "password"
                                                                        }
                                                                        placeholder="Confirm Password"
                                                                        {...field}
                                                                        autoComplete="off"
                                                                    />

                                                                    <div
                                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                                                        onClick={() =>
                                                                            setShowConfirmPassword(
                                                                                !showConfirmPassword
                                                                            )
                                                                        }
                                                                    >
                                                                        {showConfirmPassword ? (
                                                                            <Eye
                                                                                size={
                                                                                    20
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <EyeOff
                                                                                size={
                                                                                    20
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Department */}
                                            <div className="col-span-6 sm:col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name="department_id"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                htmlFor="department_id"
                                                                className={`${
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .department_id
                                                                        ? "text-red-500"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Select
                                                                Department
                                                            </FormLabel>
                                                            <FormControl>
                                                                <SelectDept
                                                                    id="department_id"
                                                                    departments={
                                                                        departments
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) => {
                                                                        field.onChange(
                                                                            value
                                                                        );
                                                                        setDepartmentId(
                                                                            value
                                                                        );
                                                                        form.setValue(
                                                                            "position_id",
                                                                            ""
                                                                        );
                                                                    }}
                                                                    userDepartmentId={
                                                                        userDepartmentId
                                                                    }
                                                                    userRole={
                                                                        userRole
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Position */}
                                            <div className="col-span-6 sm:col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name="position_id"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                htmlFor="position_id"
                                                                className={`${
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .position_id
                                                                        ? "text-red-500"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Select Position
                                                            </FormLabel>
                                                            <FormControl>
                                                                <SelectPosition
                                                                    id="position_id"
                                                                    position={{
                                                                        data: positions,
                                                                    }}
                                                                    departmentId={
                                                                        departmentId
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    userRole={
                                                                        userRole
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Role*/}
                                            <div className="col-span-6 sm:col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name="role"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                htmlFor="role"
                                                                className={`${
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .role
                                                                        ? "text-red-500"
                                                                        : ""
                                                                }`}
                                                            >
                                                                Select Role
                                                            </FormLabel>
                                                            <FormControl>
                                                                <SelectRole
                                                                    id="role"
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    userRole={
                                                                        auth
                                                                            .user
                                                                            .role
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* is_dean field */}
                                            {userRole === "super-admin" && (
                                                <div className="col-span-6 sm:col-span-3">
                                                    <FormField
                                                        control={form.control}
                                                        name="is_dean"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel
                                                                    htmlFor="is_dean"
                                                                    className={`${
                                                                        form
                                                                            .formState
                                                                            .errors
                                                                            .is_dean
                                                                            ? "text-red-500"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    Is Dean?
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        name="dean"
                                                                        value={
                                                                            field.value
                                                                                ? "1"
                                                                                : "0"
                                                                        }
                                                                        onValueChange={(
                                                                            val
                                                                        ) => {
                                                                            field.onChange(
                                                                                val ===
                                                                                    "1"
                                                                                    ? 1
                                                                                    : 0
                                                                            );
                                                                            console.log(
                                                                                "Selected Is Dean:",
                                                                                val ===
                                                                                    "1"
                                                                                    ? "Yes"
                                                                                    : "No"
                                                                            );
                                                                        }}
                                                                    >
                                                                        <SelectTrigger id="is_dean">
                                                                            <SelectValue placeholder="Select Yes or No" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectLabel>
                                                                                    Options
                                                                                </SelectLabel>
                                                                                <SelectItem value="1">
                                                                                    Yes
                                                                                </SelectItem>
                                                                                <SelectItem value="0">
                                                                                    No
                                                                                </SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <Button
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
