import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { IndexPDFPageProps } from "@/types/my_types";
import { Head, Link } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import NewHeaderFooter from "./NewHeaderFooter";
import SelectHeaderFooter from "./SelectHeaderFooter";
import useTour from "@/Composables/useTour";

export default function Index({ auth, breadcrumbs }: IndexPDFPageProps) {
    const userTheme = auth?.user.theme;
    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    useTour({
        user: auth.user,
        name: "showCustomizeHeaderFooterTour",
        steps: () => [
            {
                title: "Welcome to the Header & Footer Customization Page",
                intro: `Hi <b>${auth?.user?.name}</b>!<br><br>
                        This page allows you to create, edit, and customize headers and footers for your application.<br><br>
                        Let's take a quick tour to help you get started with tailoring your application's header and footer.<br><br>
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "six-fifty-tool-tip",
            },
            {
                intro: `🖱️ <b>Select a Header or Footer</b><br>  
                        Use this tab to choose an existing header or footer to customize. You can also create a new one from here.`,
                element: document.querySelector(
                    "#header-footer-tab"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                intro: `➕ <b>Add a New Header or Footer</b><br>
                        Click on the "Add New" button to create a fresh header or footer. You can fully customize it to meet your needs.`,
                element: document.querySelector(
                    "#new-header-footer"
                ) as HTMLElement,
                tooltipClass: "steps-tool-tip",
            },
            {
                title: "🎉 You're All Set!",
                intro: `That's it for the tour! You now know how to customize headers and footers for your application.<br><br>  
                        <b>Feel free to explore</b> and make the most of this feature. If you ever need assistance, we're here to help.<br><br>  
                        <b>RN DevWorks</b> 💻`,
                tooltipClass: "five-hundred-tool-tip",
            },
        ],
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <h2 className="flex items-center justify-center text-2xl font-semibold text-center">
                    Customize Headers & Footers for Your PDF and Word Documents
                </h2>
            }
        >
            <Head title="Customize PDF Header & Footer" />

            <Tabs defaultValue="select_header_footer" className="p-5 ">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#800000] to-[#4d0000]">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2 overflow-auto">
                        <TabsTrigger
                            id="header-footer-tab"
                            value="select_header_footer"
                        >
                            Select Header & Footer
                        </TabsTrigger>
                        <TabsTrigger
                            id="new-header-footer"
                            value="add_new_header_footer"
                        >
                            Add New Header & Footer
                        </TabsTrigger>
                    </TabsList>
                </div>
                <div>
                    <TabsContent value="select_header_footer">
                        <SelectHeaderFooter userTheme={userTheme} />
                    </TabsContent>

                    {/* Add New header and Footer */}
                    <TabsContent value="add_new_header_footer">
                        <NewHeaderFooter userTheme={userTheme} />
                    </TabsContent>
                </div>
                {/* Select Header and Footer */}
            </Tabs>
        </AuthenticatedLayout>
    );
}
