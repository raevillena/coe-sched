import { Button } from "@/Components/ui/button";
import { toast_success } from "@/types/my_types/mytoast";
import axios from "axios";
import { useEffect, useState } from "react";
import { HeaderFooterProps } from "@/types/my_types";

export default function SelectHeaderFooter({ userTheme }: HeaderFooterProps) {
    const [headerImages, setHeaderImages] = useState<
        { id: number; image: string }[]
    >([]);
    const [footerImages, setFooterImages] = useState<
        { id: number; image: string }[]
    >([]);
    const [headerPreview, setHeaderPreview] = useState<string | null>(null);
    const [footerPreview, setFooterPreview] = useState<string | null>(null);
    const [selectedHeader, setSelectedHeader] = useState<{
        id: number;
        image: string;
    } | null>(null);
    const [selectedFooter, setSelectedFooter] = useState<{
        id: number;
        image: string;
    } | null>(null);
    const [activeHeader, setActiveHeader] = useState<{
        id: number;
        image: string;
    } | null>(null);
    const [activeFooter, setActiveFooter] = useState<{
        id: number;
        image: string;
    } | null>(null);

    const baseUrl = import.meta.env.VITE_APP_URL;

    useEffect(() => {
        //get header images
        axios
            .get(route("get_curriculum_header_images"))
            .then((response) => {
                setHeaderImages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching header images:", error);
            });

        //get footer images
        axios
            .get(route("get_curriculum_footer_images"))
            .then((response) => {
                setFooterImages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching footer images:", error);
            });

        //get the currently active header image
        axios
            .get(
                route("get_active_header_footer", { type: "curriculum_header" })
            )
            .then((response) => {
                if (response.data && response.data.image) {
                    setHeaderPreview(
                        `${baseUrl}/storage/${response.data.image}`
                    );
                    setSelectedHeader(response.data);
                    setActiveHeader(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching active header image:", error);
            });

        //get the currently active footer image
        axios
            .get(
                route("get_active_header_footer", { type: "curriculum_footer" })
            )
            .then((response) => {
                if (response.data && response.data.image) {
                    setFooterPreview(
                        `${baseUrl}/storage/${response.data.image}`
                    );
                    setSelectedFooter(response.data);
                    setActiveFooter(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching active footer image:", error);
            });
    }, []);

    const handleSave = () => {
        let headerUpdated = false;
        let footerUpdated = false;

        const updateImageStatus = async (
            image: { id: number; image: string } | null,
            type: string
        ) => {
            if (image) {
                try {
                    const response = await axios.post(
                        route("update_header_footer_status"),
                        {
                            image: image.image,
                            type,
                        }
                    );

                    if (response.status === 200) {
                        if (type === "curriculum_header") {
                            headerUpdated = true;
                        } else if (type === "curriculum_footer") {
                            footerUpdated = true;
                        }
                    }
                } catch (error) {
                    console.error(`Error updating ${type} status:`, error);
                }
            }
        };

        const showToastMessage = () => {
            if (headerUpdated && footerUpdated) {
                toast_success({
                    message: `Selected Header & Footer applied successfully.`,
                    userTheme: userTheme,
                });
            } else if (headerUpdated) {
                toast_success({
                    message: `Selected Header applied successfully.`,
                    userTheme: userTheme,
                });
            } else if (footerUpdated) {
                toast_success({
                    message: `Selected Footer applied successfully.`,
                    userTheme: userTheme,
                });
            }
        };

        const promises = [];

        if (selectedHeader?.id !== activeHeader?.id) {
            promises.push(
                updateImageStatus(selectedHeader, "curriculum_header")
            );
        }

        if (selectedFooter?.id !== activeFooter?.id) {
            promises.push(
                updateImageStatus(selectedFooter, "curriculum_footer")
            );
        }

        Promise.all(promises).then(showToastMessage);
    };

    return (
        <div>
            <p className="mt-5 font-normal text-large">
                <b>Note:</b> This is only a sample preview of the downloadable
                PDF or Word document.
            </p>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 mx-auto max-w-[1800px]">
                <div
                    className="h-[1123px] max-w-[794px] w-full bg-muted/50 mt-5 p-4 border border-cyan-500 mx-auto"
                    id="select-pdf-preview"
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

                <div className="w-full mt-5">
                    <div className="max-w-[800px] mx-auto">
                        <div className="border border-cyan-500 min-h-[610px] w-full">
                            <div className="grid grid-rows-1 lg:grid-rows-2">
                                {/* Header */}
                                <div>
                                    <p className="p-3">Select Header</p>
                                    <div className="overflow-auto max-h-[250px] space-y-4">
                                        {headerImages.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`${baseUrl}/storage/${image.image}`}
                                                className="w-full px-3 cursor-pointer hover:opacity-80"
                                                onClick={() => {
                                                    setHeaderPreview(
                                                        `${baseUrl}/storage/${image.image}`
                                                    );
                                                    setSelectedHeader(image);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div>
                                    <p className="p-3">Select Footer</p>
                                    <div className="overflow-auto max-h-[250px] space-y-4">
                                        {footerImages.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`${baseUrl}/storage/${image.image}`}
                                                className="w-full px-3 cursor-pointer hover:opacity-80"
                                                onClick={() => {
                                                    setFooterPreview(
                                                        `${baseUrl}/storage/${image.image}`
                                                    );
                                                    setSelectedFooter(image);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
