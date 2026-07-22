import { create } from "zustand";

export type GachaRarity =
  | "Common"
  | "Rare"
  | "Super Rare"
  | "Ultra Rare";

export type GachaResult = {
  id: string;
  name: string;
  rarity: GachaRarity;
  stars: number;
  weight: number;
  minecraftCommand: string;
};

export type ActivityLog = {
  id: string;
  time: string;
  label: "TikTok" | "Gift" | "Gacha" | "Overlay";
  detail: string;
};

type DashboardState = {
  isConnected: boolean;
  todayGiftCount: number;
  gachaRollCount: number;
  isOverlayRunning: boolean;
  currentResult: GachaResult;
  recentLogs: ActivityLog[];
  rollTestGacha: () => void;
};

const gachaResults: GachaResult[] = [
  {
    id: "common-speed",
    name: "Speed Boost",
    rarity: "Common",
    stars: 1,
    weight: 45,
    minecraftCommand: "/effect give @p speed 10 1",
  },
  {
    id: "rare-lightning",
    name: "Lightning Strike",
    rarity: "Rare",
    stars: 2,
    weight: 30,
    minecraftCommand: "/summon lightning_bolt ~ ~ ~",
  },
  {
    id: "super-rare-zombie",
    name: "Zombie Rush",
    rarity: "Super Rare",
    stars: 3,
    weight: 18,
    minecraftCommand: "/summon zombie ~ ~ ~",
  },
  {
    id: "ultra-rare-black-hole",
    name: "Minecraft Black Hole",
    rarity: "Ultra Rare",
    stars: 5,
    weight: 7,
    minecraftCommand: "/bedrock blackhole 10",
  },
];

function drawWeightedResult(): GachaResult {
  const totalWeight = gachaResults.reduce(
    (total, result) => total + result.weight,
    0,
  );

  let randomValue = Math.random() * totalWeight;

  for (const result of gachaResults) {
    randomValue -= result.weight;

    if (randomValue < 0) {
      return result;
    }
  }

  return gachaResults[0];
}

function createLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getCurrentTime(): string {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

const initialResult = gachaResults[3];

export const useDashboardStore = create<DashboardState>((set) => ({
  isConnected: true,
  todayGiftCount: 28,
  gachaRollCount: 54,
  isOverlayRunning: true,
  currentResult: initialResult,

  recentLogs: [
    {
      id: "initial-1",
      time: "22:14",
      label: "TikTok",
      detail: "LIVE connection established",
    },
    {
      id: "initial-2",
      time: "22:16",
      label: "Gift",
      detail: "Rose ×10 received",
    },
    {
      id: "initial-3",
      time: "22:18",
      label: "Gift",
      detail: "Whale received",
    },
    {
      id: "initial-4",
      time: "22:19",
      label: "Gacha",
      detail: "★★★★★ Ultra Rare — Minecraft Black Hole",
    },
  ],

  rollTestGacha: () => {
    const result = drawWeightedResult();

    const newLog: ActivityLog = {
      id: createLogId(),
      time: getCurrentTime(),
      label: "Gacha",
      detail: `${"★".repeat(result.stars)} ${result.rarity} — ${result.name}`,
    };

    set((state) => ({
      currentResult: result,
      gachaRollCount: state.gachaRollCount + 1,
      recentLogs: [newLog, ...state.recentLogs].slice(0, 6),
    }));
  },
}));