import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PagePlaceholderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  nextVersion: string;
};

export function PagePlaceholder({
  title,
  description,
  icon: Icon,
  nextVersion,
}: PagePlaceholderProps) {
  return (
    <main className="px-5 py-7 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl">
        <Card className="flex min-h-[28rem] items-center justify-center rounded-3xl">
          <CardHeader className="max-w-md items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Icon aria-hidden="true" size={28} />
            </div>

            <CardTitle className="mt-4 text-2xl">{title}</CardTitle>

            <CardDescription className="leading-6">
              {description}
            </CardDescription>

            <CardContent className="p-0 pt-3">
              <Badge variant="secondary">
                {nextVersion}で実装予定
              </Badge>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}