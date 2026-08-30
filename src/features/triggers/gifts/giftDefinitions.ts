import type {
  GiftCatalogItem,
} from "@/features/triggers/gifts/GiftCatalog";

export type GiftDefinition =
  GiftCatalogItem;

export const giftDefinitions:
  GiftDefinition[] = [
    {
      id: "rose",
      name: "バラ",
      coinValue: 1,
      fallbackSymbol: "🌹",
      aliases: [
        "rose",
        "ローズ",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "finger-heart",
      name: "フィンガーハート",
      coinValue: 5,
      fallbackSymbol: "🫰",
      aliases: [
        "finger heart",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "doughnut",
      name: "ドーナッツ",
      coinValue: 30,
      fallbackSymbol: "🍩",
      aliases: [
        "donut",
        "doughnut",
        "ドーナツ",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "corgi",
      name: "コーギー",
      fallbackSymbol: "🐶",
      aliases: [
        "corgi",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "swan",
      name: "白鳥",
      fallbackSymbol: "🦢",
      aliases: [
        "swan",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "galaxy",
      name: "銀河",
      fallbackSymbol: "🌌",
      aliases: [
        "galaxy",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "money-gun",
      name: "マネーガン",
      fallbackSymbol: "💸",
      aliases: [
        "money gun",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "whale",
      name: "クジラ",
      fallbackSymbol: "🐋",
      aliases: [
        "whale",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "yellow-car",
      name: "黄色い車",
      fallbackSymbol: "🚕",
      aliases: [
        "yellow car",
      ],
      source: "manual",
      status: "unknown",
    },
    {
      id: "hat-and-mustache",
      name: "帽子と口ひげ",
      fallbackSymbol: "🥸",
      aliases: [
        "hat and mustache",
      ],
      source: "manual",
      status: "unknown",
    },
  ];

export function findGiftDefinition(
  giftId: string | undefined,
): GiftDefinition | undefined {
  if (!giftId) {
    return undefined;
  }

  return giftDefinitions.find(
    (gift) =>
      gift.id === giftId,
  );
}