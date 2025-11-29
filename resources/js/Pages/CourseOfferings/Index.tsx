import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { CurriculumProps } from "@/types/my_types";
import { ChevronRight } from "lucide-react";
import { CourseOfferingIndexTable } from "@/Components/CustomizedComponents/curriculum-index-table";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Index({
    auth,
    academic_programs,
    breadcrumbs,
}: CurriculumProps) {
    const userRole = auth?.user?.role;
    const userDepartmentId = auth?.user?.department_id;

    const [userProgramCode, setUserProgramCode] = useState<string>("");
    useEffect(() => {
        const fetchUserDepartment = async () => {
            try {
                const response = await axios.get(route('sections.getProgramCode', { id: auth?.user?.department_id }));
                setUserProgramCode(response.data.program_code);
            } catch (error) {
                console.error("Error fetching user department:", error);
            }
        };

        fetchUserDepartment();
    }, [userDepartmentId]);
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
                    View Course Offering
                </h2>
            }
        >
            <Head title="View Course Offering" />
            <div>
                <div className="mx-auto max-w-7x1">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="mt-3 text-xl font-semibold ">
                                    Academic Programs
                                </h1>
                            </div>
                        </div>

                        {/* table */}
                        <CourseOfferingIndexTable
                            academic_programs={academic_programs}
                            Icon={ChevronRight}
                            routeName={"course_offerings.view"}
                            userRole={userRole}
                            userDepartmentId={userProgramCode}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
