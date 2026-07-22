import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">404</p>

        <h1 className="mt-2 text-3xl font-bold text-foreground">
          ページが見つかりません
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          URLが正しいか確認してください。
        </p>

        <Link
          to="/"
          className={cn(
            buttonVariants(),
            "mt-6 rounded-2xl",
          )}
        >
          Dashboardへ戻る
        </Link>
      </div>
    </main>
  );
}