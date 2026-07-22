import { Settings } from "lucide-react";
import { PagePlaceholder } from "../components/PagePlaceholder";

export function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="テーマ、データ保存先、オーバーレイURL、バックアップなどを設定する画面です。"
      icon={Settings}
      nextVersion="Release v0.1.0"
    />
  );
}