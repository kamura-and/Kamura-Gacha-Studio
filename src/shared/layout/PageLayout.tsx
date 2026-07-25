import type { ReactNode } from "react";

type PageLayoutProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function PageLayout({
  title,
  description,
  actions,
  children,
}: PageLayoutProps) {
  return (
    <main className="flex h-full flex-col overflow-hidden">
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              {title}
            </h1>

            {description && (
              <p className="mt-2 text-sm font-medium text-slate-500">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </header>

      <section className="flex-1 overflow-y-auto bg-slate-100 p-8">
        {children}
      </section>
    </main>
  );
}