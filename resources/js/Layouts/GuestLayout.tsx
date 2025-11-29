import { ApplicationLogo } from "@/Components/ApplicationLogo";
import { Head, Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import backgroundImage from "/Images/bg3.png";
import schedule from "/Images/undraw/undraw_schedule.svg";
import "@/Fonts/europa.css";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-laravel-style">
            {/* Background SVG */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 1440 320"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="rgba(139, 0, 0, 0.2)"
                        d="M0,160 C320,300,420,240,640,160 C880,80,1040,140,1440,160 L1440,320 L0,320 Z"
                    ></path>
                </svg>
            </div>

            {/* Main content */}
            <Head title="Welcome" />
            <header className="z-10 mb-5 text-center">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-5xl font-bold tracking-wide text-white font-proxima-black text-primary drop-shadow-md">
                        Welcome to the College of Engineering Scheduler
                    </h1>
                    <p className="mt-4 text-xl text-white ">
                        Stay organized and plan your academic schedule with
                        ease.
                    </p>

                    <img
                        src={schedule}
                        alt="undraw_schedule"
                        className="absolute right-20 bottom-0 w-auto h-[300px] object-cover hidden lg:block"
                    />
                </div>
            </header>
            <div className="mt-[-10px] z-10">{/* <ApplicationLogo /> */}</div>
            <div className="z-10 flex flex-col items-center justify-center p-10">
                {children}
            </div>
        </div>
    );
}
