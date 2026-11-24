"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";

export default function PlantTableThumbnail({ src, alt }: { src?: string; alt: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#eaf6e5] text-[#456756]">
      {src && src !== failedSrc ? (
        // Catalog media can come from multiple storage providers.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} width={64} height={64} loading="lazy" className="h-full w-full object-contain" onError={() => setFailedSrc(src)} />
      ) : (
        <span role="img" aria-label="Plant photo coming soon"><Sprout aria-hidden="true" className="h-7 w-7" /></span>
      )}
    </span>
  );
}
