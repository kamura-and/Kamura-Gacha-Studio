import { Sparkles } from "lucide-react";
import { PagePlaceholder } from "../components/PagePlaceholder";

export function GachaPage() {
  return (
    <PagePlaceholder
      title="Gacha Editor"
      description="ガチャの作成、排出アイテム、重み、Minecraftコマンドなどを管理する画面です。"
      icon={Sparkles}
      nextVersion="Release v0.2.0"
    />
  );
}