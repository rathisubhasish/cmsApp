import { LuX } from "react-icons/lu";

export default function Modal({
  title,
  onClose,
  children,
  actions,
  width = 560,
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-[20px] z-50 bg-[rgba(15,23,42,0.4)]"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[90vh] overflow-y-auto bg-surface rounded-[14px] shadow-card pt-[24px] px-[28px] pb-[28px]"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-[20px]">
          <h2>{title}</h2>
          <button
            type="button"
            className="border-none bg-primary-light text-text-secondary w-[30px] h-[30px] rounded-[8px] flex items-center justify-center cursor-pointer hover:text-text-primary"
            onClick={onClose}
          >
            <LuX size={18} />
          </button>
        </div>

        {children}

        {actions && (
          <div className="flex justify-end gap-[10px] mt-[24px]">{actions}</div>
        )}
      </div>
    </div>
  );
}
