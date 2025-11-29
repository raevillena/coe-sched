import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import {
    PiDatabaseDuotone,
    PiDatabaseFill,
    PiFloppyDiskDuotone,
    PiTrashDuotone,
} from "react-icons/pi";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { BackupDatabaseProps, DatabaseBackup } from "@/types/my_types";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import {
    toast_error,
    toast_style_promise,
    toast_success,
} from "@/types/my_types/mytoast";
import { X } from "lucide-react";
import { ToastDeleteWarning } from "@/Components/CustomizedComponents/toast-delete-warning";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import sqlIcon from "/Images/import_database.png";

export default function BackupDatabaseWithImport({
    auth,
    breadcrumbs,
}: BackupDatabaseProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const [backups, setBackups] = useState<DatabaseBackup[]>([]);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    // Load all generated backups.
    const fetchBackups = async () => {
        try {
            const response = await axios.get("/get-backups");
            setBackups(response.data);
        } catch (error) {
            toast_error({
                message: "Failed to fetch backups. Please try again.",
                userTheme,
            });
        }
    };

    useEffect(() => {
        fetchBackups(); // Initial load
    }, [reloadKey]);

    // Perform the backup process.
    const backup = () => {
        setIsBackingUp(true);
        toast
            .promise(
                axios.post("/backup"),
                {
                    loading: "Backing up the database...",
                    success: () => (
                        <span>
                            Database backup created successfully!
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
                            Could not create the backup. Please try again later.
                        </span>
                    ),
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                // Start polling to check for updated backups
                pollForBackups();
            })
            .catch((error) => {
                setIsBackingUp(false);
                toast_error({
                    message: "An unexpected error occurred. Please try again.",
                    userTheme,
                });
            });
    };

    // Poll for backups after initiating a backup process
    const pollForBackups = async () => {
        let attempts = 0;
        const maxAttempts = 10; // Maximum number of polling attempts
        const interval = 3000; // Poll every 3 seconds

        const intervalId = setInterval(async () => {
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                setIsBackingUp(false);
                return;
            }

            try {
                const response = await axios.get("/get-backups");
                const newBackups = response.data;

                if (newBackups.length > backups.length) {
                    setBackups(newBackups);
                    setIsBackingUp(false);
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }

            attempts += 1;
        }, interval);
    };

    // Delete a backup file.
    const deleteBackup = (path: string, id: number) => {
        ToastDeleteWarning({
            auth,
            question: "Are you sure you want to delete this backup?",
            routeName: "delete.backup",
            params: { id: id, backup_file: path },
            successMessage: "Backup deleted successfully.",
            errorMessage:
                "Unable to delete the backup. Please try again later.",
            onDeleteSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    const download = (path: string) => {
        window.location.href = `/download-backup/${path}`;
    };

    //import sql file
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            validateAndSetFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
        e.target.value = "";
    };

    const validateAndSetFile = (selectedFile: File) => {
        const fileName = selectedFile.name.toLowerCase();

        if (fileName.endsWith(".sql")) {
            setFile(selectedFile);
            toast_success({
                userTheme: userTheme,
                message: "SQL file selected successfully!",
            });
        } else {
            toast_error({
                message:
                    "Invalid file type. Please upload a file with a .sql extension.",
                userTheme: userTheme,
            });
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleImport = async () => {
        if (!file) {
            toast_error({
                message:
                    "No file selected. Please choose an SQL file to upload.",
                userTheme,
            });
            return;
        }

        console.log(file);
        // Example logic for file upload
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(route("import.sql"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("SQL file imported successfully!");
            setFile(null);
        } catch (error: any) {
            // Display server error message or fallback to a generic message
            const errorMessage =
                error.response?.data?.message ||
                "Failed to import SQL file. Please try again.";
            toast_error({
                message: errorMessage,
                userTheme,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={<h2 className="text-2xl font-black">System Maintenance</h2>}
        >
            <Head title="Dashboard" />

            <Tabs defaultValue="backup" className="p-5">
                <div className="bg-gradient-to-r from-blue-500 to-blue-950 p-2 rounded-lg">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                        <TabsTrigger value="backup">
                            Backup Database
                        </TabsTrigger>
                        <TabsTrigger value="import">
                            Import SQL Data
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="import">
                    <div className="grid gap-4 xl:grid-cols-4">
                        <Card className="relative h-fit w-full overflow-hidden xl:col-span-5">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-2xl font-bold">
                                    <span>Import SQL Data</span>
                                </CardTitle>
                                <CardDescription>
                                    Make sure the file format meets the
                                    requirements. It must be .sql
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative flex flex-col gap-2">
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`border-2 border-separate p-4 rounded-xl ${
                                        dragActive
                                            ? "border-blue-400"
                                            : "border-gray-300"
                                    } flex flex-col items-center justify-center`}
                                    id="file-upload-area"
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        style={{ display: "none" }}
                                        onChange={handleChange}
                                        accept=".sql"
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center">
                                            <p
                                                className="truncate"
                                                style={{ maxWidth: "150px" }}
                                            >
                                                {file.name}
                                            </p>
                                            <Button
                                                onClick={removeFile}
                                                className="mt-2"
                                                variant="destructive"
                                            >
                                                Remove File
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={sqlIcon}
                                                alt="Upload"
                                                className="w-32 h-32"
                                            />
                                            <span className="mt-2 font-bold text-xl">
                                                Drag & Drop to Upload SQL File
                                            </span>
                                            <span className="mt-2">OR</span>
                                            <span
                                                id="browse-file"
                                                className="mt-2 text-blue-600 underline cursor-pointer"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "file-upload"
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                Choose a file
                                            </span>
                                            <input
                                                type="file"
                                                id="file-upload"
                                                style={{ display: "none" }}
                                                onChange={handleChange}
                                                accept=".sql"
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={handleImport} disabled={!file}>
                                    Import SQL
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="backup">
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-4 xl:grid-cols-4">
                            <Card className="relative h-fit w-full overflow-hidden xl:col-span-5">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-2xl font-bold">
                                        <span>Database Backups</span>
                                        <span>
                                            <PiDatabaseDuotone className="size-7" />
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        Recent database backups.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative flex flex-col gap-2">
                                    <Button
                                        className="flex items-center gap-2 self-start hover:bg-gray-600 active:bg-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                                        onClick={backup}
                                        disabled={isBackingUp}
                                    >
                                        <PiFloppyDiskDuotone className="size-5" />
                                        <span>
                                            {isBackingUp
                                                ? "Backing up..."
                                                : "Backup now"}
                                        </span>
                                    </Button>
                                    {backups.length > 0 ? (
                                        <Table className="mb-4 h-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>File</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead
                                                        colSpan={2}
                                                        className="hidden sm:table-cell"
                                                    >
                                                        Backed up since
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {backups.map((backup) => (
                                                    <TableRow key={backup.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 font-mono font-medium">
                                                                <PiDatabaseFill className="size-5" />
                                                                <span>
                                                                    {
                                                                        backup.path
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="sm:table-cell">
                                                            {dayjs(
                                                                backup.updated_at
                                                            ).format(
                                                                "MMMM D, YYYY"
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="sm:table-cell">
                                                            {backup.created_at}
                                                        </TableCell>
                                                        <TableCell className="text-right sm:table-cell">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={() =>
                                                                        download(
                                                                            backup.path
                                                                        )
                                                                    }
                                                                >
                                                                    Download
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    onClick={() =>
                                                                        deleteBackup(
                                                                            backup.path,
                                                                            backup.id
                                                                        )
                                                                    }
                                                                >
                                                                    <PiTrashDuotone className="size-5" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="mt-2 rounded-lg bg-gray-100 py-4 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-white">
                                            The database has never been backed
                                            up.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </AuthenticatedLayout>
    );
}
