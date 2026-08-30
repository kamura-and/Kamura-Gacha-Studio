export type GiftCatalogSource =
  | "tiktok"
  | "tikfinity"
  | "manual";

export type GiftCatalogStatus =
  | "active"
  | "unknown"
  | "inactive";

export type GiftCatalogItem = {
  /*
   * TikTok / TikFinityから受け取る
   * 実際のgiftIdを主キーとして使用する。
   */
  id: string;

  name: string;

  coinValue?: number;
  imageUrl?: string;

  fallbackSymbol?: string;
  aliases?: string[];

  source: GiftCatalogSource;
  status: GiftCatalogStatus;

  firstSeenAt?: number;
  lastSeenAt?: number;
};