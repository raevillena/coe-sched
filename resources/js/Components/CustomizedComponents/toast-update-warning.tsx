import { FileArchive, FolderLock, FolderOpen, ShieldAlert, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
    toast_error,
    toast_success,
    toast_style_update,
    toast_style_activate,
    toast_style_archive,
    toast_style_restore_archive,
} from "@/types/my_types/mytoast";
import axios from "axios";
import { User } from "@/types/my_types";
import { router } from "@inertiajs/react";


interface ToastConfirmationWarningProps {
    routeName: string;
    params: Record<string, any>;
    successMessage: string;
    errorMessage: string;
    question: string;
    newState: number;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onConfirmSuccess: () => void;
}

export function ToastConfirmationWarning({
    routeName,
    successMessage,
    errorMessage,
    params,
    question,
    newState,
    userTheme,
    systemTheme,
    onConfirmSuccess,
}: ToastConfirmationWarningProps) {

    toast(
        (t) => (
            <span>
                <div className="mb-2 flex justify-center">
                    <ShieldAlert size={48} color="#ffdc00" />
                </div>
                <p className="flex font-medium">{question}</p>

                <div className="flex justify-end space-x-3 mt-2">
                    <Button
                        variant="secondary"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            axios
                                .put(
                                    route(routeName, params),
                                    {
                                        is_active: Number(newState),
                                    },
                                    {
                                        headers: {
                                            "Content-Type": "application/json", 
                                        },
                                    }
                                )
                                .then((response) => {
                                    toast.dismiss(t.id); 
                                    toast_success({
                                        message: successMessage,
                                        userTheme,
                                    });
                                    onConfirmSuccess(); 
                                })
                                .catch((error) => {
                                    toast.dismiss(t.id); 
                                    toast_error({
                                        message:
                                            error.response?.data?.message ||
                                            errorMessage, 
                                        userTheme,
                                    });
                                });
                        }}
                    >
                        <b>Confirm</b>
                    </Button>
                </div>
            </span>
        ),
        {
            style: toast_style_update({ userTheme, systemTheme }),
        }
    );
}

interface ToastDeactivateWarningProps {
    auth: {
        user: User;
    };
    routeName: string;
    params: Record<string, any>;
    successMessage: string; 
    errorMessage: string; 
    question: string;
    onDeactivateSuccess: () => void
}

//used in faculty index
export function ToastDeactivateWarning({
    routeName,
    successMessage,
    errorMessage,
    auth,
    params,
    question,
    onDeactivateSuccess,
}: ToastDeactivateWarningProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    toast(
        (t) => (
            <span>
                <div className="mb-2 flex justify-center">
                    <ShieldAlert size={48} color="#ffdc00" />
                </div>
                <p className="flex font-medium">{question}</p>

                <div className="flex justify-end space-x-3 mt-2">
                    <Button
                        variant="secondary"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            axios
                                .put(
                                    route(routeName, params),
                                    {
                                        is_active: Number(0),
                                    },
                                    {
                                        headers: {
                                            "Content-Type": "application/json", 
                                        },
                                    }
                                )
                                .then((response) => {
                                    toast.dismiss(t.id); 
                                    toast_success({
                                        message: successMessage,
                                        userTheme,
                                    });
                                    onDeactivateSuccess(); 
                                })
                                .catch((error) => {
                                    toast.dismiss(t.id); 
                                    toast_error({
                                        message:
                                            error.response?.data?.message ||
                                            errorMessage, 
                                        userTheme,
                                    });
                                });
                        }}
                    >
                        <b>Confirm</b>
                    </Button>
                </div>
            </span>
        ),
        {
            style: toast_style_update({ userTheme, systemTheme }),
        }
    );
}

interface ToastActivateWarningProps {
    auth: {
        user: User;
    };
    routeName: string;
    params: Record<string, any>;
    successMessage: string; 
    errorMessage: string; 
    question: string;
    onActivateSuccess: () => void
}

