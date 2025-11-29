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
import useTour from "@/Composables/useTour";
import { UsersRound } from "lucide-react";

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
                    tooltipClass: "welcome-tool-tip"
                },
                {
                    intro: `📋 <b>Active Sections Table</b><br>  
                            View all active sections per department.  
                            Easily <b>activate</b> or <b>deactivate</b> sections to maintain accurate records.`,
                    element: document.querySelector("#section-table") as HTMLElement,
                    tooltipClass: "steps-tool-tip"
                },
                {
                    intro: `🔎 <b>Search & Filter</b><br>  
                            Use this <b>search bar</b> to quickly find sections by department, year level, or section name.`,
                    element: document.querySelector("#filter_dept") as HTMLElement,
                    tooltipClass: "steps-tool-tip"
                },
                {
                    intro: `📚 <b>Create a New Section</b><br>  
                            Start by selecting the <b>Department</b> where the new section will be added.`,
                    element: document.querySelector("#department-selection") as HTMLElement,
                    tooltipClass: "steps-tool-tip"
                },
                {
                    intro: `🎓 <b>Select Year Level</b><br>  
                            Choose the appropriate <b>Year Level</b> for the new section.`,
                    element: document.querySelector("#year-level-selection") as HTMLElement,
                    tooltipClass: "steps-tool-tip"
                },
                {
                    intro: `🔄 <b>Auto-Generated Section Name</b><br>  
                            Once the department and year level are selected, the system will <b>automatically generate</b> the section name for you.`,
                    element: document.querySelector("#section-name-preview") as HTMLElement,
                    tooltipClass: "steps-tool-tip"
                },
                {
                    intro: `✅ <b>Confirm & Create</b><br>  
                            Everything is set! Click the button below to <b>create the new section</b>.`,
                    element: document.querySelector("#create-section") as HTMLElement,
                    tooltipClass: "steps-tool-tip"
                },
            ],
            
            
        })

    const userRole = auth?.user?.role;
    const userDepartmentId = auth?.user?.department_id;     
    const deptArray = Array.isArray(academic_programs)
        ? academic_programs
        : academic_programs.data || [];

    const filteredDepartments = userRole == 'admin'
     ? deptArray.filter(department => department.id === userDepartmentId)
     : deptArray;

    const levelArray = Array.isArray(levels) ? levels : levels.data || [];

    const [deptId, setDeptId] = useState<string>("");
    const [levelId, setLevelId] = useState<string>("");
    const [programName, setProgramName] = useState<string>("");
    const [sectionName, setSectionName] = useState<string>("");
    const [existingSections, setExistingSections] = useState<string[]>([]);
    const [userProgramCode, setUserProgramCode] = useState<string>("");

    const handleDeptChange = (value: string) => {
        setDeptId(value);
        const selectedDept = deptArray.find(
            (item) => item.program_code === value
        );
        setProgramName(selectedDept ? selectedDept.program_name : "");

        setSectionName("");
        setExistingSections([]);
    };

    const handleLevelChange = (value: string) => {
        setLevelId(value);

        setSectionName("");
        setExistingSections([]);
    };

    useEffect(() => {
        if (levelId && deptId) {
            axios
                .get(
                    route("sections.get", {
                        program_code: deptId,
                        program_name: programName,
                        level: levelId,
                    })
                )
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        setExistingSections(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching section names:", error);
                });
        }
    }, [levelId, deptId]);

    useEffect(() => {
        if (levelId && deptId) {
            const generateUniqueSectionName = () => {
                let newSectionName = "";

                if (existingSections.length === 0) {
                    newSectionName = `${deptId} ${levelId.charAt(0)}-A`;
                } else {
                    let suffixIndex = 1;

                    while (true) {
                        const sectionSuffix = String.fromCharCode(
                            64 + suffixIndex
                        );
                        newSectionName = `${deptId} ${levelId.charAt(
                            0
                        )}-${sectionSuffix}`;

                        if (!existingSections.includes(newSectionName)) {
                            break;
                        }
                        suffixIndex++;
                    }
                }
                setSectionName(newSectionName);
            };
            generateUniqueSectionName();
        }
    }, [existingSections, levelId, deptId]);

    const handleSubmit = () => {
        toast
            .promise(
                axios.post(
                    route("sections.store"),
                    {
                        program_code: deptId,
                        level: levelId,
                        section_name: sectionName,
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
                        <span>{sectionName} added successfully!</span>
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
                setExistingSections([]);
                router.reload();
            });
    };

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
                <div className="container mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                        <h2 className="text-3xl font-semibold text-center flex items-center justify-center">
                            Section Management
                            {/* <UsersRound size={36} className="ml-2" /> */}
                            <PiStudentFill
                                fontSize="36"
                                className="ml-2"
                            />
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Section Management" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-4">
                {/* manage sections*/}
                <div className="bg-muted/50 rounded-xl p-4 mt-5" id="section-table">
                    <h2 className="text-2xl font-semibold">Manage Sections</h2>

                    <SectionDataTable
                        sections={sections.data}
                        userTheme={userTheme}
                        userDepartmentProgramCode={userProgramCode}
                        userRole={auth?.user?.role}
                    />
                </div>

                {/* add */}
                <div className="bg-muted/50 rounded-xl p-4 mt-5">
                    <h2 className="text-2xl font-semibold">
                        Create New Section
                    </h2>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div id="department-selection">
                            <Label htmlFor="dept_id" className="text-l p-1">
                                Select Department
                            </Label>
                            <Select
                                name="dept_id"
                                value={deptId}
                                onValueChange={handleDeptChange}
                            >
                                <SelectTrigger id="dept_id" className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Departments</SelectLabel>
                                        {filteredDepartments.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.program_code}
                                            >
                                                {item.program_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div id="year-level-selection">
                            <Label htmlFor="level_id" className="text-l p-1">
                                Select Year Level
                            </Label>
                            <Select
                                name="level_id"
                                value={levelId}
                                onValueChange={handleLevelChange}
                                disabled={!deptId}
                            >
                                <SelectTrigger id="level_id" className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Year Levels</SelectLabel>
                                        {levelArray.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.level_name}
                                            >
                                                {item.level_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div id="section-name-preview">
                            <Label
                                htmlFor="section_name"
                                className="text-l p-1"
                            >
                                Section Name
                            </Label>
                            <Input
                                id="section_name"
                                className="w-full"
                                placeholder=""
                                autoComplete="off"
                                value={sectionName}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="flex mt-4 justify-end">
                        <Button id="create-section" onClick={handleSubmit} disabled={!levelId}>
                            Add Section
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}