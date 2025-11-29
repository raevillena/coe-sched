import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { SectionManagementProps } from "@/types/my_types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { useEffect, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { toast_error, toast_style_promise } from "@/types/my_types/mytoast";
import toast from "react-hot-toast";
import { SectionDataTable } from "@/Components/CustomizedComponents/data-table-section-management";
import { PiStudentFill } from "react-icons/pi";
import { BadgeCheck, Check, CheckCircle } from "lucide-react";
import { useMemo } from "react";
import useTour from "@/Composables/useTour";

export default function SectionManagement({
    auth,
    breadcrumbs,
    academic_programs,
    levels,
    sections,
}: SectionManagementProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    useTour({
        user: auth.user,
        name: "showSectionManagementTalk",
        steps: () => [
            {
                title: "📌 Welcome to Section Management!",
                intro: `Effortlessly manage and organize sections across various departments!<br><br>  
                                ✅ <b>View active sections</b><br>  
                                ✅ <b>Create new sections</b><br>  
                                ✅ <b>Ensure proper organization</b><br><br>  
                                Let's take a quick tour!<br><br>  
                                <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `📋 <b>Active Sections Table</b><br>  
                                View all active sections per department.  
                                Easily <b>activate</b> or <b>deactivate</b> sections to maintain accurate records.`,
                element: document.querySelector(
                    "#section-table"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🔎 <b>Search & Filter</b><br>  
                                Use this <b>search bar</b> to quickly find sections by department, year level, or section name.`,
                element: document.querySelector("#filter_dept") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📚 <b>Create a New Section</b><br>  
                                Start by selecting the <b>Department</b> where the new section will be added.`,
                element: document.querySelector(
                    "#department-selection"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🎓 <b>Select Year Level</b><br>  
                                Choose the appropriate <b>Year Level</b> for the new section.`,
                element: document.querySelector(
                    "#year-level-selection"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `✏️ <b>Section Name</b><br>  
                                After selecting the department and year level, enter the section name as needed.`,
                element: document.querySelector(
                    "#section-name-preview"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `➕ <b>Subsection Name (Optional)</b><br>  
                                Enhance organization by adding a subsection name, if relevant.<br><br>
                                <i>Examples:</i> <b>"Split 1," "Construction,"</b> or <b>"Structural."</b>`,
                element: document.querySelector(
                    "#subsection-name-preview"
                ) as HTMLElement,
                tooltipClass: "steps-tooltip",
            },
            {
                intro: `👀 <b>View Existing Sections</b><br>
                                Before adding a new section, please review the list of <b>existing sections</b> to prevent creating duplicates.<br>`,
                element: document.querySelector(
                    "#existing-sections-preview"
                ) as HTMLElement,
                tooltipClass: "steps-tooltip",
            },
            {
                intro: `✅ <b>Confirm & Create</b><br>  
                                Everything is set! Click the button below to <b>create the new section</b>.`,
                element: document.querySelector(
                    "#create-section"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
        ],
    });

    const userRole = auth?.user?.role;
    const userDepartmentId = auth?.user?.department_id;
    const deptArray = Array.isArray(academic_programs)
        ? academic_programs
        : academic_programs.data || [];

    const filteredDepartments =
        userRole == "admin"
            ? deptArray.filter(
                  (department) => department.id === userDepartmentId
              )
            : deptArray;

    const sortedDepartments = filteredDepartments.sort((a, b) =>
        a.program_name.localeCompare(b.program_name)
    );

    const levelArray = Array.isArray(levels) ? levels : levels.data || [];
    const existingSections = useMemo(
        () => sections.data.map((section) => section.section_name),
        [sections]
    );

    const [deptId, setDeptId] = useState<string>("");
    const [levelId, setLevelId] = useState<string>("");
    const [programName, setProgramName] = useState<string>("");
    const [sectionName, setSectionName] = useState<string>("");
    const [subSectionName, setSubSectionName] = useState<string>("");

    const handleDeptChange = (value: string) => {
        setDeptId(value);
        const selectedDept = deptArray.find(
            (item) => item.program_code === value
        );
        setProgramName(selectedDept ? selectedDept.program_name : "");

        setSectionName("");
    };

    const handleLevelChange = (value: string) => {
        setLevelId(value);
        setSectionName("");
    };

    const handleSubmit = () => {
        const fullSectionName = subSectionName.trim()
            ? `${deptId} ${sectionName} (${subSectionName.trim()})`
            : `${deptId} ${sectionName}`;

        //check if section already exists
        if (existingSections.includes(fullSectionName)) {
            toast.error(
                "This section already exists. Please enter a unique section name.",
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            );
            return;
        }

        toast
            .promise(
                axios.post(
                    route("sections.store"),
                    {
                        program_code: deptId,
                        level: levelId,
                        section_name: fullSectionName,
                        program_name: programName,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ),
                {
                    loading: "Adding level...",
                    success: () => (
                        <span>{fullSectionName} added successfully!</span>
                    ),
                    error: (error) => {
                        const errorMessage =
                            error.response?.data?.message ||
                            "Could not add year level. Please try again later.";

                        return <span>{errorMessage}</span>;
                    },
                },
                {
                    style: toast_style_promise({ userTheme, systemTheme }),
                }
            )
            .then(() => {
                setDeptId("");
                setLevelId("");
                setSectionName("");
                setSubSectionName("");
                router.reload();
            });
    };

    useEffect(() => {
        if (userRole === "admin" && userDepartmentId) {
            const selectedDept = deptArray.find(
                (department) => department.id === userDepartmentId
            );
            if (selectedDept) {
                setDeptId(selectedDept.program_code);
                setProgramName(selectedDept.program_name);
            }
        }
    }, [userRole, userDepartmentId, deptArray]);

    const filteredSections = useMemo(() => {
        if (!deptId) return [];
        return sections.data
            .filter((section) => section.program_code === deptId)
            .map((section) => section.section_name);
    }, [sections, deptId]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="container mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                        <h2 className="text-xl lg:text-3xl font-semibold text-center flex items-center justify-center">
                            Section Management
                            <PiStudentFill fontSize="36" className="ml-2" />
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Section Management" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-4">
                {/* manage sections*/}
                <div
                    className="bg-muted/50 rounded-xl p-4 mt-5"
                    id="section-table"
                >
                    <h2 className="text-2xl font-semibold">Manage Sections</h2>

                    <SectionDataTable
                        sections={sections.data}
                        userTheme={userTheme}
                        userDepartmentProgramCode={deptId}
                        userRole={auth?.user?.role}
                    />
                </div>

                {/* add */}
                <div className="bg-muted/50 rounded-xl p-4 mt-5">
    <h2 className="text-2xl font-semibold">Create New Section</h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2 col-span-2">
            <div id="department-selection">
                <Label htmlFor="dept_id" className="text-base p-1">
                    Select Department
                </Label>
                <Select
                    name="dept_id"
                    value={deptId}
                    onValueChange={handleDeptChange}
                    disabled={userRole === "admin"}
                >
                    <SelectTrigger id="dept_id" className="w-full">
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Departments</SelectLabel>
                            <SelectItem value="null" key="none">
                                Select Department
                            </SelectItem>
                            {sortedDepartments.map((item) => (
                                <SelectItem key={item.id} value={item.program_code}>
                                    {item.program_name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div id="year-level-selection">
                <Label htmlFor="level_id" className="text-base p-1">
                    Select Year Level
                </Label>
                <Select
                    name="level_id"
                    value={levelId}
                    onValueChange={handleLevelChange}
                    disabled={!deptId}
                >
                    <SelectTrigger id="level_id" className="w-full">
                        <SelectValue placeholder="Select Year Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Year Levels</SelectLabel>
                            {levelArray.map((item) => (
                                <SelectItem key={item.id} value={item.level_name}>
                                    {item.level_name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div id="section-name-preview">
                <Label htmlFor="section_name" className="text-base p-1">
                    Section Name
                </Label>
                <Input
                    id="section_name"
                    className="w-full"
                    placeholder="1-A"
                    autoComplete="off"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    disabled={!deptId || !levelId}
                />
            </div>

            <div id="subsection-name-preview">
                <Label htmlFor="subsection_name" className="text-base p-1">
                    Subsection Name (Optional)
                </Label>
                <Input
                    id="subsection_name"
                    className="w-full"
                    placeholder="Structural / Construction"
                    autoComplete="off"
                    value={subSectionName}
                    onChange={(e) => setSubSectionName(e.target.value)}
                    disabled={!deptId || !levelId}
                />
            </div>
        </div>

        <div
            className="rounded-2xl bg-muted/50 p-4 shadow-lg"
            id="existing-sections-preview"
        >
            <p className="mb-4 font-medium flex justify-center">
                Created Sections
                <BadgeCheck color="#22c55e" className="ml-1" />
            </p>
            <ul className="list-disc list-inside overflow-y-auto h-[100px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSections.map((section, index) => (
                        <li key={index}>{section}</li>
                    ))}
                </div>
            </ul>
        </div>
    </div>

    <div className="flex mt-4 justify-end">
        <Button
            id="create-section"
            onClick={handleSubmit}
            disabled={!levelId || !sectionName}
        >
            Add Section
        </Button>
    </div>
</div>
            </div>
        </AuthenticatedLayout>
    );
}
