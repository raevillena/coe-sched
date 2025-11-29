import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CurriculumProps } from "@/types/my_types";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    OfferTable,
    SelectCurriculumYear,
    SelectLevel,
    SelectSection,
    SelectPeriod,
    OfferedTable,
} from "@/Components/CustomizedComponents/select-search-table";
import { toast_success, toast_error } from "@/types/my_types/mytoast";
import { ToastDeleteOnly } from "@/Components/CustomizedComponents/toast-delete-warning";

interface Course {
    id: number;
    course_code: string;
    course_name: string;
    program_code: string;
    level: string;
    curriculum_year: number;
    period_name: string;
    section_name: string;
}

export default function ViewCourseOfferings({
    auth,
    breadcrumbs,
    program_name,
    program_code,
    period_name,
    level_name,
}: CurriculumProps) {
    const [coursesToOffer, setCoursesToOffer] = useState<Course[]>([]);
    const [offeredCourses, setOfferedCourses] = useState<Course[]>([]);

    const [level, setLevel] = useState<string>("");
    const [period, setPeriod] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [curriculumYear, setCurriculumYear] = useState<string>("");

    const userTheme = auth?.user.theme;

    const [reloadKey, setReloadKey] = useState(0);
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [isRemovingCourse, setIsRemovingCourse] = useState(false);

    //get courses
    const getCourses = () => {
        if (
            !level ||
            !program_code ||
            !curriculumYear ||
            !period ||
            !selectedSection
        ) {
            setCoursesToOffer([]);
            setOfferedCourses([]);
            return;
        }
        axios
            .get(
                route("control.get_courses", {
                    program_code,
                    level,
                    curriculum_year: curriculumYear,
                    period,
                    section_name: selectedSection,
                })
            )
            .then((response) => {
                setCoursesToOffer(response.data.courses_to_offer || []);
                setOfferedCourses(response.data.offered_courses || []);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
            });
    };

    useEffect(() => {
        getCourses();
        setIsAddingCourse(false);
        setIsRemovingCourse(false);
    }, [reloadKey, level, program_code, curriculumYear, period, selectedSection]);

    //add course offering
    const addCourseOffering = (course: Course) => {
        setIsAddingCourse(true);
        axios
            .post(route("course_offerings.store"), {
                curriculums_id: course.id,
                course_code: course.course_code,
                course_name: course.course_name,
                section_name: selectedSection,
                level: level,
            })
            .then((response) => {
                toast_success({
                    message: `${course.course_name} offered successfully!`,
                    userTheme: userTheme,
                });
                setReloadKey((prevKey) => prevKey + 1);
            })
            .catch((error) => {
                console.error(error);
                toast_error({
                    message: "Failed to add course offering. Please try again.",
                    userTheme: userTheme,
                });
            });
    };

    //remove course offering
    const removeCourseOffering = (course: Course) => {
        setIsRemovingCourse(true);
        axios
            .delete(
                route("course_offerings.destroy", {
                    curriculums_id: course.id,
                })
            )
            .then((response) => {
                ToastDeleteOnly({
                    auth,
                    successMessage: `${course.course_name} removed successfully!`,
                });
                setReloadKey((prevKey) => prevKey + 1);
            })
            .catch((error) => {
                console.error(error);
                toast_error({
                    message: "Failed to remove course offered. Please try again.",
                    userTheme: userTheme,
                });
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="container mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="bg-muted/50 rounded-xl p-4">
                        <h2 className="text-3xl font-semibold text-center flex items-center justify-center">
                            Course Offering
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Course Offering" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-5 px-6">
                <div className="grid grid-cols-3 auto-rows-min gap-4">
                    <div className="col-span-1 rounded-xl bg-muted/50">
                        <div className="px-10 xl:h-[300px] drop-shadow-lg ">
                            {/* Select Level and Sectioncomponent */}
                            <h1 className="mt-10 text-xl font-semibold ">
                                {program_name}
                            </h1>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
                                <div className="">
                                    <SelectLevel
                                        id="level"
                                        value={level}
                                        level_name={level_name}
                                        onChange={(value) => {
                                            setLevel(value);
                                            setSelectedSection("");
                                            setCurriculumYear("");
                                            setPeriod("");
                                        }}
                                    />
                                </div>

                                <div className="">
                                    {level && program_code && (
                                        <SelectSection
                                            id="section"
                                            program_code={program_code}
                                            level={level}
                                            value={selectedSection}
                                            onChange={(value) => {
                                                setSelectedSection(value);
                                                setCurriculumYear("");
                                                setPeriod("");
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Search Course */}
                            <h1 className="mt-10 text-xl font-semibold ">
                                Search Course
                            </h1>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
                                <div className="">
                                    {selectedSection &&
                                        program_code &&
                                        level && (
                                            <SelectCurriculumYear
                                                id="curriculum_year"
                                                program_code={program_code}
                                                level={level}
                                                value={curriculumYear}
                                                onChange={(value) => {
                                                    setCurriculumYear(value);
                                                    setPeriod("");
                                                }}
                                            />
                                        )}
                                </div>

                                <div className="">
                                    {selectedSection &&
                                        program_code &&
                                        level &&
                                        curriculumYear && (
                                            <SelectPeriod
                                                id="period"
                                                value={period}
                                                period_name={period_name}
                                                onChange={(value) => {
                                                    setPeriod(value);
                                                }}
                                            />
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-10 col-span-2 rounded-xl bg-muted/50">
                        <h1 className="mt-5 text-xl font-semibold ">
                            Courses to Offer
                        </h1>
                        <div className="overflow-auto max-h-[300px]">
                            <OfferTable
                                addCourseOffering={addCourseOffering}
                                data={coursesToOffer}
                                isAddingCourse={isAddingCourse}
                            />
                        </div>
                    </div>
                </div>

                <h1 className="flex justify-center mt-5 text-xl font-semibold ">
                    Courses Offered
                </h1>
                <div className="px-5 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="overflow-auto max-h-[340px] mt-3">
                        <OfferedTable
                            removeCourseOffering={removeCourseOffering}
                            offeredData={offeredCourses}
                            isRemovingCourse={isRemovingCourse}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}