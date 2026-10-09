import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  Check,
  CircleDollarSign,
  FileCheck2,
  FileText,
  Landmark,
  PackageCheck,
  Quote,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

const roleCards = [
  {
    role: "Buyers",
    icon: Landmark,
    eyebrow: "Source with confidence",
    description:
      "Publish multi-item RFQs, compare supplier quotations, issue purchase orders, receive goods, and settle approved invoices.",
    capabilities: ["RFQ workspace", "Bid evaluation", "Receipt-backed payments"],
    tone: "teal",
  },
  {
    role: "Suppliers",
    icon: Store,
    eyebrow: "Win the right work",
    description:
      "Discover matching opportunities, submit accurate quotations, manage fulfillment, and invoice delivered goods.",
    capabilities: ["Opportunity feed", "Quotation builder", "Order fulfillment"],
    tone: "amber",
  },
  {
    role: "Administrators",
    icon: ShieldCheck,
    eyebrow: "Keep every deal trusted",
    description:
      "Verify suppliers, oversee disputes and refunds, inspect audit trails, and understand platform-wide performance.",
    capabilities: ["Supplier verification", "Risk operations", "Financial analytics"],
    tone: "ink",
  },
] as const;

const workflow = [
  { label: "Source", detail: "Create & publish RFQs", icon: Search },
  { label: "Compare", detail: "Evaluate quotations", icon: BarChart3 },
  { label: "Order", detail: "Award & issue POs", icon: FileCheck2 },
  { label: "Receive", detail: "Inspect delivered goods", icon: PackageCheck },
  { label: "Settle", detail: "Approve & pay invoices", icon: CircleDollarSign },
] as const;

const platformHighlights = [
  {
    icon: Boxes,
    title: "One connected workflow",
    description:
      "RFQs, quotations, purchase orders, goods receipts, invoices, and payments stay linked from request to reconciliation.",
  },
  {
    icon: ShieldCheck,
    title: "Controls built in",
    description:
      "Role permissions, immutable award snapshots, audit events, and server-calculated totals protect every decision.",
  },
  {
    icon: Sparkles,
    title: "Clarity at every handoff",
    description:
      "Purpose-built workspaces surface the next action for buyers, suppliers, and platform operators without the clutter.",
  },
] as const;

