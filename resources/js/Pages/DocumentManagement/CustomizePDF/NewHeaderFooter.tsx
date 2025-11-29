import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { HeaderFooterProps } from "@/types/my_types";
import { toast_error, toast_success } from "@/types/my_types/mytoast";
import { Head, Link } from "@inertiajs/react";
import { Upload } from "lucide-react";
import { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import sample_footer from "/Images/pdf/footer.png";
import sample_header from "/Images/pdf/header.png";
import axios from "axios";
import { Input } from "@/Components/ui/input";

declare function route(name: string): string;

export default function NewHeaderFooter({ userTheme }: HeaderFooterProps) {
    const [headerFile, setHeaderFile] = useState<File | null>(null);
    const [headerPreview, setHeaderPreview] = useState<string | null>(null);
    const [footerFile, setFooterFile] = useState<File | null>(null);
    const [footerPreview, setFooterPreview] = useState<string | null>(null);
    const [yearImplemented, setYearImplemented] = useState<number | null>(null);
    const [name, setName] = useState<string>("");
    const [dragActive, setDragActive] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        type: "header" | "footer"
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            if (type === "header") {
                setHeaderFile(file);
                setHeaderPreview(URL.createObjectURL(file));
            } else {
                setFooterFile(file);
                setFooterPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "header" | "footer"
    ) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === "header") {
                    setHeaderPreview(reader.result as string);
                } else {
                    setFooterPreview(reader.result as string);
                }
            };
            reader.readAsDataURL(selectedFile);
            if (type === "header") {
                setHeaderFile(selectedFile);
            } else {
                setFooterFile(selectedFile);
            }
        } else {
            toast_error({
                message:
                    "File is too large. Please choose a file smaller than 10MB.",
                userTheme: userTheme,
            });
        }
        e.target.value = "";
    };

    const removeFile = (type: "header" | "footer") => {
        if (type === "header") {
            setHeaderFile(null);
            setHeaderPreview(null);
        } else {
            setFooterFile(null);
            setFooterPreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!yearImplemented) {
            toast_error({
                message: "Please enter the year implemented.",
                userTheme: userTheme,
            });
            return;
        }

        // if (!name) {
        //     toast_error({
        //         message: "Please enter the name.",
        //         userTheme: userTheme,
        //     });
        //     return;
        // }

        setFormSubmitted(true);

        const formData = new FormData();
        formData.append("year_implemented", yearImplemented.toString());
        // formData.append("name", name);

        if (headerFile) formData.append("curriculum_header", headerFile);
        if (footerFile) formData.append("curriculum_footer", footerFile);

        try {
            const response = await axios.post(
                route("customize_pdf.store_curriculum"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast_success({
                    message: "PDF Customization saved successfully.",
                    userTheme: userTheme,
                });
                setHeaderFile(null);
                setHeaderPreview(null);
                setFooterFile(null);
                setFooterPreview(null);
                setYearImplemented(null);
                // setName("");
            } else {
                toast_error({
                    message: "Failed to save PDF Customization.",
                    userTheme: userTheme,
                });
            }
        } catch (error) {
            toast_error({
                message: "An error occurred while saving PDF Customization.",
                userTheme: userTheme,
            });
        } finally {
            setFormSubmitted(false);
        }
    };

    return (
        <div>
            <Head title="Customize PDF Header & Footer" />

            <p className="mt-5 font-normal text-large">
                <b>Note:</b> This is only a sample preview of the downloadable
                PDF or Word document.
            </p>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 mx-auto max-w-[1800px]">
                <div
                    className="h-[1123px] max-w-[794px] w-full bg-muted/50 mt-5 p-4 border border-cyan-500 mx-auto"
                    id="new-pdf-preview"
                >
                    <div className="bg-white h-[1123px] w-full mx-auto flex flex-col justify-between items-center shadow-lg shadow-slate-500">
                        {headerPreview ? (
                            <img
                                src={headerPreview}
                                alt="Header Preview"
                                className="w-full max-w-[770px] h-auto"
                            />
                        ) : (
                            <div className="py-4 font-serif text-3xl text-center text-black">
                                Header
                            </div>
                        )}

                        {headerPreview && (
                            <div className="self-start w-full px-4 py-4 space-y-4 text-black md:px-8 lg:px-16">
                                <p className="font-semibold">
                                    4th Year - 1st Semester
                                </p>
                                <div className="grid grid-cols-2 gap-4 md:gap-8">
                                    <div>
                                        <p className="mb-2 font-medium">
                                            Course Code - Course Name
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        <p>Lec</p>
                                        <p>Lab</p>
                                        <p>Units</p>
                                        <p>Pre-req</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:gap-8">
                                    <div>
                                        <p>CPE 164 - Embedded Systems</p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        <p>3</p>
                                        <p>1</p>
                                        <p>4</p>
                                        <p>CPE 163</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex-grow"></div>
                        {footerPreview ? (
                            <img
                                src={footerPreview}
                                alt="Footer Preview"
                                className="w-full max-w-[770px] h-auto"
                            />
                        ) : (
                            <div className="py-4 font-serif text-3xl text-center text-black">
                                Footer
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5 w-3/2">
                    <div className="grid w-2/3 grid-cols-1 mb-4 lg:grid-cols-2">
                        <div>
                            <label
                                className="block text-sm font-medium"
                                htmlFor="year-implemented"
                            >
                                Year Implemented
                            </label>
                            <Input
                                id="year-implemented"
                                type="number"
                                className="block mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm"
                                placeholder="2025"
                                value={yearImplemented || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,4}$/.test(value)) {
                                        setYearImplemented(Number(value));
                                    }
                                }}
                            />
                        </div>

                        {/* <div className="w-full ml-6">
                            <label className="block text-sm font-medium">
                                Description
                            </label>
                            <Input
                                type="text"
                                className="block mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div> */}
                    </div>

                    <h2 className="flex justify-center p-2 mb-2 font-semibold rounded-lg text-md bg-muted/50">
                        Upload Header
                    </h2>
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={(e) => handleDrop(e, "header")}
                        className={`border-2 border-dashed p-4 rounded-xl ${
                            dragActive ? "border-blue-400" : "border-gray-300"
                        } flex flex-col items-center justify-center`}
                        id="header-upload-area"
                    >
                        <input
                            type="file"
                            id="header-upload"
                            style={{ display: "none" }}
                            onChange={(e) => handleChange(e, "header")}
                            disabled={formSubmitted && !editMode}
                        />
                        {headerFile ? (
                            <div className="flex flex-col items-center">
                                <p
                                    className="truncate"
                                    style={{ maxWidth: "150px" }}
                                >
                                    {headerFile.name}
                                </p>
                                {headerPreview && (
                                    <img
                                        src={headerPreview}
                                        alt="Preview"
                                        className="mt-4 max-h-128 max-w-128"
                                    />
                                )}
                                <Button
                                    onClick={() => removeFile("header")}
                                    className={`mt-2 ${
                                        formSubmitted && !editMode
                                            ? "hidden"
                                            : ""
                                    }`}
                                    variant="destructive"
                                    disabled={formSubmitted && !editMode}
                                >
                                    Remove Image
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-blue-500 bg-opacity-50 rounded-full">
                                    <Upload size={28} strokeWidth={2.5} />
                                </div>
                                <span className="mt-2">
                                    Drag & Drop to Upload Header
                                </span>
                                <span className="mt-2">OR</span>
                                <Button
                                    id="browse-header-image"
                                    className="mt-2"
                                    variant="outline"
                                    onClick={() =>
                                        document
                                            .getElementById("header-upload")
                                            ?.click()
                                    }
                                    disabled={formSubmitted && !editMode}
                                >
                                    Browse Image
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="flex justify-center mt-1 text-xs font-thin">
                        Recommended Dimensions: 1056 x 184
                    </p>

                    <h2 className="flex justify-center p-2 mt-10 mb-2 font-semibold rounded-lg text-md bg-muted/50">
                        Upload Footer
                    </h2>
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={(e) => handleDrop(e, "footer")}
                        className={`border-2 border-dashed p-4 rounded-xl ${
                            dragActive ? "border-blue-400" : "border-gray-300"
                        } flex flex-col items-center justify-center`}
                        id="footer-upload-area"
                    >
                        <input
                            type="file"
                            id="footer-upload"
                            style={{ display: "none" }}
                            onChange={(e) => handleChange(e, "footer")}
                            disabled={formSubmitted && !editMode}
                        />
                        {footerFile ? (
                            <div className="flex flex-col items-center">
                                <p
                                    className="truncate"
                                    style={{ maxWidth: "150px" }}
                                >
                                    {footerFile.name}
                                </p>
                                {footerPreview && (
                                    <img
                                        src={footerPreview}
                                        alt="Preview"
                                        className="mt-4 max-h-128 max-w-128"
                                    />
                                )}
                                <Button
                                    onClick={() => removeFile("footer")}
                                    className={`mt-2 ${
                                        formSubmitted && !editMode
                                            ? "hidden"
                                            : ""
                                    }`}
                                    variant="destructive"
                                    disabled={formSubmitted && !editMode}
                                >
                                    Remove Image
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-blue-500 bg-opacity-50 rounded-full">
                                    <Upload size={28} strokeWidth={2.5} />
                                </div>
                                <span className="mt-2">
                                    Drag & Drop to Upload Footer
                                </span>
                                <span className="mt-2">OR</span>
                                <Button
                                    id="browse-footer-image"
                                    className="mt-2"
                                    variant="outline"
                                    onClick={() =>
                                        document
                                            .getElementById("footer-upload")
                                            ?.click()
                                    }
                                    disabled={formSubmitted && !editMode}
                                >
                                    Browse Image
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="flex justify-center mt-1 text-xs font-thin">
                        Recommended Dimensions: 1056 x 184
                    </p>

                    <div className="flex justify-end mt-2">
                        <Button
                            onClick={handleSubmit}
                            className="mt-2"
                            disabled={
                                (formSubmitted && !editMode) ||
                                !yearImplemented ||
                                (!headerFile && !footerFile)
                            }
                        >
                            Submit
                        </Button>
                    </div>

                    <div className="mt-5">
                        <p>Sample Header:</p>
                        <img
                            className="w-[800px]"
                            src={sample_header}
                            alt="sample_header"
                            id="sample_header_image"
                        />
                    </div>

                    <div className="mt-5">
                        <p>Sample Footer:</p>
                        <img
                            className="w-[800px]"
                            src={sample_footer}
                            alt="sample_footer"
                            id="sample_footer_image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
