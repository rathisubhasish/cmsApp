import { cn } from "../../services/utility";

export default function Loader({ label = "Loading...", className = "" }) {
    return (
        <div className={cn("flex items-center justify-center gap-2 py-8", className)}>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
            <span className="text-sm text-text-secondary">{label}</span>
        </div>
    );
}
