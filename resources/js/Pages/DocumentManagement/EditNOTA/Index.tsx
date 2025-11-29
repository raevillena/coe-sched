import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { EditNOTAPageProps } from "@/types/my_types";
import { Head, Link } from "@inertiajs/react";
import useTour from "@/Composables/useTour";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    toast_error,
    toast_info,
    toast_success,
} from "@/types/my_types/mytoast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const SEMESTER_REGEX = /(1st|2nd|3rd|[4-9]th)\s*Semester/i;

export default function Index({ auth, breadcrumbs }: EditNOTAPageProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const isDarkMode = userTheme === "dark" || (userTheme === "system" && systemTheme);

    useTour({
        user: auth.user,
        name: "showNOTASettingsTour",
        steps: () => [
            {
                title: "Welcome to the NOTA Settings Page",
                intro: `Hi <b>${auth?.user?.name}</b>!<br><br>
                    This section allows you to customize the content of the <b>Notice of Teaching Assignment (NOTA)</b> 
                    that faculty members can download from the Faculty Schedule page.<br><br>
                    `,
                tooltipClass: "six-fifty-tool-tip",
            },
            {
                intro: `🖊️ <b>Edit Button</b><br>
                    To begin, click the <b>Edit</b> button to start modifying the template.`,
                element: document.querySelector("#edit-button") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `🖊️ <b>Edit Intro Content</b><br>
                    Here, you can input or update the introduction section of the NOTA document.`,
                element: document.querySelector("#nota-intro") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `📄 <b>Edit Body Content</b><br>
           This is the main message of the NOTA. It includes reminders for class start, instructional prep, student lists, and other teaching-related tasks.<br><br>
           You can edit this to match your school's guidelines.`,
                element: document.querySelector("#nota-body") as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 You're All Set!",
                intro: `That's it for the tour! Once you're done customizing the NOTA content, don't forget to click <b>Save Changes</b> to apply your updates.<br><br>
                    <b>RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });

    const [body, setBody] = useState("");
    const [intro, setIntro] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [editing, setEditing] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        try {
            await axios.post(route("edit_nota.store"), { body, intro });
            setSuccess(true);
            toast_success({
                message: "Content saved successfully.",
                userTheme: userTheme,
            });
        } catch (error) {
            toast_error({
                message: "An error occurred while saving the content.",
                userTheme: userTheme,
            });
        }
        setSaving(false);
        setEditing(false);
    };

    useEffect(() => {
        axios
            .get(route("edit_nota.show"))
            .then((res) => {
                if (res.data && res.data.data) {
                    setBody(res.data.data.body || "");
                    setIntro(res.data.data.intro || "");
                }
            })
            .catch(() => {
                toast_error({
                    message: "Unable to load existing NOTA content.",
                    userTheme: userTheme,
                });
            });
    }, []);

    const handleIntroChange = (e: any) => {
        const value = e.target.value;
        if (SEMESTER_REGEX.test(value)) {
            toast_info({
                message:
                    "Please omit the semester (e.g., '2nd Semester, AY 2024–2025'); it will be appended automatically.",
                userTheme: userTheme,
            });
            const cleaned = value
                .replace(SEMESTER_REGEX, "")
                .replace(/,\s*AY\s*\d{4}-\d{4}/i, "");
            setIntro(cleaned.trim());
        } else {
            setIntro(value);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="font-semibold text-2xl text-center flex items-center justify-center">
                    Notice of Teaching Assignment Content
                </h2>
            }
        >
            <Head title="NOTA Content Settings" />
            <div className="max-w-4xl mx-auto px-4 py-6">
                <Card className={cn(
                    "shadow-lg transition-all duration-200",
                    editing ? "ring-2 ring-primary/20" : ""
                )}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-semibold">NOTA Preview</CardTitle>
                                <CardDescription>
                                    This is a preview of how the NOTA will appear when downloaded
                                </CardDescription>
                            </div>
                            <div className="space-x-2">
                                {!editing ? (
                                    <Button
                                        id="edit-button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={() => setEditing(true)}
                                    >
                                        <span className="hidden sm:inline">Edit Content</span>
                                        <span className="sm:hidden">Edit</span>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditing(false)}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="relative"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="opacity-0">Save Changes</span>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                                                    </div>
                                                </>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <div className="border rounded-lg p-6 bg-card/50">
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-4">May 19, 2025</p>
                                <div className="space-y-1 font-semibold">
                                    <div>FACULTY NAME</div>
                                    <div>Department of Computer Engineering</div>
                                    <div>College of Engineering</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="notice-intro" className="text-base font-medium mb-2 block">
                                        Introduction
                                    </Label>
                                    {!editing ? (
                                        <div
                                            id="nota-intro"
                                            className={cn(
                                                "min-h-[80px] rounded-lg p-4 text-base bg-background border",
                                                !intro && "text-muted-foreground italic"
                                            )}
                                        >
                                            {intro || "No introduction content yet."}
                                        </div>
                                    ) : (
                                        <Textarea
                                            id="notice-intro"
                                            placeholder="Per endorsement of the concerned department, you are hereby assigned to teach the following subjects during the"
                                            value={intro}
                                            onChange={handleIntroChange}
                                            className="min-h-[80px] text-base resize-y"
                                        />
                                    )}
                                    <p className="text-sm text-muted-foreground mt-2">
                                        The semester (e.g., "2nd Semester, AY 2024-2025") will be automatically added
                                    </p>
                                </div>

                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="border px-3 py-2 font-medium">Code</th>
                                                <th className="border px-3 py-2 font-medium">Subject Title</th>
                                                <th className="border px-3 py-2 font-medium">Section</th>
                                                <th className="border px-3 py-2 font-medium"># of Units</th>
                                                <th className="border px-3 py-2 font-medium">Actual Load</th>
                                                <th className="border px-3 py-2 font-medium">Schedule</th>
                                                <th className="border px-3 py-2 font-medium">Day</th>
                                                <th className="border px-3 py-2 font-medium">Room</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border px-3 py-2">CPE 112</td>
                                                <td className="border px-3 py-2">Object Oriented Programming for CpE</td>
                                                <td className="border px-3 py-2">BSCPE 1-A</td>
                                                <td className="border px-3 py-2 text-center">2</td>
                                                <td className="border px-3 py-2 text-center">6</td>
                                                <td className="border px-3 py-2">11 - 2</td>
                                                <td className="border px-3 py-2">MF</td>
                                                <td className="border px-3 py-2">COE 115</td>
                                            </tr>
                                            <tr className="font-medium bg-muted/30">
                                                <td colSpan={3} className="border px-3 py-2 text-right">Total</td>
                                                <td className="border px-3 py-2 text-center">8</td>
                                                <td className="border px-3 py-2 text-center">12</td>
                                                <td colSpan={3} className="border px-3 py-2"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div>
                                    <Label htmlFor="notice-body" className="text-base font-medium mb-2 block">
                                        Body Content
                                    </Label>
                                    {!editing ? (
                                        <div
                                            id="nota-body"
                                            className={cn(
                                                "min-h-[200px] rounded-lg p-4 text-base bg-background border",
                                                !body && "text-muted-foreground italic"
                                            )}
                                        >
                                            {body || "No body content yet."}
                                        </div>
                                    ) : (
                                        <Textarea
                                            id="notice-body"
                                            placeholder="Classes start on August 19, 2024; hence, please be in the rooms assigned to your subjects to receive..."
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            className="min-h-[200px] text-base resize-y"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <p className="text-right text-sm mb-2">Very truly yours,</p>
                            <p className="text-right font-medium">DEAN NAME</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
