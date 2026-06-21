import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface AssetPlaceholderProps {
  label: string;
  width?: string;
  height?: string;
  className?: string;
}

export function AssetPlaceholder({
  label,
  width = "100%",
  height = "200px",
  className,
}: AssetPlaceholderProps) {
  return (
    <div
      style={{ width, height }}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-500",
        className
      )}
    >
      <ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
      <span className="text-sm font-medium">{label}</span>
      <span className="mt-1 text-xs text-slate-400">Export from Figma</span>
    </div>
  );
}
