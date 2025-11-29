import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import "./FacultyCalendar.css";
import FacultyCalendar from "./FacultyCalendar";
import { Label } from "@/Components/ui/label";
import useTour from "@/Composables/useTour";
import { FacultyLoadingSelectCY } from "./SelectCurriulum";
import { Skeleton } from "@/Components/ui/skeleton";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { ImageDown } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface Department {
    id: number;
    name: string;
    program_code: string;
    logo: string;
}

interface Teacher {
    id: number;
    name: string;
    profile_picture: string;
    position: {
        name: string;
    };
}

export interface FacultyBoxProps {
    year: string;
    period_name?: string;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    semester: string;
    setSemester: React.Dispatch<React.SetStateAction<string>>;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    user: string;
    userDepartmentId: number;
    userRole: "user" | "admin" | "super-admin";
    deanName: string;
}

export default function FacultyBox({
    period_name = "",
    year,
    setYear,
    semester,
    setSemester,
    userTheme,
    systemTheme,
    user,
    userDepartmentId,
    userRole,
    deanName,
}: FacultyBoxProps): JSX.Element {
    useTour({
        user: user,
        name: "showFacultyScheduleTour",
        steps: () => [
            {
                title: "Welcome to Faculty Schedule",
                intro: `This page helps you view your teaching schedule efficiently.<br>
                            Let's take a quick tour of the key features.<br><br>  
                            <b>RN DevWorks</b> 💻`,
                tooltipClass: "four-fifty-tool-tip",
            },
            {
                intro: `📚 <b>Select Department</b><br>  
                            Choose your department to view the relevant schedules and assignments.`,
                element: document.querySelector(
                    "#select-department-view"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 Continue Exploring!",
                intro: ` To proceed, please <b>select your department.</b><br><br>  
                              <b>RN DevWorks</b> 💻`,
                tooltipClass: "four-fifty-tool-tip",
            },
        ],
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDept, setLoadingDept] = useState<boolean>(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [periods, setPeriods] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);

    // set default values for year and semester from localStorage
    useEffect(() => {
        if (year) {
            localStorage.setItem("facultySchedule_year", JSON.stringify(year));
        }
        if (semester) {
            localStorage.setItem(
                "facultySchedule_semester",
                JSON.stringify(semester)
            );
        }
    }, [year, semester]);

    useEffect(() => {
        const savedYear = localStorage.getItem("facultySchedule_year");
        const savedSemester = localStorage.getItem("facultySchedule_semester");
        if (savedYear && setYear) setYear(JSON.parse(savedYear));
        if (savedSemester && setSemester)
            setSemester(JSON.parse(savedSemester));
    }, []);

    const handleEventsChange = (newEvents: any[]) => {
        setEvents(newEvents);
    };

    useEffect(() => {
        axios
            .get(route("control.get_periods", { period_name }))
            .then((response) => {
                setPeriods(response.data);
            })
            .catch((error) => {
                console.error("Error fetching periods:", error);
            });
    }, [period_name]);

    useEffect(() => {
        setLoadingDept(true);
        axios
            .get("/api/departments/active")
            .then((response) => {
                setDepartments(response.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the departments data!",
                    error
                );
            })
            .finally(() => {
                setLoadingDept(false);
            });
    }, []);

    const handleDepartmentClick = (department: Department) => {
        setLoading(true);
        setSelectedDepartment(department);

        axios
            .get(`/api/departments/${department.id}/teachers`)
            .then((response) => {
                setTeachers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the teachers data!",
                    error
                );
                setLoading(false);
            });
    };

    const handleBack = () => {
        setSelectedDepartment(null);
        setTeachers([]);
    };

    const handleTeacherClick = (teacher: Teacher) => {
        if (!year || !semester) return;
        setSelectedTeacher(teacher);
        setIsDialogOpen(true);
    };

    // Helper function to get the correct image path
    const getImageUrl = (imagePath: string | null): string => {
        if (!imagePath) return "https://via.placeholder.com/150"; // Return a placeholder URL instead of null

        // If the path already includes http/https, use it as is
        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }

        // If the path starts with a slash, it's relative to the base URL
        if (imagePath.startsWith("/")) {
            return imagePath;
        }

        // Otherwise, prepend the storage path
        return `/storage/${imagePath}`;
    };

    //downloadSchedule as Image PDF
    // const downloadSchedule = async () => {
    //     const views = ["calendar", "table"];
    //     const images = [];

    //     for (const view of views) {
    //         const element = document.getElementById(`faculty_${view}_view`);
    //         if (element) {
    //             const clone = element.cloneNode(true) as HTMLElement;
    //             clone.style.height = "auto";
    //             clone.style.overflow = "visible";

    //             if (
    //                 userTheme === "dark" ||
    //                 (userTheme === "system" && systemTheme)
    //             ) {
    //                 clone.classList.add("dark");
    //                 clone.style.backgroundColor = "#1e1e1e";
    //                 clone.style.color = "#ffffff";
    //             } else {
    //                 clone.classList.remove("dark");
    //                 clone.style.backgroundColor = "#ffffff";
    //                 clone.style.color = "#000000";
    //             }

    //             document.body.appendChild(clone);

    //             const dataUrl = await htmlToImage.toJpeg(clone, {
    //                 quality: 1.0,
    //             });
    //             images.push({ view, dataUrl });
    //             document.body.removeChild(clone);
    //         }
    //     }

    //     const pdf = new jsPDF({
    //         orientation: "landscape",
    //     });

    //     // Add teacher's name to the PDF
    //     pdf.setFontSize(9);
    //     pdf.text(`${selectedTeacher?.name}'s Schedule`, 10, 5); // x, y
    //     pdf.text(
    //         `${semester} - Academic Year ${year} - ${Number(year) + 1}`,
    //         10,
    //         11
    //     );

    //     images.forEach((image, index) => {
    //         if (index > 0) pdf.addPage();
    //         let width, height;
    //         switch (image.view) {
    //             case "calendar":
    //                 width = 220;
    //                 height = 175;
    //                 break;
    //             case "table":
    //                 width = 270;
    //                 height = 30;
    //                 break;
    //             default:
    //                 width = 220;
    //                 height = 175;
    //         }
    //         pdf.addImage(image.dataUrl, "JPEG", 10, 14, width, height);
    //     });

    //     const formatFacultyName = (name: string): string => {
    //         const nameParts = name.split(" ");
    //         if (nameParts.length === 3) {
    //             return `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2]}`;
    //         } else if (nameParts.length > 3) {
    //             return `${nameParts[0]} ${nameParts[1][0]}. ${
    //                 nameParts[nameParts.length - 1]
    //             }`;
    //         }
    //         return name;
    //     };

    //     const formattedName = selectedTeacher?.name
    //         ? formatFacultyName(selectedTeacher.name)
    //         : "";

    //     pdf.save(`${formattedName}_Faculty_Schedule.pdf`);
    // };

    const showSelectMessage = !year || !semester;

    if (selectedDepartment) {
        return (
            <div className="p-4">
                <div className="flex items-center mb-6">
                    <button
                        className="p-2 mr-4 bg-gray-200 rounded-full hover:bg-gray-300"
                        onClick={handleBack}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            // fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold">
                        {selectedDepartment.name} Faculty
                    </h2>
                </div>

                {showSelectMessage && (
                    <div className="mb-3 text-red-500">
                        Select a year and semester to proceed.
                    </div>
                )}
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-12 h-12 border-b-2 border-blue-700 rounded-full animate-spin"></div>
                    </div>
                ) : teachers.length > 0 ? (
                    <>
                        <div className="flex gap-2 mb-5">
                            <div className="w-[200px]">
                                <FacultyLoadingSelectCY
                                    id="faculty_loading_cy"
                                    program_code={
                                        selectedDepartment?.program_code
                                    }
                                    value={year}
                                    onChange={(value) => {
                                        setYear(value);
                                    }}
                                />
                            </div>
                            {/* Select Period */}
                            <div className="w-[200px]">
                                <Select
                                    name="period"
                                    value={semester}
                                    onValueChange={(value) => {
                                        setSemester(value);
                                    }}
                                >
                                    <Label>Select Semester</Label>
                                    <SelectTrigger id="period">
                                        <SelectValue placeholder="Select Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Semesters</SelectLabel>
                                            {periods.length > 0 ? (
                                                periods.map((period) => (
                                                    <SelectItem
                                                        value={
                                                            period.period_name
                                                        }
                                                        key={period.id}
                                                    >
                                                        {period.period_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="null"
                                                    disabled
                                                >
                                                    No semester available
                                                </SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {teachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    className={`flex flex-col items-center p-4 transition-all bg-white rounded-lg shadow 
                                        ${
                                            !year || !semester
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer hover:shadow-lg hover:scale-[102%]"
                                        }`}
                                    onClick={() => handleTeacherClick(teacher)}
                                >
                                    <div className="w-20 h-20 mb-3 overflow-hidden bg-gray-100 rounded-full ">
                                        {teacher.profile_picture ? (
                                            <img
                                                src={getImageUrl(
                                                    teacher.profile_picture
                                                )}
                                                alt={`${teacher.name} profile`}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    const target =
                                                        e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src =
                                                        "https://via.placeholder.com/150?text=" +
                                                        teacher.name.charAt(0);
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-xl font-bold text-blue-800 bg-blue-100">
                                                {teacher.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-center text-black">
                                        {teacher.name}
                                    </h3>
                                    <p className="text-sm text-center text-gray-500">
                                        {teacher.position?.name || "Faculty"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="py-10 text-center text-gray-500">
                        No faculty members found for this department.
                    </div>
                )}

                {/* Teacher Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="w-[90%] sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedTeacher
                                    ? `${selectedTeacher.name}'s Schedule`
                                    : "Faculty Schedule"}
                            </DialogTitle>
                            <DialogDescription>
                                {semester && year
                                    ? `${semester} - Academic Year ${year} - ${
                                          Number(year) + 1
                                      }`
                                    : "Select a period and year to view schedule"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="overflow-y-auto max-h-[calc(90vh-10rem)]">
                            <FacultyCalendar
                                teacherId={selectedTeacher?.id}
                                teacherName={selectedTeacher?.name}
                                departmentName={selectedDepartment?.name || ""}
                                year={year}
                                semester={semester}
                                userTheme={userTheme}
                                systemTheme={systemTheme}
                                userRole={userRole}
                                userName={user}
                                deanName={deanName}
                            />
                        </div>
                        <DialogFooter className="sm:justify-center">
                            {/* <Button
                                type="button"
                                variant="default"
                                onClick={downloadScheduleAsExcel}
                            >
                                <ImageDown />
                                Download Schedule
                            </Button> */}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {loadingDept
                ? Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton
                          key={index}
                          className="h-[100px] w-[auto] rounded-xl"
                      />
                  ))
                : departments.map((department) => {
                      const isDisabled =
                          userRole !== "super-admin" &&
                          department.id !== userDepartmentId;

                      return (
                          <div
                              key={department.id}
                              className={`flex items-center p-4 transition-all bg-white border border-gray-200 rounded-lg shadow-md ${
                                  isDisabled
                                      ? "cursor-not-allowed opacity-50"
                                      : "cursor-pointer hover:shadow-lg hover:scale-[102%]"
                              }`}
                              onClick={
                                  isDisabled
                                      ? undefined
                                      : () => handleDepartmentClick(department)
                              }
                          >
                              <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 mr-4 overflow-hidden bg-gray-100 rounded-full">
                                  {department.logo ? (
                                      <img
                                          src={getImageUrl(department.logo)}
                                          alt={`${department.name} logo`}
                                          className="object-cover w-full h-full"
                                          onError={(e) => {
                                              const target =
                                                  e.target as HTMLImageElement;
                                              target.onerror = null;
                                              target.src =
                                                  "https://via.placeholder.com/150?text=" +
                                                  department.name.charAt(0);
                                          }}
                                      />
                                  ) : (
                                      <span className="text-xl font-bold text-gray-400">
                                          {department.name.charAt(0)}
                                      </span>
                                  )}
                              </div>
                              <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                      Department of {department.name}
                                  </h3>
                                  {/* <p className="text-sm text-gray-500">
                                      Department
                                  </p> */}
                              </div>
                          </div>
                      );
                  })}
        </div>
    );
}
