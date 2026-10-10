import { ArrowRight, FilePlus2, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FeedbackState } from "@/components/ui/feedback-state";
import type { PublicUser, UserRole } from "@/lib/auth/contracts";

const content = {
  BUYER: { eyebrow: "Buyer overview", title: "Turn demand into accountable decisions.", action: "Create your first RFQ", href: "/buyer/rfqs/new", empty: "No sourcing activity yet", description: "Create an RFQ to start collecting comparable supplier quotations." },
  SUPPLIER: { eyebrow: "Supplier overview", title: "Find opportunities worth winning.", action: "Browse opportunities", href: "/supplier/opportunities", empty: "No active quotations yet", description: "Explore published opportunities and submit a quotation to begin." },
  ADMIN: { eyebrow: "Operations overview", title: "Keep the marketplace trusted and moving.", action: "Review suppliers", href: "/admin/suppliers", empty: "No reviews waiting", description: "New supplier verification requests will appear here when they arrive." },
} satisfies Record<UserRole, { eyebrow: string; title: string; action: string; href: string; empty: string; description: string }>;

export function DashboardOverview({ user }: { user: PublicUser }) {
  const view = content[user.role];
  return (
    <div>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div><p className="eyebrow">{view.eyebrow}</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Good to see you, {user.firstName}. <span className="text-ink/35">{view.title}</span></h1></div>
        <Button asChild size="lg"><Link href={view.href}>{view.action}<ArrowRight /></Link></Button>
      </div>
      <div className="mt-9 grid gap-4 sm:grid-cols-3">
        <Metric icon={FilePlus2} label="Open items" value="0" /><Metric icon={TrendingUp} label="This month" value="0" /><Metric icon={Sparkles} label="Needs attention" value="0" />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <FeedbackState action={<Button asChild variant="outline"><Link href={view.href}>{view.action}</Link></Button>} compact description={view.description} title={view.empty} />
        <section className="rounded-[1.75rem] bg-ink p-7 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Getting started</p><h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">Your workspace is ready.</h2><p className="mt-3 text-sm leading-6 text-white/50">As records move through ProcuraX, this overview will surface progress, exceptions, and the next best action.</p><div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/3 rounded-full bg-amber" /></div><p className="mt-3 text-xs text-white/35">Profile setup: 1 of 3 steps</p></section>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof FilePlus2; label: string; value: string }) {
  return <article className="rounded-[1.5rem] border border-ink/10 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-ink/45">{label}</p><span className="flex size-9 items-center justify-center rounded-xl bg-mint/35 text-teal"><Icon className="size-4" /></span></div><p className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink">{value}</p></article>;
}
