import { TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
    toast_error,
    toast_success,
    toast_style_delete,
} from "@/types/my_types/mytoast";
import { User } from "@/types/my_types";
import axios from "axios";

interface ToastDeleteWarningProps {
    auth: {
        user: User;
    };
    routeName: string;
    params: Record<string, any>;
    successMessage: string; 
    errorMessage: string; 
    question: string;
    onDeleteSuccess: () => void;
}

//back up for delete function 
export function ToastDeleteWarning({
    routeName,
    successMessage,
    errorMessage,
    auth,
    params,
    question,
    onDeleteSuccess,
}: ToastDeleteWarningProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    toast(
        (t) => (
            <span>
                <div className="mb-2 flex justify-center">
                    <TriangleAlert size={48} color="rgb(239 68 68)" />
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
                        variant="destructive"
                        onClick={() => {
                            axios
                                .post(route(routeName, params))
                                .then((response) => {
                                    toast.dismiss(t.id);
                                    toast_success({
                                        message: successMessage,
                                        userTheme,
                                    });
                                    onDeleteSuccess(); 
                                })
                                .catch((error) => {
                                    toast.dismiss(t.id);
                                    toast_error({
                                        message: error.response?.data?.message || errorMessage,
                                        userTheme,
                                    });
                                });
                        }}
                    >
                        <b>Delete</b>
                    </Button>
                </div>
            </span>
        ),
        {
            style: toast_style_delete({ userTheme, systemTheme }),
        }
    );
}

//nausar ijay remove course offered
interface ToastDeleteOnlyProps {
    auth: {
        user: User;
    };
    successMessage: string; 
}

export function ToastDeleteOnly({
    successMessage,
    auth
}: ToastDeleteOnlyProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    toast(successMessage, {
        icon: '❗',
        style: toast_style_delete({ userTheme, systemTheme })
    });

}