import { AlertTriangle, Inbox, LoaderCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FeedbackStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: "neutral" | "danger";
  compact?: boolean;
};

export function FeedbackState({ title, description, action, icon: Icon = Inbox, tone = "neutral", compact }: FeedbackStateProps) {
  return (
    <section className={cn("flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed text-center", compact ? "min-h-64 p-6" : "min-h-96 p-8", tone === "danger" ? "border-red-300 bg-red-50/60" : "border-ink/15 bg-white")}>
      <span className={cn("flex size-12 items-center justify-center rounded-2xl", tone === "danger" ? "bg-red-100 text-red-700" : "bg-mint/35 text-teal")}><Icon aria-hidden="true" className="size-5" /></span>
      <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink/50">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}

export function ErrorFeedback({ action }: { action?: ReactNode }) {
  return <FeedbackState action={action} description="The workspace could not load this view. Your data is safe; try the request again." icon={AlertTriangle} title="Something went wrong" tone="danger" />;
}

export function LoadingFeedback() {
  return (
    <div aria-busy="true" aria-label="Loading workspace" className="grid min-h-80 place-items-center rounded-[1.75rem] border border-ink/10 bg-white">
      <div className="text-center"><LoaderCircle className="mx-auto size-7 animate-spin text-teal" /><p className="mt-3 text-sm font-semibold text-ink/45">Loading your workspace...</p></div>
    </div>
  );
}
