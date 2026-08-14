import { LuX } from "react-icons/lu";

export default function SidePanel({
  open,
  title,
  subtitle,
  badge,
  headerActions,
  onClose,
  children,
  footer,
  width = 480,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[rgba(15,23,42,0.4)]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-h-screen flex-col bg-surface shadow-card"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-[28px] pt-[24px]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Close panel"
              className="border-none bg-transparent p-0 text-text-primary cursor-pointer hover:text-text-secondary"
              onClick={onClose}
            >
              <LuX size={26} />
            </button>

            {headerActions}
          </div>

          <h2 className="mt-[16px] text-2xl font-bold text-text-primary">{title}</h2>

          {(subtitle || badge) && (
            <div className="mt-[6px] flex items-center justify-between gap-3">
              {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
              {badge}
            </div>
          )}
        </div>

        <div className="mt-[20px] flex-1 overflow-y-auto px-[28px] pb-[24px]">{children}</div>

        {footer && (
          <div className="border-t border-border px-[28px] py-[18px]">{footer}</div>
        )}
      </div>
    </div>
  );
}
