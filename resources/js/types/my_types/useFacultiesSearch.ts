import { useEffect, useMemo, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Links {
    url: string | null;
    label: string;
}

interface PageProps extends InertiaPageProps {
    search?: string;
    department_id?: string;
}

export const useFacultiesSearch = (baseLink: string) => {
    const { props: pageProps } = usePage<PageProps>();

    const [searchTerm, setSearchTerm] = useState<string>(
        pageProps.search || ""
    );
    const [inputValue, setInputValue] = useState<string>(
        pageProps.search || ""
    );
    const [pageNumber, setPageNumber] = useState<string>("1"); // Default to first page
    const [departmentId, setDepartmentId] = useState<string>(
        pageProps.department_id || ""
    );
    const isInitialRender = useRef<boolean>(true);

    const updatedPageNumber = (link: Links) => {
        if (link.url) {
            const page = new URL(link.url).searchParams.get("page");
            setPageNumber(page || "1");
        }
    };

    let facultiesUrl = useMemo(() => {
        const url = new URL(route(baseLink));
        url.searchParams.set("page", pageNumber);

        if (departmentId) {
            url.searchParams.set("department_id", departmentId);
        }

        if (searchTerm) {
            url.searchParams.set("search", searchTerm);
        }

        return url.toString();
    }, [searchTerm, pageNumber, departmentId]);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        router.visit(facultiesUrl, {
            preserveScroll: true,
            preserveState: true,
        });
    }, [facultiesUrl]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(inputValue);
            setPageNumber("1"); // Reset to first page on new search
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue]);

    return {
        searchTerm,
        setSearchTerm,
        inputValue,
        setInputValue,
        pageNumber,
        setPageNumber,
        departmentId,
        setDepartmentId,
        updatedPageNumber,
    };
};