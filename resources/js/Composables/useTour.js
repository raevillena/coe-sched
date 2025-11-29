import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import introJS from "intro.js";

class ExtendedIntroJs {
    constructor(tour, name, user) {
        this.tour = tour;
        this.name = name;
        this.user = user;
    }

    async resetTour() {
        // remove tour from localStorage
        window.localStorage.removeItem(`tour-${this.name}`);

        // remove tour from database
        if (this.user) {
            await axios.put(route("tour.update"), {
                tour: this.name,
                remove: true,
            });
        }
    }

    start() {
        this.tour.start();
    }

    setOptions(options) {
        this.tour.setOptions(options);
    }

    onexit(callback) {
        this.tour.onexit(callback);
    }
}

export default function useTour({ name, user, steps }) {
    const [refreshKey, setRefreshKey] = useState(0); 
    const [hasStarted, setHasStarted] = useState(false); 
    const markedAsSeenInBrowser = window.localStorage.getItem(`tour-${name}`);
    const markedAsSeenInDatabase = user?.tour?.[name];
    const tourInstance = introJS();
    const tour = new ExtendedIntroJs(tourInstance, name, user);

    useEffect(() => {
        if (user && markedAsSeenInBrowser && !markedAsSeenInDatabase) {
            axios.put(route("tour.update"), { tour: name });
        }
    }, [user, markedAsSeenInBrowser, markedAsSeenInDatabase, name]);

    useEffect(() => {
        if (markedAsSeenInBrowser || markedAsSeenInDatabase || hasStarted) {
            return;
        }

        const stepIsDisplayable = (step) => {
            if (!step.hasOwnProperty("element")) {
                return true;
            }
            return step.element && !!step.element.getClientRects().length;
        };

        tour.setOptions({
            exitOnEsc: false,
            exitOnOverlayClick: false,
            overlayOpacity: 0.6,
            skipLabel: "Skip",
            nextLabel: "Forward",
            prevLabel: "Previous",
            doneLabel: "Finish",
            showBullets: false,
            showProgress: true,
            showStepNumbers: false,
            disableInteraction: true,
            steps: steps().filter((step) => stepIsDisplayable(step)),
        });

        if (tourInstance && typeof tourInstance.onexit === "function") {
            tour.onexit(() => {
                window.removeEventListener("resize", refreshToursteps);
                window.removeEventListener("keydown", handleKeydown);
                window.localStorage.setItem(`tour-${name}`, "true");

                if (user) {
                    axios.put(route("tour.update"), { tour: name });
                }

                setRefreshKey((prevKey) => prevKey + 1); 
                setHasStarted(false); 
            });
        } else {
            console.error(
                "tourInstance is not properly initialized or onexit is not a function",
                tourInstance
            );
        }

        const refreshToursteps = debounce(() => {
            tour.setOptions({
                steps: steps().filter((step) => stepIsDisplayable(step)),
            });
        }, 200);

        const handleKeydown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); 
            }
        };

        window.addEventListener("resize", refreshToursteps);
        window.addEventListener("keydown", handleKeydown);

        tour.start();
        setHasStarted(true);

        return () => {
            window.removeEventListener("resize", refreshToursteps);
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [
        name,
        user,
        steps,
        tourInstance,
        markedAsSeenInBrowser,
        markedAsSeenInDatabase,
        refreshKey,
        hasStarted,
    ]);

    return tour;
}