export function ToastActivateWarning({
    routeName,
    successMessage,
    errorMessage,
    auth,
    params,
    question,
    onActivateSuccess,
}: ToastActivateWarningProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    toast(
        (t) => (
            <span>
                <div className="mb-2 flex justify-center">
                    <ShieldCheck size={48} color="#28a745" />
                </div>
                <p className="flex font-medium">{question}</p>

                <div className="flex justify-end space-x-3 mt-2">
                    <Button
                        variant="secondary"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            axios
                                .put(
                                    route(routeName, params),
                                    {
                                        is_active: Number(1),
                                    },
                                    {
                                        headers: {
                                            "Content-Type": "application/json", 
                                        },
                                    }
                                )
                                .then((response) => {
                                    toast.dismiss(t.id); 
                                    toast_success({
                                        message: successMessage,
                                        userTheme,
                                    });
                                    onActivateSuccess(); 
                                })
                                .catch((error) => {
                                    toast.dismiss(t.id); 
                                    toast_error({
                                        message:
                                            error.response?.data?.message ||
                                            errorMessage, 
                                        userTheme,
                                    });
                                });
                        }}
                    >
                        <b>Confirm</b>
                    </Button>
                </div>
            </span>
        ),
        {
            style: toast_style_activate({ userTheme, systemTheme }),
        }
    );
}


//used in curriculum archive
interface ToastArchiveWarningProps {
    auth: {
        user: User;
    };
    routeName: string;
    params: Record<string, any>;
    successMessage: string; 
    errorMessage: string; 
    question: string;
    onArchiveSuccess: () => void
}

export function ToastArchiveWarning({
    routeName,
    successMessage,
    errorMessage,
    auth,
    params,
    question,
    onArchiveSuccess,
}: ToastArchiveWarningProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    toast(
        (t) => (
            <span>
                <div className="mb-2 flex justify-center">
                    <FolderLock size={48} color="#f4e1d2" />
                </div>
                <p className="flex font-medium">{question}</p>

                <div className="flex justify-end space-x-3 mt-2">
                    <Button
                        variant="secondary"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            axios
                                .put(
                                    route(routeName, params),
                                    {
                                        is_active: Number(0),
                                    },
                                    {
                                        headers: {
                                            "Content-Type": "application/json", 
                                        },
                                    }
                                )
                                .then((response) => {
                                    toast.dismiss(t.id); 
                                    toast_success({
                                        message: successMessage,
                                        userTheme,
                                    });
                                    onArchiveSuccess(); 
                                })
                                .catch((error) => {
                                    toast.dismiss(t.id); 
                                    toast_error({
                                        message:
                                            error.response?.data?.message ||
                                            errorMessage, 
                                        userTheme,
                                    });
                                })
                                .finally(() => {
                                    router.reload();
                                })
                        }}
                    >
                        <b>Confirm</b>
                    </Button>
                </div>
            </span>
        ),
        {
            style: toast_style_archive({ userTheme, systemTheme }),
        }
    );
}

interface ToastRestoreArchiveWarningProps {
    auth: {
        user: User;
    };
    routeName: string;
    params: Record<string, any>;
    successMessage: string; 
    errorMessage: string; 
    question: string;
    onRestoreArchiveSuccess: () => void
}

export function ToastRestoreArchiveWarning({
    routeName,
    successMessage,
    errorMessage,
    auth,
    params,
    question,
    onRestoreArchiveSuccess,
}: ToastRestoreArchiveWarningProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    toast(
        (t) => (
            <span>
                <div className="mb-2 flex justify-center">
                    <FolderOpen size={48} color="#009688" />
                </div>
                <p className="flex font-medium">{question}</p>

                <div className="flex justify-end space-x-3 mt-2">
                    <Button
                        variant="secondary"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            axios
                                .put(
                                    route(routeName, params),
                                    {
                                        is_active: Number(1),
                                    },
                                    {
                                        headers: {
                                            "Content-Type": "application/json", 
                                        },
                                    }
                                )
                                .then((response) => {
                                    toast.dismiss(t.id); 
                                    toast_success({
                                        message: successMessage,
                                        userTheme,
                                    });
                                    onRestoreArchiveSuccess(); 
                                })
                                .catch((error) => {
                                    toast.dismiss(t.id); 
                                    toast_error({
                                        message:
                                            error.response?.data?.message ||
                                            errorMessage, 
                                        userTheme,
                                    });
                                })
                                .then(() => {
                                    router.reload();
                                })
                        }}
                    >
                        <b>Confirm</b>
                    </Button>
                </div>
            </span>
        ),
        {
            style: toast_style_restore_archive({ userTheme, systemTheme }),
        }
    );
}