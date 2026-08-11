
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../common/SideBar/SideBar.jsx";
import { useState } from "react";
import { LuBox } from "react-icons/lu";
import { useAuth } from "../context/AuthContext.jsx";
import { AiOutlineMenu } from "react-icons/ai";

export default function HomeLayout() {
    return(
        <div className="flex min-h-svh bg-white overflow-x-hidden">
            <Sidebar setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />
        </div>
    )
}