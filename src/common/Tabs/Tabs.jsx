import { NavLink } from "react-router-dom";
import { cn } from "../../services/utility";

const TAB_VARIANTS = {
  default: {
    base: "flex items-center gap-3 py-[10px] px-3 text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer no-underline",
    inactive: "text-text-secondary hover:text-text-primary",
    active: "text-primary-text font-semibold",
  },
  pill: {
    base: "flex items-center gap-3 py-[10px] px-3 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer no-underline",
    inactive:
      "text-text-secondary hover:bg-primary-light hover:text-text-primary",
    active: "bg-primary-light text-primary-text font-semibold",
  },
  boxed: {
    base: "flex items-center gap-3 py-[10px] px-3 rounded-lg border text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer no-underline",
    inactive:
      "border-border text-text-secondary hover:border-primary hover:text-text-primary",
    active: "border-primary bg-primary-light text-primary-text font-semibold",
  },
  underline: {
    base: "flex items-center gap-3 py-[10px] px-3 border-b-2 text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer no-underline",
    inactive: "border-transparent text-text-secondary hover:text-text-primary",
    active: "border-primary text-primary-text font-semibold",
  },
};

export default function Tabs({
  tabs = [],
  variant = "pill",
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  inactiveTabClassName = "",
  fullWidth = false,
  onTabClick,
  ...props
}) {
  const selectedVariant = TAB_VARIANTS[variant] || TAB_VARIANTS.default;
  return (
    <nav
      className={cn("flex flex-col", fullWidth && "w-full", className)}
      {...props}
    >
      {" "}
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            onClick={() => onTabClick?.(tab)}
            className={({ isActive }) =>
              cn(
                selectedVariant.base,
                "mt-2",
                isActive ? selectedVariant.active : selectedVariant.inactive,
                fullWidth && "w-full",
                tabClassName,
                isActive && activeTabClassName,
                !isActive && inactiveTabClassName,
                tab.className,
              )
            }
          >
            {" "}
            {Icon && <Icon size={18} className="shrink-0" />}{" "}
            <span>{tab.label}</span>{" "}
            {tab.badge !== undefined && (
              <span className="ml-auto rounded-full px-2 py-0.5 text-xs">
                {" "}
                {tab.badge}{" "}
              </span>
            )}{" "}
          </NavLink>
        );
      })}{" "}
    </nav>
  );
}
