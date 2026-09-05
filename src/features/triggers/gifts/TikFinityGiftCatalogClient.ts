import {
  mapTikFinityGiftCatalog,
  type TikFinityGiftCatalogResponseItem,
} from "@/features/triggers/gifts/TikFinityGiftCatalogMapper";

import type {
  GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

const TIKFINITY_GIFT_API_URL =
  "https://tikfinity.zerody.one/api/getAllGifts";

export type FetchTikFinityGiftCatalogOptions = {
  roomId: string;
  language?: string;
};

export async function fetchTikFinityGiftCatalog({
  roomId,
  language = "ja-JP",
}: FetchTikFinityGiftCatalogOptions): Promise<
  GiftCatalogItem[]
> {
  const normalizedRoomId =
    roomId.trim();

  if (!normalizedRoomId) {
    throw new Error(
      "TikFinity gift catalog requires a roomId.",
    );
  }

  const url =
    new URL(
      TIKFINITY_GIFT_API_URL,
    );

  url.searchParams.set(
    "lang",
    language,
  );

  url.searchParams.set(
    "room_id",
    normalizedRoomId,
  );

  const response =
    await fetch(
      url.toString(),
      {
        method: "GET",
      },
    );

  if (!response.ok) {
    throw new Error(
      `TikFinity gift catalog request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown =
    await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "TikFinity gift catalog returned an invalid response.",
    );
  }

  return mapTikFinityGiftCatalog(
    data as TikFinityGiftCatalogResponseItem[],
  );
}