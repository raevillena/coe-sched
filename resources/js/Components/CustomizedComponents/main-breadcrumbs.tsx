import React from "react";
import { Link, router } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

interface BreadcrumbItemProps {
    title: string;
    link: string;
}

interface BreadcrumbsProps {
    breadcrumbs: BreadcrumbItemProps[];
}

export default function MyBreadCrumbs({ breadcrumbs }: BreadcrumbsProps) {

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            {breadcrumb.link ? (
                                <button
                                    onClick={() => router.visit(breadcrumb.link!)}
                                    className=" hover:text-blue-500 hover:underline"
                                >
                                    {breadcrumb.title}
                                </button>
                            ) : (
                                <span>{breadcrumb.title}</span>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}


