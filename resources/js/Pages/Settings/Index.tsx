import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { SettingsProps } from "@/types/my_types";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import def_profile_pic from "/Images/def_profile_pic.png";
import bg_pic from "/Images/bg_pic.jpg";
import {
    CalendarPlus2,
    ClipboardMinus,
    Eye,
    EyeOff,
    FileUp,
    Link,
    Mail,
    SquareUser,
    UserRound,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import ray from "/Images/developers/ray.jpg";
import nathan from "/Images/developers/nathan.jpg";
import { SelectLoading } from "./SettingsComponents/select_deloading";
import { Controller } from "react-hook-form";

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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email("Invalid email address."),
    designation: z.string().nullable(),
    deloading: z.number().optional(),
    profile_picture: z.instanceof(File).nullable(),
});

const passwordSchema = z.object({
    oldPassword: z.string(),
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
});

export default function Index({ auth, breadcrumbs }: SettingsProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const userName = auth?.user.name;
    const userRoleName =
        auth?.user.role === "admin"
            ? "Admin"
            : auth?.user.role === "super-admin"
            ? "Super-Admin"
            : "User";
    const userEmail = auth?.user.email;

    const userCreated = auth?.user.created_at;
    const date = new Date(userCreated);
    // format to "March 25, 2025"
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
    );

    // Load profile picture
    const baseUrl = import.meta.env.VITE_APP_URL;
    const imagePath = auth?.user.profile_picture
        ? `${baseUrl}/storage/${auth?.user.profile_picture}`
        : def_profile_pic;

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(imagePath);
    const [dragActive, setDragActive] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [editMode, setEditMode] = useState(true);
    const isImage = (file: File) => file.type.startsWith("image/");

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(imagePath);
        }
    }, [file, imagePath]);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        if (formSubmitted && !editMode) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (formSubmitted && !editMode) return;
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (!isImage(droppedFile)) {
                toast_error({
                    message:
                        "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                    userTheme: userTheme,
                });
                return;
            }
            setFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            if (!isImage(selectedFile)) {
                toast_error({
                    message:
                        "Invalid file type. Please upload an image (JPG, PNG, GIF, etc.).",
                    userTheme: userTheme,
                });
                e.target.value = "";
                return;
            }
            if (selectedFile.size <= 10 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
                setFile(selectedFile);
            } else {
                toast_error({
                    message:
                        "File is too large. Please choose a file smaller than 10MB.",
                    userTheme: userTheme,
                });
            }
        }

        e.target.value = "";
    };

    const removeFile = () => {
        setFile(null);
        setPreview(imagePath);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: userName,
            email: userEmail,
            designation: auth.user.designation || "",
            deloading: auth.user.deloading || 0,
            profile_picture: null,
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const isEmailTaken = await checkEmailExists(values.email);

        if (auth.user.email !== values.email) {
            if (isEmailTaken) {
                form.setError("email", {
                    type: "manual",
                    message: "Email already exists.",
                });
                return;
            }
        }

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("designation", values.designation || "");
        formData.append("deloading", values.deloading?.toString() || "");

        if (file) {
            formData.append("profile_picture", file);
        }

        const userTheme = auth?.user.theme;
        const systemTheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        toast
            .promise(
                axios.post(
                    route("settings.update_user", { user: auth.user.id }),
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                ),
                {
                    loading: "Updating profile...",
                    success: () => <span>Profile updated successfully!</span>,
                    error: (
                        <span>
                            Could not update the profile. Please try again
                            later.
                        </span>
                    ),
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then((response) => {
                router.reload();
                setFile(null);
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
    };

    //change password
    const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
        if (values.password !== values.confirmPassword) {
            passwordForm.setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("oldPassword", values.oldPassword);
        formData.append("password", values.password);

        const userTheme = auth?.user.theme;
        const systemTheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        toast
            .promise(
                axios.post(
                    route("settings.update_password", { user: auth.user.id }),
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                ),
                {
                    loading: "Updating password...",
                    success: () => <span>Password updated successfully!</span>,
                    error: (
                        <span>
                            Could not update the password. Please try again
                        </span>
                    ),
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then((response) => {
                router.reload();
            })
            .catch((error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 422) {
                        const errors = error.response.data.errors;
                        if (errors.oldPassword) {
                            toast_error({
                                message: errors.oldPassword[0],
                                userTheme: userTheme,
                            });
                        } else if (errors.password) {
                            toast_error({
                                message: errors.password[0],
                                userTheme: userTheme,
                            });
                        } else if (errors.confirmPassword) {
                            toast_error({
                                message: errors.confirmPassword[0],
                                userTheme: userTheme,
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
    };

    // checkbox password validation
    const [isAtLeast8Char, setIsAtLeast8Char] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);

    const validatePassword = (password: string) => {
        setIsAtLeast8Char(password.length >= 8);
        setHasNumber(/[0-9]/.test(password));
        setHasLowercase(/[a-z]/.test(password));
        setHasUppercase(/[A-Z]/.test(password));
    };

    useEffect(() => {
        const subscription = passwordForm.watch((value) =>
            validatePassword(value.password || "")
        );
        return () => subscription.unsubscribe();
    }, [passwordForm]);
    //end of password validation

    //easter egg
    const [clickCount, setClickCount] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleBadgeClick = () => {
        setClickCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount === 10) {
                setIsDialogOpen(true);
            }
            return newCount;
        });
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setClickCount(0);
    };
    //end of easter egg

    //deloading
    const deloadingOptions = [
        { value: 3, label: 3 },
        { value: 6, label: 6 },
        { value: 9, label: 9 },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="px-5 text-2xl font-semibold leading-tight">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <Tabs defaultValue="account" className="p-3 sm:p-5">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#800000] to-[#4d0000]">
                    <TabsList className="grid w-full grid-cols-2 sm:w-[300px] md:w-[400px]">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                </div>

                {/* Account Tab */}
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <img
                                src={bg_pic}
                                alt="Background Image"
                                className="relative hidden object-cover w-full h-40 rounded-t-lg lg:block opacity-90"
                            />
                            <CardTitle></CardTitle>
                            <CardDescription>
                                <Avatar className="relative h-auto w-50 lg:w-40 lg:h-40 lg:absolute lg:top-80 sm:top-0">
                                    <AvatarImage
                                        id="profile_picture_preview"
                                        className="object-cover w-full h-full"
                                        src={preview || imagePath}
                                        alt="Profile Picture"
                                    />
                                </Avatar>
                                <div
                                    className={`${
                                        userTheme === "dark"
                                            ? "text-white"
                                            : "text-black"
                                    } lg:mt-16 mt-2`}
                                >
                                    <div className="flex flex-wrap gap-2">
                                        <p className="text-xl font-bold lg:text-2xl">
                                            {userName}
                                        </p>
                                        <Badge onClick={handleBadgeClick}>
                                            {userRoleName}
                                        </Badge>
                                    </div>
                                    <p className="mt-2 lg:mt-0 text-md lg:text-lg">
                                        {userEmail}
                                    </p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-center">
                                <div className="w-full max-w-7xl">
                                    <Card className="rounded-2xl">
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Full Name
                                                    </label>
                                                    <div className="relative">
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            {...form.register(
                                                                "name"
                                                            )}
                                                            className={`rounded-xl pl-10 w-full ${
                                                                form.formState
                                                                    .errors.name
                                                                    ? "border-red-500"
                                                                    : ""
                                                            }`}
                                                            placeholder="Engr. Juan Dela Cruz"
                                                            autoComplete="on"
                                                        />
                                                        <UserRound className="absolute transform -translate-y-1/2 left-3 top-1/2" />
                                                    </div>
                                                    {form.formState.errors
                                                        .name && (
                                                        <p className="mt-1 text-red-500">
                                                            {
                                                                form.formState
                                                                    .errors.name
                                                                    .message
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Email Address
                                                    </label>
                                                    <div className="relative">
                                                        <Input
                                                            id="email"
                                                            type="text"
                                                            {...form.register(
                                                                "email"
                                                            )}
                                                            className={`rounded-xl pl-10 w-full ${
                                                                form.formState
                                                                    .errors
                                                                    .email
                                                                    ? "border-red-500"
                                                                    : ""
                                                            }`}
                                                            autoComplete="on"
                                                        />
                                                        <Mail className="absolute transform -translate-y-1/2 left-3 top-1/2" />
                                                    </div>
                                                    {form.formState.errors
                                                        .email && (
                                                        <p className="mt-1 text-red-500">
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    .email
                                                                    .message
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Other Assignments /
                                                        Designation
                                                    </label>
                                                    <div className="relative">
                                                        <Input
                                                            id="designation"
                                                            type="text"
                                                            {...form.register(
                                                                "designation"
                                                            )}
                                                            className={`rounded-xl pl-10 w-full ${
                                                                form.formState
                                                                    .errors
                                                                    .designation
                                                                    ? "border-red-500"
                                                                    : ""
                                                            }`}
                                                            autoComplete="on"
                                                            placeholder="e.g. Department Chairperson, Lab Head, Program Coordinator"
                                                        />
                                                        <SquareUser className="absolute transform -translate-y-1/2 left-3 top-1/2" />
                                                    </div>
                                                    {form.formState.errors
                                                        .designation && (
                                                        <p className="mt-1 text-red-500">
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    .designation
                                                                    .message
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Deloading
                                                    </label>
                                                    <div className="relative">
                                                        <Controller
                                                            control={
                                                                form.control
                                                            }
                                                            name="deloading"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <SelectLoading
                                                                    id="deloading"
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    options={
                                                                        deloadingOptions
                                                                    }
                                                                    name={
                                                                        field.name
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                        <ClipboardMinus className="absolute transform -translate-y-1/2 left-3 top-1/2" />
                                                    </div>
                                                    {form.formState.errors
                                                        .deloading && (
                                                        <p className="mt-1 text-red-500">
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    .deloading
                                                                    .message
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-5">
                                                {/* <div className="relative lg:mt-2 mt-0 w-full md:w-[500px]">
                                                    <p className="mt-5 font-semibold">
                                                        Created
                                                    </p>
                                                    <Input
                                                        id="created_at"
                                                        type="text"
                                                        value={formattedDate}
                                                        className="w-full pl-10 rounded-xl"
                                                        readOnly
                                                    />
                                                    <CalendarPlus2 className="absolute transform left-3 top-1/2 translate-y-1/3" />
                                                </div> */}
                                            </div>

                                            <div className="flex flex-col gap-5 md:flex-row">
                                                <div className="relative w-full md:w-[200px]">
                                                    <p className="mt-5 font-semibold">
                                                        Change Profile Picture
                                                    </p>
                                                    <Avatar className="relative w-16 h-16 mt-2">
                                                        <AvatarImage
                                                            id="small_profile_picture_preview"
                                                            className="object-cover w-full h-full"
                                                            src={
                                                                preview ||
                                                                imagePath
                                                            }
                                                            alt="Profile Picture"
                                                        />
                                                    </Avatar>
                                                </div>
                                                <div className="mt-10 relative w-full md:w-[800px]">
                                                    <div
                                                        onDragEnter={handleDrag}
                                                        onDragLeave={handleDrag}
                                                        onDragOver={handleDrag}
                                                        onDrop={handleDrop}
                                                        className={`border-2 border-dashed p-4 h-[250px] rounded-2xl ${
                                                            dragActive
                                                                ? "border-blue-400"
                                                                : "border-gray-300"
                                                        } flex flex-col items-center justify-center`}
                                                        id="file-upload-area"
                                                    >
                                                        <input
                                                            type="file"
                                                            id="file-upload"
                                                            style={{
                                                                display: "none",
                                                            }}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            accept="image/*"
                                                            disabled={
                                                                formSubmitted &&
                                                                !editMode
                                                            }
                                                        />
                                                        {file ? (
                                                            <div className="flex flex-col items-center">
                                                                <p
                                                                    className="truncate"
                                                                    style={{
                                                                        maxWidth:
                                                                            "150px",
                                                                    }}
                                                                >
                                                                    {file.name}
                                                                </p>
                                                                {preview && (
                                                                    <img
                                                                        src={
                                                                            preview
                                                                        }
                                                                        alt="Preview"
                                                                        className="mt-4 max-h-32 max-w-32"
                                                                    />
                                                                )}
                                                                <Button
                                                                    onClick={
                                                                        removeFile
                                                                    }
                                                                    className={`mt-2 ${
                                                                        formSubmitted &&
                                                                        !editMode
                                                                            ? "hidden"
                                                                            : ""
                                                                    }`}
                                                                    variant="destructive"
                                                                    disabled={
                                                                        formSubmitted &&
                                                                        !editMode
                                                                    }
                                                                >
                                                                    Remove Image
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <div className="p-4 bg-blue-500 bg-opacity-50 rounded-full">
                                                                    <FileUp
                                                                        size={
                                                                            28
                                                                        }
                                                                        strokeWidth={
                                                                            2.5
                                                                        }
                                                                    />
                                                                </div>

                                                                <span className="mt-2">
                                                                    Drag & Drop
                                                                    to Upload
                                                                    New Profile
                                                                    Picture
                                                                </span>
                                                                <span className="mt-2">
                                                                    OR
                                                                </span>
                                                                <Button
                                                                    id="browse-image"
                                                                    className="mt-2"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        document
                                                                            .getElementById(
                                                                                "file-upload"
                                                                            )
                                                                            ?.click()
                                                                    }
                                                                    disabled={
                                                                        formSubmitted &&
                                                                        !editMode
                                                                    }
                                                                >
                                                                    Browse Image
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div></div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Button
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                onClick={form.handleSubmit(
                                                    onSubmit
                                                )}
                                            >
                                                Save Changes
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>

                {/* Password Tab*/}
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll
                                be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col lg:flex-row gap-14">
                                <div className="space-y-5">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:gap-44">
                                        <p className="py-2 font-semibold">
                                            Old Password
                                        </p>
                                        <div className="relative w-full lg:w-[500px] ml-2">
                                            <Input
                                                id="oldPassword"
                                                type={
                                                    showOldPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                {...passwordForm.register(
                                                    "oldPassword"
                                                )}
                                                className={`rounded-xl w-full ${
                                                    passwordForm.formState
                                                        .errors.oldPassword
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                placeholder="Enter old password"
                                            />
                                            <div
                                                // className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() =>
                                                    setShowOldPassword(
                                                        !showOldPassword
                                                    )
                                                }
                                            >
                                                {showOldPassword ? (
                                                    <Eye size={20} />
                                                ) : (
                                                    <EyeOff size={20} />
                                                )}
                                            </div>
                                            {passwordForm.formState.errors
                                                .oldPassword && (
                                                <p className="mt-1 text-red-500">
                                                    {
                                                        passwordForm.formState
                                                            .errors.oldPassword
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 lg:flex-row lg:gap-44">
                                        <p className="py-2 font-semibold">
                                            New Password
                                        </p>

                                        <div className="relative w-full lg:w-[500px]">
                                            <Input
                                                disabled={
                                                    !passwordForm.watch(
                                                        "oldPassword"
                                                    )
                                                }
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                {...passwordForm.register(
                                                    "password"
                                                )}
                                                className={`rounded-xl w-full ${
                                                    passwordForm.formState
                                                        .errors.password
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                placeholder="Enter new password"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <Eye size={20} />
                                                ) : (
                                                    <EyeOff size={20} />
                                                )}
                                            </div>
                                            {/* {passwordForm.formState.errors
                                                .password && (
                                                <p className="mt-1 text-red-500">
                                                    {
                                                        passwordForm.formState
                                                            .errors.password
                                                            .message
                                                    }
                                                </p>
                                            )} */}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 lg:flex-row lg:gap-28">
                                        <p className="py-2 font-semibold">
                                            Confirm New Password
                                        </p>
                                        <div className="relative w-full lg:w-[500px]">
                                            <Input
                                                disabled={
                                                    !passwordForm.watch(
                                                        "oldPassword"
                                                    )
                                                }
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                {...passwordForm.register(
                                                    "confirmPassword"
                                                )}
                                                className={`rounded-xl w-full ${
                                                    passwordForm.formState
                                                        .errors.confirmPassword
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                placeholder="Re-enter new password"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <Eye size={20} />
                                                ) : (
                                                    <EyeOff size={20} />
                                                )}
                                            </div>
                                            {/* {passwordForm.formState.errors
                                                .confirmPassword && (
                                                <p className="mt-1 text-red-500">
                                                    {
                                                        passwordForm.formState
                                                            .errors
                                                            .confirmPassword
                                                            .message
                                                    }
                                                </p>
                                            )} */}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-[650px]">
                                    <div
                                        className={`p-6 rounded-lg bg-blue-950 ${
                                            userTheme === "dark"
                                                ? "bg-opacity-50"
                                                : "bg-opacity-10"
                                        }`}
                                    >
                                        <div className="mb-6">
                                            <p className="text-xl font-semibold">
                                                Password Requirements
                                            </p>
                                            <p
                                                className={`text-small ${
                                                    userTheme === "dark"
                                                        ? "text-gray-300"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                Your password needs to have:
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 space-y-2 lg:space-y-0 lg:grid-cols-2">
                                                <div className="flex items-center space-x-4">
                                                    <Checkbox
                                                        id="at_least_8_char"
                                                        checked={isAtLeast8Char}
                                                    />
                                                    <label
                                                        htmlFor="at_least_8_char"
                                                        className={`text-small font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                                            !isAtLeast8Char
                                                                ? "text-red-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        At least 8 characters
                                                    </label>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <Checkbox
                                                        id="at_least_1_num"
                                                        checked={hasNumber}
                                                    />
                                                    <label
                                                        htmlFor="at_least_1_num"
                                                        className={`text-small font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                                            !hasNumber
                                                                ? "text-red-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        At least one number
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 space-y-2 lg:space-y-0 lg:grid-cols-2">
                                                <div className="flex items-center space-x-4">
                                                    <Checkbox
                                                        id="at_least_1_lowerchar"
                                                        checked={hasLowercase}
                                                    />
                                                    <label
                                                        htmlFor="at_least_1_lowerchar"
                                                        className={`text-small font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                                            !hasLowercase
                                                                ? "text-red-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        At least one lowercase
                                                        letter
                                                    </label>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <Checkbox
                                                        id="at_least_1_upperchar"
                                                        checked={hasUppercase}
                                                    />
                                                    <label
                                                        htmlFor="at_least_1_upperchar"
                                                        className={`text-small font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                                            !hasUppercase
                                                                ? "text-red-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        At least one uppercase
                                                        letter
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-around">
                            <Button
                                disabled={
                                    passwordForm.formState.isSubmitting ||
                                    !passwordForm.watch("oldPassword") ||
                                    !passwordForm.watch("password") ||
                                    !passwordForm.watch("confirmPassword")
                                }
                                onClick={passwordForm.handleSubmit(
                                    onSubmitPassword
                                )}
                            >
                                Save password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Congrats! 🎉 You've discovered the Easter egg!{" "}
                        </DialogTitle>
                        <DialogDescription>
                            🏆 To claim your prize, please contact us at{" "}
                            <strong>coescheduler@gmail.com</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <img
                                src={ray}
                                alt="dev_ray"
                                className="w-auto mx-auto border-2 border-blue-500 rounded-md h-128"
                            />
                            <p className="mt-2 font-semibold text-md">
                                Engr. Raymund Jan R. Pedro
                            </p>
                            <p
                                className={`${
                                    userTheme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-700"
                                } text-sm`}
                            >
                                Full Stack Developer
                            </p>
                        </div>

                        <div>
                            <img
                                src={nathan}
                                alt="dev_nathan"
                                className="w-auto mx-auto border-2 border-blue-500 rounded-md h-128"
                            />
                            <p className="mt-2 font-semibold text-md">
                                Engr. Nathaniel T. Miguel
                            </p>
                            <p
                                className={`${
                                    userTheme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-700"
                                } text-sm`}
                            >
                                Full Stack Developer
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="flex justify-center text-md">
                            Thank You for Exploring! -<b>RN DevWorks</b> 💻
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleDialogClose}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
