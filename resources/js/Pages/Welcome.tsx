import { Button } from "@/Components/ui/button";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }: PageProps<{}>) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <nav className="flex flex-1 justify-center">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link
                                            href={route("dashboard")}
                                            className="ms-2"
                                        >
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild>
                                            <Link
                                                href={route("login")}
                                                className="ms-2"
                                            >
                                                Login
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link
                                                href={route("register")}
                                                className="ms-2"
                                            >
                                                Register
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </nav>
                        </header>
                    </div>
                </div>
            </div>
        </>
    );
}
