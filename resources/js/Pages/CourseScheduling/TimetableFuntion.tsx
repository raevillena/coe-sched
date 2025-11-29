import { useState, useEffect } from "react";
import { SelectDeptCourseOffering } from "@/Components/CustomizedComponents/select-component";
import { TimeTableFunctionProps } from "@/types/my_types";
import {
    SelectAcademicYear,
    SelectCurriculumYear,
    SelectLevel,
    SelectPeriod,
    SelectSection,
} from "@/Components/CustomizedComponents/select-search-table";
import { Label } from "@/Components/ui/label";

export default function TimetableFuntion({
    departments,
    userRole,
    userDepartmentId,
    level_name,
    period_name,
    course,
    setCourse,
    level,
    setLevel,
    section,
    setSection,
    year,
    setYear,
    semester,
    setSemester,
    academic,
    setAcademic,
}: TimeTableFunctionProps): JSX.Element {
    const [showSelectMessage, setShowSelectMessage] = useState(false);

    useEffect(() => {
        const savedCourse = localStorage.getItem("selectedCourse");
        const savedSemester = localStorage.getItem("selectedSemester");
        const savedLevel = localStorage.getItem("selectedLevel");
        const savedYear = localStorage.getItem("selectedYear");
        const savedSection = localStorage.getItem("selectedSection");
        const savedAcademic = localStorage.getItem("selectedAcademicYear");

        if (savedCourse) setCourse(JSON.parse(savedCourse));
        if (savedSemester) setSemester(JSON.parse(savedSemester));
        if (savedLevel) setLevel(JSON.parse(savedLevel));
        if (savedYear) setYear(JSON.parse(savedYear));
        if (savedSection) setSection(JSON.parse(savedSection));
        if (savedAcademic) setAcademic(JSON.parse(savedAcademic));
    }, [setCourse, setSemester, setLevel, setYear, setSection, setAcademic]);

    // Save changes to localStorage

    useEffect(() => {
        localStorage.setItem("selectedCourse", JSON.stringify(course));
    }, [course]);

    useEffect(() => {
        localStorage.setItem("selectedSemester", JSON.stringify(semester));
    }, [semester]);

    useEffect(() => {
        localStorage.setItem("selectedLevel", JSON.stringify(level));
    }, [level]);

    useEffect(() => {
        localStorage.setItem("selectedAcademicYear", JSON.stringify(academic));
    }, [academic]);

    useEffect(() => {
        localStorage.setItem("selectedYear", JSON.stringify(year));
    }, [year]);

    useEffect(() => {
        localStorage.setItem("selectedSection", JSON.stringify(section));
        if (!section || section === "Select a section") {
            setShowSelectMessage(true);
        } else {
            setShowSelectMessage(false);
        }
    }, [section]);

    return (
        <div className="">
            <div className="grid w-full grid-cols-1 space-y-2 lg:space-y-0 lg:space-x-4 lg:grid-cols-6">
                <div>
                    {/* Select Department */}
                    <Label htmlFor="department_id">Select Department</Label>
                    <SelectDeptCourseOffering
                        id="department_id"
                        departments={departments}
                        value={course}
                        onChange={(selectedDept) => {
                            setCourse(selectedDept);
                            setSection("Select a section");
                        }}
                        userDepartmentId={userDepartmentId}
                        userRole={userRole}
                    />
                </div>
                {/* Select Period */}
                <div>
                    <SelectPeriod
                        id="period"
                        value={semester}
                        period_name={period_name}
                        onChange={(value) => {
                            setSemester(value);
                        }}
                    />
                </div>
                <div>
                    {/* Select Level */}
                    <SelectLevel
                        id="level"
                        value={level}
                        level_name={level_name}
                        onChange={(value) => {
                            setLevel(value);
                            setSection("Select a section");
                        }}
                    />
                </div>
                {/* Select Curriculum Year --this is academic year*/}
                <div>
                    <SelectCurriculumYear
                        id="curriculum_year"
                        program_code={course}
                        level={level}
                        value={year}
                        onChange={(value) => {
                            setYear(value);
                        }}
                    />
                </div>
                {/* Select Section */}
                <div>
                    <SelectSection
                        id="section"
                        program_code={course}
                        level={level}
                        value={section}
                        onChange={(value) => {
                            setSection(value);
                        }}
                    />
                    {showSelectMessage && (
                        <div className="mb-3 text-red-500">
                            Please select a section to continue.
                        </div>
                    )}
                </div>

                {/* Select Course Curriculum */}
                <div>
                    <SelectAcademicYear
                        id="course_curriculum"
                        program_code={course}
                        level={level}
                        value={academic}
                        onChange={(value: string) => {
                            {
                                setAcademic(value);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
