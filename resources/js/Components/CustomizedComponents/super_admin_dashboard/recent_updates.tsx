import { Bell } from "lucide-react";

const notifications = [
    {
        id: 1,
        name: "Prof. Arlan Broken Quimoyog",
        action: "added a new course",
        item: "CHE 101 - General Chemistry",
        time: "2 Minutes Ago",
        avatar: "https://i.pravatar.cc/40?img=8",
    },
    {
        id: 2,
        name: "Admin",
        action: "updated the faculty list",
        item: "New faculty members added",
        time: "10 Minutes Ago",
        avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
        id: 3,
        name: "Dean Office",
        action: "scheduled a faculty meeting",
        item: "March 10, 2025 at 2 PM",
        time: "1 Hour Ago",
        avatar: "https://i.pravatar.cc/40?img=12",
    },
];

interface RecentUpdatesPanelProps {
    userTheme: "dark" | "light" | "system";
}

export default function RecentUpdatesPanel({
    userTheme,
}: RecentUpdatesPanelProps) {
    const themeClass = userTheme === "dark" ? "bg-slate-800" : "bg-gray-100";

    return (
        <div className="h-[500px]">
            <h2 className="text-lg font-semibold mb-4">📢 Recent Updates</h2>
            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`flex items-center space-x-4 p-3 rounded-lg ${themeClass}`}
                    >
                        <img
                            src={notif.avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p>
                                <span className="font-bold">{notif.name}</span>
                                <span> {notif.action} </span>
                                <span className="text-blue-500">
                                    {notif.item}
                                </span>
                                .
                            </p>
                            <span className="text-xs text-gray-500">
                                {notif.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}