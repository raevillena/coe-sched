import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { CurriculumProps, Curriculum } from "@/types/my_types";
import { jsPDF } from "jspdf";
import footer from "/Images/pdf/footer.png";
import mmsu_logo from "/Images/mmsu.png";
import coe_logo from "/Images/coe.png";
import * as XLSX from "xlsx-js-style";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { useEffect, useState } from "react";
import { Download, MonitorCheck } from "lucide-react";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import useTour from "@/Composables/useTour";
import { image } from "@heroui/theme";

export default function ListCurriculum({
    auth,
    curriculums,
    program_name,
    curriculum_year,
    breadcrumbs,
    periods,
    levels,
}: CurriculumProps) {
    useTour({
        user: auth.user,
        name: "showListCurriculumTour",
        steps: () => [
            {
                title: "Welcome to the Curriculum List!",
                intro: `Hello, <b>${auth?.user?.name}</b>! 👋<br><br>  
                        This page allows you to efficiently manage <b>curriculums, academic programs, and courses</b> within the institution.<br><br>  
                        Let's take a quick tour of the key features to help you navigate with ease.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "welcome-tool-tip",
            },
            {
                intro: `📋 <b>Download Curriculum as PDF</b><br>  
                        Click this button to <b>export</b> the entire curriculum in a well-formatted <b>PDF file</b>. This is useful for printing or official documentation.`,
                element: document.querySelector(
                    "#download-pdf-button"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📊 <b>Download Curriculum as Excel</b><br>  
                        Export the curriculum in an <b>Excel spreadsheet</b>, allowing for easy data manipulation, filtering, and reporting.`,
                element: document.querySelector(
                    "#download-excel-button"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📌 <b>Select A4 or Legal for PDF</b><br>  
                        Choose between <b>A4</b> and <b>Legal</b> paper sizes when generating a PDF. This ensures compatibility with different printing requirements.`,
                element: document.querySelector(
                    "#pdf-size-selection"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📅 <b>Select Year Level</b><br>  
                        Filter the curriculum by <b>year level</b> to quickly find relevant subjects for a specific academic year.`,
                element: document.querySelector(
                    "#year-level-selection"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
        ],
    });

    //choose year level function
    const levelsArray = Array.isArray(levels) ? levels : levels.data || [];
    const [selectedLevel, setSelectedLevel] = useState(
        levelsArray.length > 0 ? levelsArray[0].level_name : "1st Year"
    );

    const handle_level_change = (newLevel: string) => {
        if (newLevel === "all") {
            setSelectedLevel("all");
        } else {
            setSelectedLevel(newLevel);
        }
    };

    //filter selected level
    const filtered_curriculums = selectedLevel === "all"
    ? curriculums
    : curriculums.filter((curriculum) => curriculum.level === selectedLevel);

    // Get unique semesters for download pdf and excel
    const uniqueSemesters = Array.from(
        new Set(filtered_curriculums.map((curriculum) => curriculum.period))
    );

    //compute total units
    const computeTotals = (curriculums: Curriculum[]) => {
        return curriculums.reduce(
            (acc, curriculum) => {
                acc.lec += Number(curriculum.lec) || 0;
                acc.lab += Number(curriculum.lab) || 0;
                acc.units += Number(curriculum.units) || 0;
                return acc;
            },
            { lec: 0, lab: 0, units: 0 }
        );
    };

    const baseUrl = import.meta.env.VITE_APP_URL;

    //download pdf function
    const [imageFooterUrl, setImageFooterUrl] = useState("");
    const [imageHeaderUrl, setImageHeaderUrl] = useState("");
    const [paperSize, setPaperSize] = useState("a4");

    useEffect(() => {
        axios
            .get(
                route("get_active_header_footer", { type: "curriculum_header" })
            )
            .then((response) => {
                if (response.data && response.data.image) {
                    setImageHeaderUrl(
                        `${baseUrl}/storage/${response.data.image}`
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching active header image:", error);
            });

        axios
            .get(
                route("get_active_header_footer", { type: "curriculum_footer" })
            )
            .then((response) => {
                if (response.data && response.data.image) {
                    setImageFooterUrl(
                        `${baseUrl}/storage/${response.data.image}`
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching active footer image:", error);
            });
    }, []);

    const handlePaperSizeChange = (newSize: string) => {
        setPaperSize(newSize);
    };

    const downloadPDF = () => {
        const doc = new jsPDF({
            format: paperSize,
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 2;
        const lineHeight = 7;
        const footerHeight = 20;
        const headerHeight = 20;

        // header and footer images
        const headerImageUrl = `${imageHeaderUrl}`;
        const footerImageUrl = `${imageFooterUrl}`;

        const headerImage = new Image();
        headerImage.src = headerImageUrl;

        const footerImage = new Image();
        footerImage.src = footerImageUrl;

        headerImage.onload = function () {
            footerImage.onload = function () {
                const addHeaderFooter = () => {
                    // add header image
                    const headerImgWidth = 207;
                    const headerImgHeight = 34;
                    doc.addImage(
                        headerImage,
                        "PNG",
                        margin,
                        11,
                        headerImgWidth,
                        headerImgHeight
                    );

                    // center program_name text with larger font size
                    doc.setFontSize(11); // change font size for program name
                    doc.setFont("helvetica", "bold");
                    const programText = `${program_name}`;
                    const programTextWidth = doc.getTextWidth(programText);
                    const programTextX = (pageWidth - programTextWidth) / 2;
                    doc.text(programText, programTextX, 47); // old 42

                    // center Curriculum Year text
                    doc.setFontSize(11); // change font size for curriculum year
                    doc.setFont("helvetica", "bold");
                    const curriculumText = `Curriculum Year ${curriculum_year}`;
                    const curriculumTextWidth =
                        doc.getTextWidth(curriculumText);
                    const curriculumTextX =
                        (pageWidth - curriculumTextWidth) / 2;
                    doc.text(curriculumText, curriculumTextX, 54); // old 49

                    // add footer image
                    doc.setFontSize(11); // reset font size for the rest of the document
                    const footerImgWidth = 207;
                    const footerImgHeight = 34;
                    doc.addImage(
                        footerImage,
                        "PNG",
                        (pageWidth - footerImgWidth) / 2,
                        pageHeight - footerImgHeight,
                        footerImgWidth,
                        footerImgHeight
                    );
                };

                const extractPreReqsText = (preReqs: string) => {
                    const matches = preReqs.match(/\(([^)]+)\)/g);
                    if (matches) {
                        const items = matches.map((match) =>
                            match.slice(1, -1)
                        );
                        const grouped = [];
                        for (let i = 0; i < items.length; i += 2) {
                            grouped.push(items.slice(i, i + 2).join(", "));
                        }
                        return grouped;
                    }
                    return [preReqs];
                };

                const addTableCell = (
                    text: string,
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                    isBold = false
                ) => {
                    if (isBold) {
                        doc.setFont("helvetica", "bold");
                    }
                    const textLines = doc.splitTextToSize(text, width - 4); // wrap text within cell
                    doc.rect(x, y, width, height); // draw the cell border
                    doc.text(textLines, x + 2, y + 2 + lineHeight / 2); // add text with padding
                    if (isBold) {
                        doc.setFont("helvetica", "normal");
                    }
                };

                const calculateCellHeight = (text: string, width: number) => {
                    const textLines = doc.splitTextToSize(text, width - 4); // wrap text within cell
                    return textLines.length * lineHeight;
                };

                const marginTable = 22;
                const addSemesterContent = (
                    semester: string,
                    initialY: number,
                    level: string
                ) => {
                    let y = initialY;
                    doc.setFontSize(9); // change font size for semester headers
                    doc.setFont("helvetica", "bold");
                    doc.text(`${level} - ${semester}`, marginTable, y);
                    doc.setFont("helvetica", "normal");
                    y += 2;

                    // Table headers
                    const headers = [
                        "Course Code",
                        "Course Name",
                        "Lec",
                        "Lab",
                        "Units",
                        "Pre-requisites",
                    ];
                    const colWidths = [30, 85, 10, 10, 12, 30];

                    let x = marginTable;
                    headers.forEach((header, index) => {
                        addTableCell(
                            header,
                            x,
                            y,
                            colWidths[index],
                            lineHeight,
                            true
                        );
                        x += colWidths[index];
                    });
                    y += lineHeight;

                    const levelFilteredCurriculums = curriculums.filter(
                        (curriculum) => curriculum.level === level
                    );

                    const semesterData = levelFilteredCurriculums.filter(
                        (curriculum) => curriculum.period === semester
                    );

                    semesterData.forEach((curriculum) => {
                        const courseCode = curriculum.course_code || "";
                        const courseName = curriculum.course_name || "";
                        const lec = curriculum.lec?.toString() || "0";
                        const lab = curriculum.lab?.toString() || "0";
                        const units = curriculum.units?.toString() || "0";
                        const preReqs = curriculum.pre_reqs || "";

                        const preReqLines = extractPreReqsText(preReqs);
                        const preReqsHeight = preReqLines.reduce(
                            (acc, line) => {
                                return (
                                    acc +
                                    calculateCellHeight(line, colWidths[5])
                                );
                            },
                            0
                        );
                        const rowHeight = Math.max(
                            lineHeight,
                            calculateCellHeight(courseCode, colWidths[0]),
                            calculateCellHeight(courseName, colWidths[1]),
                            calculateCellHeight(lec, colWidths[2]),
                            calculateCellHeight(lab, colWidths[3]),
                            calculateCellHeight(units, colWidths[4]),
                            preReqsHeight
                        );

                        if (
                            y + rowHeight + footerHeight >
                            pageHeight - marginTable
                        ) {
                            doc.addPage();
                            y = headerHeight + marginTable + lineHeight;
                            addHeaderFooter();
                        }

                        x = marginTable;
                        addTableCell(courseCode, x, y, colWidths[0], rowHeight);
                        x += colWidths[0];
                        addTableCell(courseName, x, y, colWidths[1], rowHeight);
                        x += colWidths[1];
                        addTableCell(lec, x, y, colWidths[2], rowHeight);
                        x += colWidths[2];
                        addTableCell(lab, x, y, colWidths[3], rowHeight);
                        x += colWidths[3];
                        addTableCell(units, x, y, colWidths[4], rowHeight);
                        x += colWidths[4];
                        addTableCell(
                            preReqLines.join(", "),
                            x,
                            y,
                            colWidths[5],
                            rowHeight
                        );

                        y += rowHeight;
                    });

                    const semesterTotals = computeTotals(semesterData);
                    x = marginTable;
                    const totalText = "TOTAL";
                    const totalTextWidth = doc.getTextWidth(totalText);
                    const totalTextX =
                        (colWidths[0] + colWidths[1] - totalTextWidth) / 2 +
                        marginTable;
                    doc.setFont("helvetica", "bold");
                    doc.text(totalText, totalTextX, y + 10 / 2);
                    doc.rect(
                        marginTable,
                        y,
                        colWidths[0] + colWidths[1],
                        lineHeight
                    );
                    doc.setFont("helvetica", "normal");
                    x += colWidths[0] + colWidths[1];
                    addTableCell(
                        semesterTotals.lec.toString(),
                        x,
                        y,
                        colWidths[2],
                        lineHeight,
                        true
                    );
                    x += colWidths[2];
                    addTableCell(
                        semesterTotals.lab.toString(),
                        x,
                        y,
                        colWidths[3],
                        lineHeight,
                        true
                    );
                    x += colWidths[3];
                    addTableCell(
                        semesterTotals.units.toString(),
                        x,
                        y,
                        colWidths[4],
                        lineHeight,
                        true
                    );
                    x += colWidths[4];
                    addTableCell("", x, y, colWidths[5], lineHeight);

                    y += lineHeight + 10; // Add extra space after the "Total" row
                    return y;
                };

                const marginData = 35;
                let y = headerHeight + marginData + lineHeight;

                const validLevels = levelsArray.filter((level) => {
                    const levelFilteredCurriculums = curriculums.filter(
                        (curriculum) => curriculum.level === level.level_name
                    );
                    return levelFilteredCurriculums.length > 0;
                });

                if (validLevels.length === 0) {
                    alert("No data available to generate the PDF.");
                    return;
                }

                validLevels.forEach((level, levelIndex) => {
                    if (levelIndex !== 0) {
                        doc.addPage();
                        y = headerHeight + marginData + lineHeight;
                        addHeaderFooter();
                    }

                    const levelFilteredCurriculums = curriculums.filter(
                        (curriculum) => curriculum.level === level.level_name
                    );

                    const uniqueSemesters = Array.from(
                        new Set(
                            levelFilteredCurriculums.map(
                                (curriculum) => curriculum.period
                            )
                        )
                    );

                    uniqueSemesters.forEach((semester, semesterIndex) => {
                        if (semesterIndex === 0 && levelIndex === 0) {
                            addHeaderFooter();
                        }

                        y = addSemesterContent(semester, y, level.level_name);

                        if (
                            semesterIndex < uniqueSemesters.length - 1 &&
                            y + lineHeight + footerHeight >
                                pageHeight - marginData
                        ) {
                            doc.addPage();
                            y = headerHeight + marginData + lineHeight;
                            addHeaderFooter();
                        }
                    });
                });

                doc.save(`${program_name}_${curriculum_year}_Curriculum.pdf`);
            };
        };
    };
    //end of download pdf function

    // download excel function with different sheets
    // const downloadExcel = () => {
    //     const workbook = XLSX.utils.book_new();

    //     levelsArray.forEach((level) => {
    //         const levelFilteredCurriculums = curriculums.filter(
    //             (curriculum) => curriculum.level === level.level_name
    //         );

    //         const uniqueSemesters = Array.from(
    //             new Set(
    //                 levelFilteredCurriculums.map(
    //                     (curriculum) => curriculum.period
    //                 )
    //             )
    //         );

    //         uniqueSemesters.forEach((semester) => {
    //             const semesterData = levelFilteredCurriculums.filter(
    //                 (curriculum) => curriculum.period === semester
    //             );
    //             const worksheetData = semesterData.map((curriculum) => ({
    //                 "Course Code": curriculum.course_code,
    //                 "Course Name": curriculum.course_name,
    //                 Lec: curriculum.lec,
    //                 Lab: curriculum.lab,
    //                 Units: curriculum.units,
    //                 "Pre-requisites": curriculum.pre_reqs,
    //                 Complab: curriculum.is_complab ? "Yes" : "No",
    //             }));
    //             const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    //             worksheet["!cols"] = [
    //                 { wch: 15 }, // Course Code
    //                 { wch: 30 }, // Course Name
    //                 { wch: 10 }, // Lec
    //                 { wch: 10 }, // Lab
    //                 { wch: 8 }, // Units
    //                 { wch: 45 }, // Pre-requisites
    //                 { wch: 12 }, // Complab
    //             ];

    //             XLSX.utils.book_append_sheet(
    //                 workbook,
    //                 worksheet,
    //                 `${level.level_name} - ${semester}`
    //             );
    //         });
    //     });

    //     XLSX.writeFile(
    //         workbook,
    //         `${program_name}_${curriculum_year}_Curriculum.xlsx`
    //     );
    // };
    //end of download excel function

    const downloadExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheetData: unknown[][] = [];

        worksheetData.push([`${program_name} ${curriculum_year}`]);
        worksheetData.push([]);

        levelsArray.forEach((level) => {
            const levelFilteredCurriculums = curriculums.filter(
                (curriculum) => curriculum.level === level.level_name
            );

            const uniqueSemesters = Array.from(
                new Set(
                    levelFilteredCurriculums.map(
                        (curriculum) => curriculum.period
                    )
                )
            );

            uniqueSemesters.forEach((semester) => {
                // semester header (e.g., "4th Year - 1st Sem")
                worksheetData.push([`${level.level_name} - ${semester}`]);

                // column headers
                worksheetData.push([
                    "Course Code",
                    "Course Name",
                    "Lec",
                    "Lab",
                    "Units",
                    "Pre-requisites",
                    "Complab",
                ]);

                // semester data
                const semesterData = levelFilteredCurriculums.filter(
                    (curriculum) => curriculum.period === semester
                );
                semesterData.forEach((curriculum) => {
                    worksheetData.push([
                        curriculum.course_code,
                        curriculum.course_name,
                        curriculum.lec,
                        curriculum.lab,
                        curriculum.units,
                        curriculum.pre_reqs,
                        curriculum.is_complab ? "Yes" : "No",
                    ]);
                });

                // blank row after each semester
                worksheetData.push([]);
            });
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // set column widths
        worksheet["!cols"] = [
            { wch: 15 }, // Course Code
            { wch: 30 }, // Course Name
            { wch: 10 }, // Lec
            { wch: 10 }, // Lab
            { wch: 8 }, // Units
            { wch: 50 }, // Pre-requisites
            { wch: 12 }, // Complab
        ];

        // Apply styles for semester headers, column headers, and other cells
        Object.keys(worksheet).forEach((cell) => {
            if (cell[0] === "!") return;

            const cellValue = worksheet[cell].v;

            const isSemesterHeader = levelsArray.some((level) => {
                return uniqueSemesters.some((semester) => {
                    return cellValue === `${level.level_name} - ${semester}`;
                });
            });

            if (cell === "A1") {
                worksheet[cell].s = {
                    font: { bold: true, sz: 14 },
                    alignment: { horizontal: "center" },
                };

                worksheet["!merges"] = [
                    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
                ];
                return;
            } else if (isSemesterHeader) {
                worksheet[cell].s = {
                    font: { bold: true, sz: 12 },
                };
            } else if (
                cellValue === "Course Code" ||
                cellValue === "Course Name" ||
                cellValue === "Lec" ||
                cellValue === "Lab" ||
                cellValue === "Units" ||
                cellValue === "Pre-requisites" ||
                cellValue === "Complab"
            ) {
                worksheet[cell].s = {
                    font: { bold: true },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                };
            } else {
                worksheet[cell].s = {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                };
            }
        });

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Curriculum Overview"
        );
        XLSX.writeFile(
            workbook,
            `${program_name}_${curriculum_year}_Curriculum.xlsx`
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
                    List of Subjects
                </h2>
            }
        >
            <Head title="Curriculum List" />
            <div className="mx-auto py-6 max-w-7xl">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold">
                                {program_name} - {curriculum_year}
                            </h1>
                        </div>

                        <div
                            className="mr-2 mt-4 lg:mt-0"
                            id="pdf-size-selection"
                        >
                            <Select
                                onValueChange={handlePaperSizeChange}
                                value={paperSize}
                            >
                                <SelectTrigger className="w-[90px]">
                                    <SelectValue placeholder="Select Paper Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Select Paper Size
                                        </SelectLabel>
                                        <SelectItem value="a4">A4</SelectItem>
                                        <SelectItem value="legal">
                                            Legal
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mt-4 lg:mt-0">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={downloadPDF}
                                            id="download-pdf-button"
                                        >
                                            <Download /> PDF
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p>Download Curriculum as PDF</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={downloadExcel}
                                            className="ml-2"
                                            id="download-excel-button"
                                        >
                                            <Download /> Excel
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p>Download Curriculum as Excel</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div
                            className="ml-0 mt-4 lg:mt-0 lg:ml-10"
                            id="year-level-selection"
                        >
                            <Select
                                onValueChange={handle_level_change}
                                value={selectedLevel}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Year Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Select Year Levels
                                        </SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        {levelsArray.map((item) => (
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
                    </div>

                    {periods.data
                        .filter((period) => period.is_active)
                        .map((period) => {
                            const period_curriculums =
                                filtered_curriculums.filter((curriculum) =>
                                    curriculum.period.includes(
                                        period.period_name
                                    )
                                );
                            const period_totals =
                                computeTotals(period_curriculums);

                            return (
                                <div
                                    key={period.id}
                                    className="sm:flex-auto mt-5"
                                >
                                    <p className="mt-2 font-medium text-sm">
                                        {period.period_name}
                                    </p>
                                    <Table>
                                        <TableCaption>
                                            {period.period_name}
                                        </TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Course Code
                                                </TableHead>
                                                <TableHead>
                                                    Course Description
                                                </TableHead>
                                                <TableHead>Lec</TableHead>
                                                <TableHead>Lab</TableHead>
                                                <TableHead>Units</TableHead>
                                                <TableHead>
                                                    Pre-requisite/s
                                                </TableHead>
                                                <TableHead className="flex justify-center items-center">
                                                    Complab
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {period_curriculums.length > 0 ? (
                                                period_curriculums.map(
                                                    (curriculum) => (
                                                        <TableRow
                                                            key={curriculum.id}
                                                        >
                                                            <TableCell className="w-[150px]">
                                                                {
                                                                    curriculum.course_code
                                                                }
                                                            </TableCell>
                                                            <TableCell className="w-[500px]">
                                                                {
                                                                    curriculum.course_name
                                                                }
                                                            </TableCell>
                                                            <TableCell className="w-[80px]">
                                                                {curriculum.lec}
                                                            </TableCell>
                                                            <TableCell className="w-[80px]">
                                                                {curriculum.lab}
                                                            </TableCell>
                                                            <TableCell className="w-[80px]">
                                                                {
                                                                    curriculum.units
                                                                }
                                                            </TableCell>
                                                            <TableCell className="w-[150px]">
                                                                {
                                                                    curriculum.pre_reqs
                                                                }
                                                            </TableCell>
                                                            <TableCell className="flex justify-center items-center">
                                                                {curriculum.is_complab ? (
                                                                    <MonitorCheck />
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={8}
                                                        className="text-center text-red-600"
                                                    >
                                                        No data found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                        <TableFooter className="bg-inherit">
                                            <TableRow>
                                                <TableCell
                                                    className="text-right"
                                                    colSpan={2}
                                                >
                                                    Total:
                                                </TableCell>
                                                <TableCell>
                                                    {period_totals.lec}
                                                </TableCell>
                                                <TableCell>
                                                    {period_totals.lab}
                                                </TableCell>
                                                <TableCell>
                                                    {period_totals.units}
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            );
                        })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
