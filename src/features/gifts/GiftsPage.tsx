import { Gift } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export function GiftsPage() {
  return (
    <PagePlaceholder
      title="Gift Mapping"
      description="TikTokギフトと、実行するガチャやイベントを関連付ける画面です。"
      icon={Gift}
      nextVersion="Release v0.4.0"
    />
  );
}