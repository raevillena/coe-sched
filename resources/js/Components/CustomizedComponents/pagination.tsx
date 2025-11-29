import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { Link } from "@inertiajs/react";

interface Link {
    label: string;
    url: string | null;
    active: boolean;
}

interface Meta {
    from: number;
    to: number;
    total: number;
    links: Link[];
}

interface PaginationProps {
    meta: Meta;
    updatedPageNumber: (link: Link) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
    meta,
    updatedPageNumber,
}) => {
    return (
        <div className="max-w-8xl mx-auto py-6">
            <div className="max-w-none mx-auto">
                <div className="overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-400 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden" />
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm">
                                    Showing
                                    <span className="font-medium mx-1">
                                        {meta.from}
                                    </span>
                                    to
                                    <span className="font-medium mx-1">
                                        {meta.to}
                                    </span>
                                    of
                                    <span className="font-medium mx-1">
                                        {meta.total}
                                    </span>
                                    results
                                </p>
                            </div>
                            <div>
                                <Pagination>
                                    <PaginationContent>
                                        {meta.links.map((link) => {
                                            return (
                                                <PaginationItem
                                                    key={link.label + link.url}
                                                >
                                                    <Link
                                                        href={link.url || "#"}
                                                        method="get"
                                                        onClick={(e) => {
                                                            if (
                                                                !link.url ||
                                                                link.active
                                                            ) {
                                                                e.preventDefault(); 
                                                            } else {
                                                                updatedPageNumber(
                                                                    link
                                                                ); 
                                                            }
                                                        }}
                                                        className={`${
                                                            link.active
                                                                ? "z-10 text-white bg-indigo-600 border-indigo-500"
                                                                : "text-gray-500 hover:bg-gray-100"
                                                        } px-4 py-2 border text-sm font-medium cursor-pointer`}
                                                    >
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    </Link>
                                                </PaginationItem>
                                            );
                                        })}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PaginationComponent;