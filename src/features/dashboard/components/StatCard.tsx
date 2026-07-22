import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <Card className="border-violet-500/20 bg-slate-950/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-200">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold text-violet-300">
          {value}
        </div>

        {subtitle && (
          <p className="mt-2 text-xs text-slate-300">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}