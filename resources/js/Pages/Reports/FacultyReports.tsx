import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { FacultyReportsProps } from "@/types/my_types";

export default function FacultyReports({
    auth,
    breadcrumbs,
}: FacultyReportsProps) {
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
                    Faculty Reports
                    {/* <FaMapMarkedAlt fontSize="x-large" className="ml-2" /> */}
                </h2>
            }
        >
            <Head title="Faculty Reports" />
            <div>
               
            </div>
        </AuthenticatedLayout>
    );
}
