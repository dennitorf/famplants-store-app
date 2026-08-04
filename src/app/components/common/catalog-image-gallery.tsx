"use client";

import { useState } from "react";
import CatalogImage from "@/app/components/common/catalog-image";
import type { ImageCatalogEntry } from "@/models/media/image-variant";
import {
  getDetailImageUrl,
  getThumbnailImageUrl,
} from "@/utils/helpers/image-catalog";

interface CatalogGalleryImage extends ImageCatalogEntry {
  id: string;
  altText?: string;
  isPrimary: boolean;
}

interface CatalogImageGalleryProps {
  images: CatalogGalleryImage[];
  subjectName: string;
  fallbackUrl?: string;
  fallbackAlt?: string;
  placeholderLabel?: string;
  chooserLabel?: string;
}

export default function CatalogImageGallery({
  images,
  subjectName,
  fallbackUrl,
  fallbackAlt,
  placeholderLabel = "Photo coming soon",
  chooserLabel = "Choose an image",
}: CatalogImageGalleryProps) {
  const orderedImages = [...images].sort(
    (left, right) => Number(right.isPrimary) - Number(left.isPrimary),
  );
  const visibleImages = orderedImages.length
    ? orderedImages.map((image) => ({
        id: image.id,
        url: getDetailImageUrl(image),
        thumbnailUrl: getThumbnailImageUrl(image),
        alt: image.altText || subjectName,
      }))
    : [{
        id: "fallback",
        url: fallbackUrl,
        thumbnailUrl: fallbackUrl,
        alt: fallbackAlt || subjectName,
      }];
  const [selectedImageId, setSelectedImageId] = useState(visibleImages[0].id);
  const selectedImage = visibleImages.find((image) => image.id === selectedImageId)
    ?? visibleImages[0];

  return (
    <div aria-label={`${subjectName} image gallery`}>
      <div className="catalog-image !aspect-square rounded-[2rem] border border-emerald-950/10 shadow-[0_18px_55px_rgb(36_75_54_/_10%)]">
        <CatalogImage
          src={selectedImage.url}
          alt={selectedImage.alt}
          placeholderLabel={placeholderLabel}
        />
      </div>

      {visibleImages.length > 1 ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2" aria-label={chooserLabel}>
          {visibleImages.map((image, index) => {
            const selected = image.id === selectedImage.id;
            return (
              <button
                key={image.id}
                type="button"
                aria-label={`Show image ${index + 1} of ${visibleImages.length}`}
                aria-pressed={selected}
                onClick={() => setSelectedImageId(image.id)}
                className={`catalog-image !aspect-square h-20 w-20 shrink-0 rounded-2xl border-2 transition-all sm:h-24 sm:w-24 ${
                  selected
                    ? "border-[#198754] ring-2 ring-[#198754]/20"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <CatalogImage
                  src={image.thumbnailUrl}
                  alt=""
                  placeholderLabel={`Image ${index + 1}`}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
