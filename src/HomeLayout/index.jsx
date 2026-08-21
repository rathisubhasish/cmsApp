import { Outlet } from "react-router-dom";
import Sidebar from "../common/SideBar/SideBar.jsx";
import { useState } from "react";

export default function HomeLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-svh bg-white overflow-x-hidden">
            <Sidebar
                setIsMobileOpen={setIsMobileOpen}
                isMobileOpen={isMobileOpen}
            />

            <main className="min-w-0 px-6 py-6 lg:ml-[240px]">
                <Outlet />
            </main>
        </div>
    );
}