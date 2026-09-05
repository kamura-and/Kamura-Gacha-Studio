import type {
  GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

export type TikFinityGiftCatalogResponseItem = {
  id?: string | number;
  name?: string;
  describe?: string;
  diamond_count?: number;
  image?: {
    url_list?: string[];
  };
  type?: number;
  source?: number;
};

export function mapTikFinityGiftCatalogItem(
  gift: TikFinityGiftCatalogResponseItem,
): GiftCatalogItem | null {
  const id =
    normalizeGiftId(
      gift.id,
    );

  const name =
    normalizeString(
      gift.name,
    );

  if (
    !id ||
    !name
  ) {
    return null;
  }

  return {
    id,
    name,
    coinValue:
      normalizeNonNegativeNumber(
        gift.diamond_count,
      ),
    imageUrl:
      normalizeImageUrl(
        gift.image?.url_list,
      ),
    source:
      "tikfinity",
    status:
      "active",
  };
}

export function mapTikFinityGiftCatalog(
  gifts: TikFinityGiftCatalogResponseItem[],
): GiftCatalogItem[] {
  return gifts
    .map(
      mapTikFinityGiftCatalogItem,
    )
    .filter(
      (
        gift,
      ): gift is GiftCatalogItem =>
        gift !== null,
    );
}

function normalizeGiftId(
  value:
    | string
    | number
    | undefined,
): string | null {
  if (
    typeof value === "number"
  ) {
    if (
      !Number.isFinite(
        value,
      )
    ) {
      return null;
    }

    return String(
      value,
    );
  }

  if (
    typeof value === "string"
  ) {
    const trimmed =
      value.trim();

    return (
      trimmed ||
      null
    );
  }

  return null;
}

function normalizeString(
  value:
    | string
    | undefined,
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return (
    trimmed ||
    null
  );
}

function normalizeNonNegativeNumber(
  value:
    | number
    | undefined,
): number | undefined {
  if (
    typeof value !== "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return undefined;
  }

  return Math.max(
    0,
    value,
  );
}

function normalizeImageUrl(
  urls:
    | string[]
    | undefined,
): string | undefined {
  if (
    !Array.isArray(
      urls,
    )
  ) {
    return undefined;
  }

  const firstValidUrl =
    urls.find(
      (url) =>
        typeof url === "string" &&
        url.trim().length > 0,
    );

  return firstValidUrl?.trim();
}