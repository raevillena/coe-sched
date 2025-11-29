import { toast } from "react-hot-toast";

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

interface ToastProps {
    message: string;
    userTheme: "dark" | "light" | "system";
}

interface StyleProps {
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
}

//toast.success
export function toast_success({ message, userTheme }: ToastProps) {
    toast.success(message, {
        style: {
            padding: "16px",
            backgroundColor:
                userTheme === "dark"
                    ? "#020817"
                    : userTheme === "light"
                    ? "white"
                    : systemTheme
                    ? "#020817"
                    : "white",
            color:
                userTheme === "dark"
                    ? "white"
                    : userTheme === "light"
                    ? "black"
                    : systemTheme
                    ? "white"
                    : "black",
            border: "1px solid grey",
        },
        iconTheme: {
            primary: "green",
            secondary: "#FFFAEE",
        },
    });
}

//toast.error
export function toast_error({ message, userTheme }: ToastProps) {
    toast.error(message, {
        style: {
            padding: "16px",
            backgroundColor:
                userTheme === "dark"
                    ? "#020817"
                    : userTheme === "light"
                    ? "white"
                    : systemTheme
                    ? "#020817"
                    : "white",
            color:
                userTheme === "dark"
                    ? "white"
                    : userTheme === "light"
                    ? "black"
                    : systemTheme
                    ? "white"
                    : "black",
            border: "1px solid grey",
        },
        iconTheme: {
            primary: "red",
            secondary: "#FFFAEE",
        },
    });
}

//toast.info
export function toast_info({ message, userTheme }: ToastProps) {
    toast(message, {
        style: {
            padding: "16px",
            backgroundColor:
                userTheme === "dark"
                    ? "#020817"
                    : userTheme === "light"
                    ? "white"
                    : systemTheme
                    ? "#020817"
                    : "white",
            color:
                userTheme === "dark"
                    ? "white"
                    : userTheme === "light"
                    ? "black"
                    : systemTheme
                    ? "white"
                    : "black",
            border: "1px solid grey",
        },
    });
}

//styles
export function toast_style_delete({ userTheme, systemTheme }: StyleProps) {
    return {
        padding: "16px",
        backgroundColor:
            userTheme === "dark"
                ? "#020817"
                : userTheme === "light"
                ? "white"
                : systemTheme
                ? "#020817"
                : "white",
        color:
            userTheme === "dark"
                ? "white"
                : userTheme === "light"
                ? "black"
                : systemTheme
                ? "white"
                : "black",
        borderRadius: "8px",
        border: "1px solid rgb(239 68 68)",
    };
}

export function toast_style_update({ userTheme, systemTheme }: StyleProps) {
    return {
        padding: "16px",
        backgroundColor:
            userTheme === "dark"
                ? "#020817"
                : userTheme === "light"
                ? "white"
                : systemTheme
                ? "#020817"
                : "white",
        color:
            userTheme === "dark"
                ? "white"
                : userTheme === "light"
                ? "black"
                : systemTheme
                ? "white"
                : "black",
        borderRadius: "8px",
        border: "1px solid rgb(255, 189, 3)",
    };
}

export function toast_style_activate({ userTheme, systemTheme }: StyleProps) {
    return {
        padding: "16px",
        backgroundColor:
            userTheme === "dark"
                ? "#020817"
                : userTheme === "light"
                ? "white"
                : systemTheme
                ? "#020817"
                : "white",
        color:
            userTheme === "dark"
                ? "white"
                : userTheme === "light"
                ? "black"
                : systemTheme
                ? "white"
                : "black",
        borderRadius: "8px",
        border: "1px solid rgb(40, 167, 69)",
    };
}

export function toast_style_archive({ userTheme, systemTheme }: StyleProps) {
    return {
        padding: "16px",
        backgroundColor:
            userTheme === "dark"
                ? "#020817"
                : userTheme === "light"
                ? "white"
                : systemTheme
                ? "#020817"
                : "white",
        color:
            userTheme === "dark"
                ? "white"
                : userTheme === "light"
                ? "black"
                : systemTheme
                ? "white"
                : "black",
        borderRadius: "8px",
        border: "1px solid rgb(244, 225, 210)",
    };
}

export function toast_style_restore_archive({ userTheme, systemTheme }: StyleProps) {
    return {
        padding: "16px",
        backgroundColor:
            userTheme === "dark"
                ? "#020817"
                : userTheme === "light"
                ? "white"
                : systemTheme
                ? "#020817"
                : "white",
        color:
            userTheme === "dark"
                ? "white"
                : userTheme === "light"
                ? "black"
                : systemTheme
                ? "white"
                : "black",
        borderRadius: "8px",
        border: "1px solid rgb(0, 150, 136)",
    };
}

export function toast_style_promise({ userTheme, systemTheme }: StyleProps) {
    return {
        padding: "16px",
        backgroundColor:
            userTheme === "dark"
                ? "#020817"
                : userTheme === "light"
                ? "white"
                : systemTheme
                ? "#020817"
                : "white",
        color:
            userTheme === "dark"
                ? "white"
                : userTheme === "light"
                ? "black"
                : systemTheme
                ? "white"
                : "black",
        border: "1px solid grey",
    };
}

export function toast_style_ignore_warning({ userTheme, systemTheme }: StyleProps) {
    return {
        padding: "16px",
        backgroundColor:
            userTheme === "dark"
                ? "#020817"
                : userTheme === "light"
                ? "white"
                : systemTheme
                ? "#020817"
                : "white",
        color:
            userTheme === "dark"
                ? "white"
                : userTheme === "light"
                ? "black"
                : systemTheme
                ? "white"
                : "black",
        border: "1px solid #93C5FD",
    };
}

