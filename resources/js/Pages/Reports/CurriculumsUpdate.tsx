import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { CurriculumsUpdateProps } from "@/types/my_types";

export default function CurriculumsUpdate({
    auth,
    breadcrumbs,
}: CurriculumsUpdateProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl font-semibold leading-tight justify-center items-center flex bg-muted/50 p-4 rounded-lg mb-3">
                    Curriculums Update
                    {/* <FaMapMarkedAlt fontSize="x-large" className="ml-2" /> */}
                </h2>
            }
        >
            <Head title="Curriculums Update" />
            <div>
               
            </div>
        </AuthenticatedLayout>
    );
}
