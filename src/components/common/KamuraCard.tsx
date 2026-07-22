import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { kamuraCard, kamuraStaticCard } from "@/lib/kamura-ui";

type KamuraCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
};

export function KamuraCard({
  children,
  className,
  interactive = false,
  ...props
}: KamuraCardProps) {
  return (
    <div
      className={cn(
        interactive ? kamuraCard : kamuraStaticCard,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}