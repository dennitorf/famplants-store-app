"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  label: string;
  hash?: string;
  className?: string;
};

export default function ShareButton({ label, hash, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = new URL(window.location.href);

    if (hash) {
      url.hash = hash;
    }

    const shareUrl = url.toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: label,
          url: shareUrl,
        });
        return;
      } catch {
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      onClick={handleShare}
      aria-label={label}
      title={label}
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only">{copied ? "Copied" : label}</span>
    </Button>
  );
}
