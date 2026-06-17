import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  detail: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};

export function AccordionItem({ label, detail, isOpen, onToggle }: Props) {
  return (
    <div style={{ borderTop: "0.5px solid #E8E8E8" }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left py-2.5"
        style={{ fontSize: 12, color: "#111", fontWeight: 500 }}
      >
        <span>{label}</span>
        <Plus
          size={14}
          style={{
            color: "#CC0000",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(45deg)" : "rotate(0)",
          }}
        />
      </button>
      <div
        style={{
          maxHeight: isOpen ? 160 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <p
          className="pb-3 pr-6"
          style={{ fontSize: 11.5, color: "#666", lineHeight: 1.55 }}
        >
          {detail}
        </p>
      </div>
    </div>
  );
}
