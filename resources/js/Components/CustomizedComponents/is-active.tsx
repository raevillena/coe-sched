import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { ToastConfirmationWarning } from "@/Components/CustomizedComponents/toast-update-warning";
import { Rectangle } from "@/types/my_types";

//Department
interface ToggleSwitchPropsDept {
    selectedDepartment: {
        id: number;
        name: string;
        program_code: string;
        logo: File | null;
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}

export function ToggleActiveDept({
    selectedDepartment,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsDept) {
    const [isActive, setIsActive] = useState(
        selectedDepartment?.is_active ?? 0
    );

    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updateDepartmentActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedDepartment) {
            setIsActive(selectedDepartment.is_active);
        }
    }, [selectedDepartment]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updateDepartmentActiveStatus = (newState: number) => {
        if (!selectedDepartment) return;

        console.log('Updating Department:', selectedDepartment.id);
        
        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this department?",
            routeName: "departments.active_status",
            params: { departments: selectedDepartment.id },
            successMessage: "Department status updated successfully.",
            errorMessage: "Failed to update the department status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

//Position
interface ToggleSwitchPropsPos {
    selectedPosition: {
        id: number;
        name: string;
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}
export function ToggleActivePos({
    selectedPosition,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsPos) {
    const [isActive, setIsActive] = useState(selectedPosition?.is_active ?? 0);

    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updatePositionActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedPosition) {
            setIsActive(selectedPosition.is_active);
        }
    }, [selectedPosition]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updatePositionActiveStatus = (newState: number) => {
        if (!selectedPosition) return;

        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this position?",
            routeName: "positions.active_status",
            params: { positions: selectedPosition.id },
            successMessage: "Position status updated successfully.",
            errorMessage: "Failed to update the position status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}


//Period
interface ToggleSwitchPropsPeriod {
    selectedPeriod: {
        id: number;
        period_name: string;
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}
export function ToggleActivePeriod({
    selectedPeriod,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsPeriod) {
    const [isActive, setIsActive] = useState(selectedPeriod?.is_active ?? 0);

    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updatePeriodActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedPeriod) {
            setIsActive(selectedPeriod.is_active);
        }
    }, [selectedPeriod]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updatePeriodActiveStatus = (newState: number) => {
        if (!selectedPeriod) return;

        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this period?",
            routeName: "periods.active_status",
            params: { periods: selectedPeriod.id },
            successMessage: "Period status updated successfully.",
            errorMessage: "Failed to update the period status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

//Level
interface ToggleSwitchPropsLevel {
    selectedLevel: {
        id: number;
        level_name: string;
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}
export function ToggleActiveLevel({
    selectedLevel,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsLevel) {
    const [isActive, setIsActive] = useState(selectedLevel?.is_active ?? 0);

    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updateLevelActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedLevel) {
            setIsActive(selectedLevel.is_active);
        }
    }, [selectedLevel]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updateLevelActiveStatus = (newState: number) => {
        if (!selectedLevel) return;

        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this year level?",
            routeName: "levels.active_status",
            params: { levels: selectedLevel.id },
            successMessage: "Year Level status updated successfully.",
            errorMessage: "Failed to update the year level status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

//floor
interface ToggleSwitchPropsFloor {
    selectedFloor: {
        id: number;
        floor_name: string;
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}
export function ToggleActiveFloor({
    selectedFloor,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsFloor) {
    const [isActive, setIsActive] = useState(selectedFloor?.is_active ?? 0);

    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updateFloorActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedFloor) {
            setIsActive(selectedFloor.is_active);
        }
    }, [selectedFloor]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updateFloorActiveStatus = (newState: number) => {
        if (!selectedFloor) return;

        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this floor?",
            routeName: "floors.active_status",
            params: { floors: selectedFloor.id },
            successMessage: "Floor status updated successfully.",
            errorMessage: "Failed to update floor status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

//building
interface ToggleSwitchPropsBuilding {
    selectedBuilding: {
        id: number;
        building_name: string;
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}
export function ToggleActiveBuilding({
    selectedBuilding,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsBuilding) {
    const [isActive, setIsActive] = useState(selectedBuilding?.is_active ?? 0);

    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updateBuildingActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedBuilding) {
            setIsActive(selectedBuilding.is_active);
        }
    }, [selectedBuilding]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updateBuildingActiveStatus = (newState: number) => {
        if (!selectedBuilding) return;

        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this building?",
            routeName: "buildings.active_status",
            params: { buildings: selectedBuilding.id },
            successMessage: "Building status updated successfully.",
            errorMessage: "Failed to update building status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

//floor plan
interface ToggleSwitchPropsFloorPlan {
    selectedFloorPlan: {
        id: number;
        building: string;                   
        floor: string;
        floor_plan_map: File | null;
        rectangles: Rectangle[];
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}
export function ToggleActiveFloorPlan({
    selectedFloorPlan,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsFloorPlan) {
    const [isActive, setIsActive] = useState(selectedFloorPlan?.is_active ?? 0);
    
    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updateFloorPlanActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedFloorPlan) {
            setIsActive(selectedFloorPlan.is_active);
        }
    }, [selectedFloorPlan]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updateFloorPlanActiveStatus = (newState: number) => {
        if (!selectedFloorPlan) return;
        
        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this floor plan?",
            routeName: "floorplans.active_status",
            params: { 
                floorplans: selectedFloorPlan.id,
                building: selectedFloorPlan.building,
                floor: selectedFloorPlan.floor,
                is_active: newState
            },
            successMessage: "Floor Plan status updated successfully.",
            errorMessage: "Failed to update floor plan status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3" id="active-button">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

//Academic Year
interface ToggleSwitchPropsAY {
    selectedAY: {
        id: number;
        academic_year: string;
        is_active: number;
    } | null;
    userTheme: "dark" | "light" | "system";
    systemTheme: boolean;
    onToggle: (newState: number) => void;
}
export function ToggleActiveAY({
    selectedAY,
    userTheme,
    systemTheme,
}: ToggleSwitchPropsAY) {
    const [isActive, setIsActive] = useState(selectedAY?.is_active ?? 0);

    const handleToggle = () => {
        const newState = isActive === 1 ? 0 : 1;
        updateAYActiveStatus(newState);
    };

    useEffect(() => {
        if (selectedAY) {
            setIsActive(selectedAY.is_active);
        }
    }, [selectedAY]);

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        router.reload();
    }, [reloadKey]);

    const updateAYActiveStatus = (newState: number) => {
        if (!selectedAY) return;

        ToastConfirmationWarning({
            userTheme: userTheme,
            systemTheme: systemTheme,
            question:
                "Are you sure you want to update the status of this academic year?",
            routeName: "academic_year.active_status",
            params: { academic_years: selectedAY.id },
            successMessage: "Academic year status updated successfully.",
            errorMessage: "Failed to update the academic year status.",
            newState: newState,
            onConfirmSuccess: () => {
                setReloadKey((prevKey) => prevKey + 1);
            },
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    isActive ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={handleToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            <span
                className={`text-sm font-medium ${
                    isActive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        </div>
    );
}
