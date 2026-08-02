import { ImageIcon, Sprout } from "lucide-react";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

export default function ImagePlaceholder({
  label = "Image not available",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div className={`image-placeholder relative isolate overflow-hidden ${className}`} role="img" aria-label={label}>
      <span className="absolute -left-10 -top-12 h-36 w-36 rounded-full bg-white/35 blur-sm" aria-hidden="true" />
      <span className="absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-[#8fcf83]/25 blur-sm" aria-hidden="true" />
      <span className="absolute bottom-5 left-6 h-12 w-24 -rotate-12 rounded-[100%_0_100%_0] bg-[#9fce8f]/25" aria-hidden="true" />
      <span className="relative grid h-24 w-24 place-items-center rounded-[2rem] border border-white/70 bg-white/55 text-[#276247] shadow-[0_14px_35px_rgb(40_91_63_/_14%)] backdrop-blur-sm">
        <Sprout className="h-11 w-11" strokeWidth={1.7} aria-hidden="true" />
        <span className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-full border-4 border-[#dcefd2] bg-[#fffdf7] text-[#5b806d]">
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
        </span>
      </span>
      <span className="relative rounded-full bg-white/45 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#4b725e] backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}