export default function Home() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <SiteHeader />

      <div className="relative isolate border-b border-ink/10 bg-cream">
        <div className="hero-grid pointer-events-none absolute inset-0 -z-20 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/10 blur-3xl" />

        <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-32 lg:pt-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal shadow-sm shadow-teal/5 backdrop-blur">
              <span className="flex size-6 items-center justify-center rounded-full bg-teal text-white">
                <Sparkles aria-hidden="true" className="size-3.5" />
              </span>
              Procurement, made accountable
            </div>

            <h1 className="max-w-3xl text-balance text-[clamp(3.2rem,7vw,6.6rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-ink">
              Every purchase,
              <span className="relative ml-2 inline-block text-teal sm:ml-3">
                perfectly aligned.
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-3 left-1 h-3 w-[96%] text-amber"
                  preserveAspectRatio="none"
                  viewBox="0 0 520 18"
                >
                  <path d="M3 13C120 2 344 2 517 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="7" />
                </svg>
              </span>
            </h1>

            <p className="mt-9 max-w-xl text-pretty text-lg leading-8 text-ink/65 sm:text-xl">
              ProcuraX gives buyers, suppliers, and administrators one clear place to move from sourcing to settlement—with trust built into every handoff.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">
                  Start procuring smarter
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#workflow">See the workflow</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-ink/60">
              {["Verified suppliers", "Auditable decisions", "Stripe-secured payments"].map((item) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <span className="flex size-5 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-teal/15 via-transparent to-amber/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-ink p-3 shadow-[0_30px_90px_-35px_rgba(13,35,35,0.55)] sm:p-4">
              <div className="flex items-center justify-between px-3 pb-4 pt-2 text-white/55">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                </div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]">Procurement workspace</span>
                <BadgeCheck aria-hidden="true" className="size-4 text-mint" />
              </div>

              <div className="rounded-[1.4rem] bg-[#f8f5ec] p-5 sm:p-7">
                <div className="flex items-start justify-between gap-6 border-b border-ink/10 pb-5">
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-teal">Active sourcing</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl">A clear path from request to paid</h2>
                  </div>
                  <span className="hidden rounded-full border border-teal/15 bg-teal/5 px-3 py-1.5 text-xs font-bold text-teal sm:inline-flex">
                    Live workflow
                  </span>
                </div>

                <div className="space-y-2.5 py-5">
                  {[
                    { label: "Request for quotation", meta: "Published to matched suppliers", icon: FileText, state: "Complete" },
                    { label: "Quotation evaluation", meta: "Commercial comparison ready", icon: Quote, state: "In review" },
                    { label: "Purchase order", meta: "Created after award", icon: ReceiptText, state: "Next" },
                  ].map((item, index) => (
                    <div className="group flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-3.5 shadow-sm shadow-ink/5" key={item.label}>
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${index === 1 ? "bg-amber text-ink" : "bg-teal/10 text-teal"}`}>
                        <item.icon aria-hidden="true" className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink">{item.label}</span>
                        <span className="mt-0.5 block truncate text-xs text-ink/50">{item.meta}</span>
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${index === 1 ? "bg-amber/25 text-ink" : "bg-ink/5 text-ink/55"}`}>
                        {item.state}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-teal p-4 text-white">
                    <Users aria-hidden="true" className="size-5 text-mint" />
                    <p className="mt-4 text-sm font-semibold">Supplier-ready</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">Category matching keeps sourcing relevant.</p>
                  </div>
                  <div className="rounded-2xl bg-amber p-4 text-ink">
                    <ShieldCheck aria-hidden="true" className="size-5" />
                    <p className="mt-4 text-sm font-semibold">Audit-ready</p>
                    <p className="mt-1 text-xs leading-5 text-ink/60">Every critical action leaves a clear trail.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-5 hidden max-w-[13rem] rounded-2xl border border-ink/10 bg-white p-4 shadow-xl shadow-ink/10 sm:block">
              <div className="flex items-center gap-2 text-xs font-bold text-teal">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-40" />
                  <span className="relative inline-flex size-2 rounded-full bg-teal" />
                </span>
                Workflow synchronized
              </div>
              <p className="mt-2 text-xs leading-5 text-ink/55">All three teams see the status that matters to them.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="border-b border-ink/10 bg-white py-6" aria-label="Platform principles">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink/45 sm:px-8 lg:px-10">
          <span>Transparent sourcing</span>
          <span className="hidden size-1 rounded-full bg-amber sm:block" />
          <span>Controlled fulfillment</span>
          <span className="hidden size-1 rounded-full bg-amber sm:block" />
          <span>Receipt-backed invoicing</span>
          <span className="hidden size-1 rounded-full bg-amber sm:block" />
          <span>Secure settlement</span>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" id="platform">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="eyebrow">Designed for the whole lifecycle</p>
              <h2 className="section-title mt-5 max-w-lg">Less chasing. More certainty.</h2>
              <p className="mt-6 max-w-md text-lg leading-8 text-ink/60">
                Replace scattered email threads and disconnected spreadsheets with a procurement record everyone can trust.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 sm:grid-cols-3">
              {platformHighlights.map((feature) => (
                <article className="bg-cream p-7 sm:p-6 lg:p-7" key={feature.title}>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-teal shadow-sm">
                    <feature.icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.025em] text-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/55">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-white sm:py-32" id="roles">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-mint">Three roles. One shared truth.</p>
              <h2 className="section-title mt-5 max-w-2xl text-white">A workspace that fits each team.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/55 sm:text-right">
              Each role gets focused actions and visibility while the underlying procurement record stays connected.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {roleCards.map((card) => (
              <article className="group rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.085] sm:p-8" key={card.role}>
                <div className="flex items-start justify-between">
                  <span className={`flex size-12 items-center justify-center rounded-2xl ${card.tone === "amber" ? "bg-amber text-ink" : card.tone === "teal" ? "bg-teal text-white" : "bg-white text-ink"}`}>
                    <card.icon aria-hidden="true" className="size-5" />
                  </span>
                  <ArrowRight aria-hidden="true" className="size-5 -rotate-45 text-white/35 transition-transform group-hover:rotate-0 group-hover:text-white" />
                </div>
                <p className="mt-9 text-xs font-bold uppercase tracking-[0.15em] text-mint">{card.eyebrow}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{card.role}</h3>
                <p className="mt-4 text-sm leading-6 text-white/55">{card.description}</p>
                <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  {card.capabilities.map((capability) => (
                    <li className="flex items-center gap-3 text-sm font-medium text-white/75" key={capability}>
                      <Check aria-hidden="true" className="size-4 text-mint" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 sm:py-32" id="workflow">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">From need to paid</p>
            <h2 className="section-title mt-5">One flow. No blind spots.</h2>
            <p className="mt-5 text-lg leading-8 text-ink/60">
              ProcuraX connects each commercial decision to the record before it, so teams always know what happened and what comes next.
            </p>
          </div>

          <ol className="relative mt-16 grid gap-4 md:grid-cols-5">
            <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-8 hidden border-t border-dashed border-teal/25 md:block" />
            {workflow.map((step, index) => (
              <li className="relative flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 md:flex-col md:border-0 md:bg-transparent md:p-0 md:text-center" key={step.label}>
                <span className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-2xl border border-teal/15 bg-white text-teal shadow-sm shadow-teal/10">
                  <step.icon aria-hidden="true" className="size-6" />
                  <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-ink text-[0.65rem] font-bold text-white">
                    {index + 1}
                  </span>
                </span>
                <span>
                  <span className="mt-5 block text-base font-bold text-ink">{step.label}</span>
                  <span className="mt-1.5 block text-xs leading-5 text-ink/50">{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-teal px-6 py-12 text-white sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:px-16">
            <div className="cta-grid pointer-events-none absolute inset-0 opacity-35" />
            <div className="relative max-w-2xl">
              <p className="eyebrow text-mint">Make the next purchase the clearest one yet</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                Better procurement begins with shared visibility.
              </h2>
            </div>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register">
                  Create your workspace
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild className="border-white/20 text-white hover:bg-white/10 hover:text-white" size="lg" variant="outline">
                <Link href="/login">Explore demo access</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white pb-8 pt-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 border-t border-ink/10 px-5 pt-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Logo />
          <p className="text-sm text-ink/45">Purpose-built for accountable B2B procurement.</p>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">Buyer · Supplier · Admin</p>
        </div>
      </footer>
    </main>
  );
}
