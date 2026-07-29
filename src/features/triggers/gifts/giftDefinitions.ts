export type GiftDefinition = {
  id: string;
  name: string;
  coinValue?: number;
  imageUrl?: string;
  fallbackSymbol: string;
  aliases?: string[];
};

export const giftDefinitions: GiftDefinition[] = [
  {
    id: "rose",
    name: "バラ",
    coinValue: 1,
    fallbackSymbol: "🌹",
    aliases: ["rose", "ローズ"],
  },
  {
    id: "finger-heart",
    name: "フィンガーハート",
    coinValue: 5,
    fallbackSymbol: "🫰",
    aliases: ["finger heart"],
  },
  {
    id: "doughnut",
    name: "ドーナッツ",
    coinValue: 30,
    fallbackSymbol: "🍩",
    aliases: ["donut", "doughnut", "ドーナツ"],
  },
  {
    id: "corgi",
    name: "コーギー",
    fallbackSymbol: "🐶",
    aliases: ["corgi"],
  },
  {
    id: "swan",
    name: "白鳥",
    fallbackSymbol: "🦢",
    aliases: ["swan"],
  },
  {
    id: "galaxy",
    name: "銀河",
    fallbackSymbol: "🌌",
    aliases: ["galaxy"],
  },
  {
    id: "money-gun",
    name: "マネーガン",
    fallbackSymbol: "💸",
    aliases: ["money gun"],
  },
  {
    id: "whale",
    name: "クジラ",
    fallbackSymbol: "🐋",
    aliases: ["whale"],
  },
  {
    id: "yellow-car",
    name: "黄色い車",
    fallbackSymbol: "🚕",
    aliases: ["yellow car"],
  },
  {
    id: "hat-and-mustache",
    name: "帽子と口ひげ",
    fallbackSymbol: "🥸",
    aliases: ["hat and mustache"],
  },
];

export function findGiftDefinition(
  giftId: string | undefined,
): GiftDefinition | undefined {
  if (!giftId) {
    return undefined;
  }

  return giftDefinitions.find(
    (gift) => gift.id === giftId,
  );
}