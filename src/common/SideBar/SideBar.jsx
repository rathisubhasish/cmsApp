import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuBuilding2,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
  LuBox,
  LuUpload,
  LuSignature,
} from "react-icons/lu";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../Button/Button.jsx";
import Tabs from "../Tabs/Tabs.jsx";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Home",
    icon: LuLayoutDashboard,
    end: true,
  },
  {
    to: "client",
    label: "Client",
    icon: LuBuilding2,
    end: false,
  },
  {
    to: "proposal",
    label: "Proposal",
    icon: LuBuilding2,
    end: false,
  },
  {
    to: "contract",
    label: "Contract",
    icon: LuBuilding2,
    end: false,
  },
  {
    to: "e-sign",
    label: "E-Sign",
    icon: LuSignature,
    end: false,
  },
  {
    to: "upload-document",
    label: "Upload Document",
    icon: LuUpload,
    end: false,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: LuSettings,
    end: false,
  },
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
    setIsMobileOpen(false);
  }

  function handleNavigation() {
    setIsMobileOpen(false);
  }

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}{" "}
      <aside
        className={` fixed left-0 top-0 z-50 flex h-screen min-w-[200px] max-w-[200px] flex-col border-r border-border bg-surface px-4 transition-transform duration-300 ease-in-out lg:sticky lg:z-30 lg:translate-x-0 lg:w-[240px] ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex items-center justify-between px-2 pt-5 pb-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <LuBox size={18} />{" "}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                Client
              </p>
              {email && (
                <p className="max-w-[170px] truncate text-xs text-text-secondary">
                  {email}
                </p>
              )}
            </div>
          </div>
          {/* Close button - Mobile only */}{" "}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-primary-light hover:text-primary-text lg:hidden"
          >
            {" "}
            <LuX size={20} />{" "}
          </button>{" "}
        </div>{" "}
        {/* Menu Label */}{" "}
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-secondary/70">
          {" "}
          Menu{" "}
        </p>{" "}
        {/* Navigation */}{" "}
        <nav className="flex flex-1 flex-col gap-1">
          <Tabs
            tabs={NAV_ITEMS}
            variant="pill"
            fullWidth
            onTabClick={handleNavigation}
          />
        </nav>{" "}
        <Button
          variant="secondary"
          className="w-full !text-primary !border-primary mb-4"
          onClick={handleLogout}
        >
          <span>
            <LuLogOut size={16} />{" "}
          </span>
          Logout
        </Button>
      </aside>{" "}
    </>
  );
}
