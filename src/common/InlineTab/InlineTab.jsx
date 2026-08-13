import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../services/utility";

export default function InlineTab({
  tabs = [],
  size = "large",
  version = "v1",
  path = false,
  margin = "-2rem 0 32px",
  className = "",
  style,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const withRouteState = (list) =>
    list.map((tab) => ({
      ...tab,
      active: location.pathname === tab.path,
      onClick: () => navigate(tab.path),
    }));

  if (version === "v1") {
    const items = path ? withRouteState(tabs) : tabs;

    return (
      <div
        className={cn(
          "flex items-stretch gap-9 overflow-x-auto [&::-webkit-scrollbar]:hidden",
          className,
        )}
        style={{ height: "50px", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((tab, idx) => (
          <span
            key={tab.path || tab.title || idx}
            onClick={tab.onClick}
            className={cn(
              "flex shrink-0 cursor-pointer items-center whitespace-nowrap border-b-[3px] text-sm",
              tab.active
                ? "border-primary font-bold text-primary-text"
                : "border-transparent text-[rgb(55,65,81)]",
            )}
            style={style}
          >
            {tab.title}
          </span>
        ))}
      </div>
    );
  }

  if (size === "small") {
    const items = withRouteState(tabs);

    return (
      <div
        className={cn("inline-flex gap-1", className)}
        style={{ margin, ...style }}
      >
        {items.map((tab, idx) => (
          <div
            key={tab.path || idx}
            onClick={tab.onClick}
            className={cn(
              "cursor-pointer rounded px-3 py-1.5 text-sm",
              tab.active ? "bg-[#f2f2f2] font-semibold" : "text-text-secondary",
            )}
          >
            {tab.title}
          </div>
        ))}
      </div>
    );
  }

  const items = path ? withRouteState(tabs) : tabs;

  return (
    <div
      className={cn("inline-flex rounded bg-[#f2f4f8] p-[3px]", className)}
      style={style}
    >
      {items.map((tab, idx) => (
        <div
          key={tab.path || tab.title || idx}
          onClick={tab.onClick}
          className={cn(
            "grow cursor-pointer px-5 py-2 text-center text-base",
            tab.active &&
              "rounded-[0.3rem] bg-white font-semibold shadow-[0_0.2rem_0.6rem_rgba(0,0,0,0.2)]",
          )}
        >
          {tab.title}
        </div>
      ))}
    </div>
  );
}
