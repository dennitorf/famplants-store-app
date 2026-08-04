import {
  ImageVariantType,
  type ImageCatalogEntry,
} from "@/models/media/image-variant";

function variantUrl(
  image: ImageCatalogEntry | undefined,
  variantTypes: readonly ImageVariantType[],
): string | undefined {
  for (const variantType of variantTypes) {
    const url = image?.variants
      ?.find((variant) => variant.variantType === variantType)
      ?.url.trim();
    if (url) return url;
  }

  return undefined;
}

function nonEmpty(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

export function getCardImageUrl(
  image: ImageCatalogEntry | undefined,
): string | undefined {
  return variantUrl(image, [
    ImageVariantType.Card,
    ImageVariantType.Thumbnail,
  ]) ?? nonEmpty(image?.thumbnailUrl) ?? nonEmpty(image?.url);
}

export function getDetailImageUrl(
  image: ImageCatalogEntry | undefined,
): string | undefined {
  return variantUrl(image, [
    ImageVariantType.Detail,
    ImageVariantType.Hero,
    ImageVariantType.Card,
  ]) ?? nonEmpty(image?.url) ?? nonEmpty(image?.thumbnailUrl);
}

export function getThumbnailImageUrl(
  image: ImageCatalogEntry | undefined,
): string | undefined {
  return variantUrl(image, [
    ImageVariantType.Thumbnail,
    ImageVariantType.Card,
  ]) ?? nonEmpty(image?.thumbnailUrl) ?? nonEmpty(image?.url);
}
