"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDailyHeaderIndex, HEADER_IMAGES } from "@/lib/daily-header";

export default function DailyHeaderImage({ initialIndex }: { initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const refresh = () => setIndex(getDailyHeaderIndex(new Date()));
    // Refresh overnight tabs and tabs resumed after being suspended.
    const timer = window.setInterval(refresh, 1_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const image = HEADER_IMAGES[index];
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={3840}
      height={2160}
      priority
      sizes="(max-width: 1440px) 100vw, 1392px"
      className="aspect-video h-auto w-full object-contain"
    />
  );
}
