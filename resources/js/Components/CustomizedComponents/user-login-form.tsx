import { useEffect, useState } from "react";
import { LoginFormProps, User } from "@/types/my_types";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import axios, { AxiosResponse } from "axios";
import { Eye, EyeOff } from "lucide-react";

//svg
import welcoming from "/Images/undraw/undraw_welcoming.svg";
import login from "/Images/undraw/undraw_login.svg";

const formSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export function ProfileForm({
    users,
    onUserSelect,
    onUserChange,
}: LoginFormProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const baseUrl = import.meta.env.VITE_APP_URL;

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        onUserChange(selectedUser);
    }, [selectedUser, onUserChange]);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        onUserSelect(user.id);
        form.setValue("email", user.email);
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (selectedUser) {
            setProcessing(true);
            axios
                .post(route("auth.login"), {
                    email: selectedUser.email,
                    password: values.password,
                })
                .then((response: AxiosResponse) => {
                    window.location = response.request.responseURL;
                })
                .catch((error) => {
                    form.setError("password", {
                        type: "manual",
                        message: "Incorrect password, please try again.",
                    });
                })
                .finally(() => {
                    setProcessing(false);
                });
        }
    };

    return (
        <div>
            {!selectedUser ? (
                <>
                    {users.length === 0 ? (
                        <div className="px-2 py-1 text-center text-red-600 rounded">
                            No faculty members found.
                        </div>
                    ) : (
                        <>
                            <div className="relative p-4 overflow-auto max-h-[60vh]">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center px-3 py-2 space-x-4 transition-colors duration-150 rounded-lg cursor-pointer hover:bg-gray-700/50"
                                            onClick={() =>
                                                handleUserClick(user)
                                            }
                                        >
                                            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                                                <AvatarImage
                                                    className="object-cover rounded-full"
                                                    src={
                                                        user?.profile_picture
                                                            ? `${baseUrl}/storage/${user.profile_picture}`
                                                            : undefined
                                                    }
                                                    alt="Profile Picture"
                                                />
                                                <AvatarFallback>
                                                    {user.profile_picture
                                                        ? null
                                                        : (() => {
                                                              const nameParts =
                                                                  user.name.split(
                                                                      " "
                                                                  );
                                                              const firstPart =
                                                                  nameParts[0].toUpperCase();
                                                              const firstInitial =
                                                                  nameParts[1]
                                                                      ?.charAt(
                                                                          0
                                                                      )
                                                                      .toUpperCase() ||
                                                                  "";
                                                              const secondInitial =
                                                                  nameParts[2]
                                                                      ?.charAt(
                                                                          0
                                                                      )
                                                                      .toUpperCase() ||
                                                                  "";
                                                              return `${firstPart} ${firstInitial}${secondInitial}`;
                                                          })()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col space-y-1">
                                                <div className="text-sm font-bold text-white sm:text-base">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-300 sm:text-sm">
                                                    {user.position
                                                        ? user.position.name
                                                        : "Position not available"}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <img
                                src={welcoming}
                                alt="welcoming"
                                className="fixed bottom-4 left-4 w-auto h-[90px] sm:h-[90px] lg:h-[200px] object-contain hidden sm:block opacity-75 pointer-events-none z-[5]"
                            />
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="relative flex flex-col items-center p-4 space-y-6 sm:p-6">
                        {/* Selected User Info */}
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                                <AvatarImage
                                    className="object-cover rounded-full"
                                    src={
                                        selectedUser?.profile_picture
                                            ? `${baseUrl}/storage/${selectedUser.profile_picture}`
                                            : undefined
                                    }
                                    alt="Profile Picture"
                                />
                                <AvatarFallback>
                                    {selectedUser.profile_picture
                                        ? null
                                        : (() => {
                                              const nameParts =
                                                  selectedUser.name.split(" ");
                                              const firstPart =
                                                  nameParts[0].toUpperCase();
                                              const firstInitial =
                                                  nameParts[1]
                                                      ?.charAt(0)
                                                      .toUpperCase() || "";
                                              const secondInitial =
                                                  nameParts[2]
                                                      ?.charAt(0)
                                                      .toUpperCase() || "";
                                              return `${firstPart} ${firstInitial}${secondInitial}`;
                                          })()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1">
                                <div className="text-base font-bold text-white sm:text-lg">
                                    {selectedUser.name}
                                </div>
                                <div className="text-sm text-gray-300 sm:text-base">
                                    {selectedUser.position
                                        ? selectedUser.position.name
                                        : "Position not available"}
                                </div>
                            </div>
                        </div>

                        {/* Password Form */}
                        <div className="w-full max-w-xs sm:max-w-sm">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-5"
                                >
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    className={`${
                                                        form.formState.errors
                                                            .password
                                                            ? "text-red-500"
                                                            : "text-white"
                                                    }`}
                                                    htmlFor="password"
                                                >
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative flex items-center">
                                                        <Input
                                                            id="password"
                                                            {...field}
                                                            type={
                                                                showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            placeholder="Enter your password"
                                                            autoComplete="current-password"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="text-base"
                                                        />
                                                        <div
                                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword
                                                                )
                                                            }
                                                        >
                                                            {showPassword ? (
                                                                <Eye
                                                                    size={20}
                                                                />
                                                            ) : (
                                                                <EyeOff
                                                                    size={20}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-sm text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid justify-center grid-cols-2 gap-2 mt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full sm:w-auto"
                                        >
                                            Log in
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                setSelectedUser(null)
                                            }
                                            disabled={processing}
                                            className="w-full sm:w-auto"
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                    <img
                        src={login}
                        alt="undraw_login"
                        className="fixed bottom-4 left-4 w-auto h-[60px] sm:h-[60px] lg:h-[80px] object-contain hidden md:block opacity-90 pointer-events-none z-[5]"
                    />
                </>
            )}
        </div>
    );
}
