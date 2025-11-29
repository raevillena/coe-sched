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

const Pagination: React.FC<PaginationProps> = ({ meta, updatedPageNumber }) => {
    // console.log(meta);

    return (
        <div className="max-w-7xl mx-auto py-6">
            <div className="max-w-none mx-auto">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden" />
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
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
                                <nav
                                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                    aria-label="Pagination"
                                >
                                    {meta.links.map((link) => {
                                        return (
                                            <button
                                                key={link.label + link.url}
                                                disabled={link.active || !link.url}
                                                onClick={() => updatedPageNumber(link)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active //if link is active
                                                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                } `}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{ __html: link.label }} 
                                                />
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pagination;