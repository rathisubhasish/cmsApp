import { cn } from "../../services/utility";

export function TimelineItem({ marker, last = false, children }) {
    return (
        <li className="relative pb-6 pl-8 last:pb-0">
            {!last && <span className="absolute bottom-0 left-[7px] top-5 w-px bg-border" />}
            <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-surface" />
            {marker}
            {children}
        </li>
    );
}

export default function Timeline({ children, className = "" }) {
    return <ol className={cn("flex flex-col", className)}>{children}</ol>;
}
