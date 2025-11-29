import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { CurriculumProps, Curriculum } from "@/types/my_types";
import { jsPDF } from "jspdf";
import footer from "/Images/pdf/footer.png";
import mmsu_logo from "/Images/mmsu.png";
import coe_logo from "/Images/coe.png";

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

import { useState } from "react";
import { Download, MonitorCheck } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function ListCurriculum({
    auth,
    curriculums,
    program_name,
    curriculum_year,
    breadcrumbs,
}: CurriculumProps) {
    //choose year level function
    const [selectedLevel, setSelectedLevel] = useState("1st Year");

    const handle_level_change = (newLevel: string) => {
        setSelectedLevel(newLevel);
    };

    //filter selected level
    const filtered_curriculums = curriculums.filter(
        (curriculum) => curriculum.level === selectedLevel
    );

    //then get 1st sem data
    const first_sem = filtered_curriculums.filter((curriculum) =>
        curriculum.period.includes("1st Sem")
    );

    //2nd sem data
    const second_sem = filtered_curriculums.filter((curriculum) =>
        curriculum.period.includes("2nd Sem")
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

    const first_totals = computeTotals(first_sem);
    const second_totals = computeTotals(second_sem);

    //download pdf function
    const downloadPDF = () => {
        const doc = new jsPDF({
            format: "a4",
        });
        doc.setFontSize(11);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Define image paths for the logos
        const leftLogoUrl = `${mmsu_logo}`;
        const rightLogoUrl = `${coe_logo}`;

        const imgLeft = new Image();
        imgLeft.src = leftLogoUrl;

        const imgRight = new Image();
        imgRight.src = rightLogoUrl;

        imgLeft.onload = function () {
            imgRight.onload = function () {
                const logoLeftWidth = 15;
                const logoLeftHeight = 15;
                doc.addImage(
                    imgLeft,
                    "PNG",
                    45,
                    7,
                    logoLeftWidth,
                    logoLeftHeight
                );

                const logoRightWidth = 15;
                const logoRightHeight = 15;
                doc.addImage(
                    imgRight,
                    "PNG",
                    pageWidth - 45 - logoRightWidth,
                    7,
                    logoRightWidth,
                    logoRightHeight
                );
                // Center school text
                const schoolText = "Mariano Marcos State University";
                const schoolTextWidth = doc.getTextWidth(schoolText);
                const schoolTextX = (pageWidth - schoolTextWidth) / 2;
                doc.text(schoolText, schoolTextX, 10);

                // Center program_name text
                const programText = `${program_name}`;
                const programTextWidth = doc.getTextWidth(programText);
                const programTextX = (pageWidth - programTextWidth) / 2;
                doc.text(programText, programTextX, 17);

                // Center Curriculum Year text
                const curriculumText = `Curriculum Year ${curriculum_year} - ${selectedLevel}`;
                const curriculumTextWidth = doc.getTextWidth(curriculumText);
                const curriculumTextX = (pageWidth - curriculumTextWidth) / 2;
                doc.text(curriculumText, curriculumTextX, 24);

                // 1st Semester Data
                doc.text("1st Semester", 20, 40);
                let y = 50;
                doc.text("Course Code - Course Name", 20, y);
                doc.text("Lec", 135, y);
                doc.text("Lab", 145, y);
                doc.text("Units", 155, y);
                doc.text("Pre-requisites", 170, y);
                y += 10;

                first_sem.forEach((curriculum) => {
                    doc.text(
                        `${curriculum.course_code} - ${curriculum.course_name}`,
                        20,
                        y
                    );
                    doc.text(`${curriculum.lec}`, 137, y);
                    doc.text(`${curriculum.lab}`, 147, y);
                    doc.text(`${curriculum.units}`, 157, y);
                    doc.text(`${curriculum.pre_reqs}`, 175, y);
                    y += 10;
                });

                doc.text(
                    `Total: Lec: ${first_totals.lec}, Lab: ${first_totals.lab}, Units: ${first_totals.units}`,
                    135,
                    y
                );

                y += 10;
                doc.text("2nd Semester", 20, y);
                y += 10;

                doc.text("Course Code - Course Name", 20, y);
                doc.text("Lec", 135, y);
                doc.text("Lab", 145, y);
                doc.text("Units", 155, y);
                doc.text("Pre-requisites", 170, y);
                y += 10;

                second_sem.forEach((curriculum) => {
                    doc.text(
                        `${curriculum.course_code} - ${curriculum.course_name}`,
                        20,
                        y
                    );
                    doc.text(`${curriculum.lec}`, 137, y);
                    doc.text(`${curriculum.lab}`, 147, y);
                    doc.text(`${curriculum.units}`, 157, y);
                    doc.text(`${curriculum.pre_reqs}`, 175, y);
                    y += 10;
                });

                doc.text(
                    `Total: Lec: ${second_totals.lec}, Lab: ${second_totals.lab}, Units: ${second_totals.units}`,
                    135,
                    y
                );

                //footer
                const footerY = pageHeight - 0;
                const footerImageUrl = `${footer}`;
                const footerImage = new Image();
                footerImage.src = footerImageUrl;

                footerImage.onload = function () {
                    const footerImgWidth = 200;
                    const footerImgHeight = 20;
                    doc.addImage(
                        footerImage,
                        "PNG",
                        (pageWidth - footerImgWidth) / 2,
                        footerY - footerImgHeight,
                        footerImgWidth,
                        footerImgHeight
                    );

                    doc.save(
                        `${program_name}_${curriculum_year}_Curriculum.pdf`
                    );
                };
            };
        };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="text-xl font-semibold leading-tight ">
                    List of Curriculum
                </h2>
            }
        >
            <Head title="Curriculum List" />
            <div className="mx-auto max-w-7xl">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="mt-3 text-xl font-semibold ">
                                {program_name} - {curriculum_year}
                            </h1>
                            <p className="mt-2 font-medium text-sm">
                                1st Semester
                            </p>
                        </div>

                        <Button onClick={downloadPDF}>
                            <Download /> PDF
                        </Button>

                        <div className="ml-5">
                            <Select
                                onValueChange={handle_level_change}
                                value={selectedLevel}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Year Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Year Levels</SelectLabel>
                                        <SelectItem value="1st Year">
                                            1st Year
                                        </SelectItem>
                                        <SelectItem value="2nd Year">
                                            2nd Year
                                        </SelectItem>
                                        <SelectItem value="3rd Year">
                                            3rd Year
                                        </SelectItem>
                                        <SelectItem value="4th Year">
                                            4th Year
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableCaption>1st Semester</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Code</TableHead>
                                <TableHead>Course Description</TableHead>
                                <TableHead>Lec</TableHead>
                                <TableHead>Lab</TableHead>
                                <TableHead>Units</TableHead>
                                <TableHead>Pre-requisite/s</TableHead>
                                <TableHead>Complab</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {first_sem.length > 0 ? (
                                first_sem.map((curriculum) => (
                                    <TableRow key={curriculum.id}>
                                        <TableCell className="w-[150px]">
                                            {curriculum.course_code}
                                        </TableCell>
                                        <TableCell className="w-[500px]">
                                            {curriculum.course_name}
                                        </TableCell>
                                        <TableCell className="w-[80px]">
                                            {curriculum.lec}
                                        </TableCell>
                                        <TableCell className="w-[80px]">
                                            {curriculum.lab}
                                        </TableCell>
                                        <TableCell className="w-[80px]">
                                            {curriculum.units}
                                        </TableCell>
                                        <TableCell className="w-[150px]">
                                            {curriculum.pre_reqs}
                                        </TableCell>
                                        <TableCell className="flex justify-center">
                                            {curriculum.is_complab ? (
                                                <>
                                                    <MonitorCheck />
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-red-600"
                                    >
                                        No curriculum found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-inherit">
                            <TableRow>
                                <TableCell className="text-right" colSpan={2}>
                                    Total:
                                </TableCell>
                                <TableCell>{first_totals.lec}</TableCell>
                                <TableCell>{first_totals.lab}</TableCell>
                                <TableCell>{first_totals.units}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                    {/* Second Semester Table */}
                    <div className="sm:flex-auto">
                        <p className="mt-2 font-medium text-sm ">
                            2nd Semester
                        </p>
                    </div>
                    <Table>
                        <TableCaption>2nd Semester</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Code</TableHead>
                                <TableHead>Course Description</TableHead>
                                <TableHead>Lec</TableHead>
                                <TableHead>Lab</TableHead>
                                <TableHead>Units</TableHead>
                                <TableHead>Pre-requisite/s</TableHead>
                                <TableHead>Complab</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {second_sem.length > 0 ? (
                                second_sem.map((curriculum) => (
                                    <TableRow key={curriculum.id}>
                                        <TableCell className="w-[150px]">
                                            {curriculum.course_code}
                                        </TableCell>
                                        <TableCell className="w-[500px]">
                                            {curriculum.course_name}
                                        </TableCell>
                                        <TableCell className="w-[80px]">
                                            {curriculum.lec}
                                        </TableCell>
                                        <TableCell className="w-[80px]">
                                            {curriculum.lab}
                                        </TableCell>
                                        <TableCell className="w-[80px]">
                                            {curriculum.units}
                                        </TableCell>
                                        <TableCell className="w-[150px]">
                                            {curriculum.pre_reqs}
                                        </TableCell>
                                        <TableCell className="flex justify-center">
                                            {curriculum.is_complab ? (
                                                <>
                                                    <MonitorCheck />
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-red-600"
                                    >
                                        No curriculum found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-inherit">
                            <TableRow>
                                <TableCell className="text-right" colSpan={2}>
                                    Total:
                                </TableCell>
                                <TableCell>{second_totals.lec}</TableCell>
                                <TableCell>{second_totals.lab}</TableCell>
                                <TableCell>{second_totals.units}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
