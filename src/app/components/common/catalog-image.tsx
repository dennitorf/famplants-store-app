"use client";

import { useState } from "react";
import ImagePlaceholder from "@/app/components/common/image-placeholder";

interface CatalogImageProps {
  src?: string;
  alt: string;
  placeholderLabel: string;
}

export default function CatalogImage({ src, alt, placeholderLabel }: CatalogImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return <ImagePlaceholder label={placeholderLabel} />;
  }

  return (
    // API media can come from multiple storage providers.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={() => setFailedSrc(src)} />
  );
}
