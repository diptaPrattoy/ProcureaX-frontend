import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  FileSearch,
  FileText,
  Landmark,
  PackageCheck,
  ReceiptText,
  Scale,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Explore the ProcuraX sourcing, quotation, purchase order, receiving, invoicing, payment, refund, and dispute workflows.",
};

const lifecycle = [
  {
    step: "01",
    title: "Source",
    description: "Buyers build multi-item RFQs with categories, budgets, deadlines, delivery dates, and shipping requirements.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Quote",
    description: "Verified, category-matched suppliers respond while the platform calculates commercial totals on the server.",
    icon: FileSearch,
  },
  {
    step: "03",
    title: "Award",
    description: "Buyers compare eligible quotations and atomically turn the winning offer into an immutable purchase order.",
    icon: ClipboardCheck,
  },
  {
    step: "04",
    title: "Receive",
    description: "Goods arrive in one or more batches, with accepted and rejected quantities recorded against every line item.",
    icon: PackageCheck,
  },
  {
    step: "05",
    title: "Invoice",
    description: "Suppliers invoice only accepted quantities, and buyers move each invoice through a controlled review workflow.",
    icon: ReceiptText,
  },
  {
    step: "06",
    title: "Settle",
    description: "Approved invoices move through Stripe Checkout and webhook-backed reconciliation before being marked paid.",
    icon: CircleDollarSign,
  },
] as const;

const roleWorkspaces = [
  {
    id: "buyers",
    role: "Buyer workspace",
    eyebrow: "Control every purchasing decision",
    icon: Landmark,
    description:
      "Move sourcing from an internal need to a reconciled payment without losing the evidence behind each decision.",
    capabilities: [
      "Draft, edit, publish, cancel, and search RFQs",
      "Compare quotations and award a supplier",
      "Record partial deliveries and inspection results",
      "Review invoices, initiate payments, and request refunds",
    ],
    tone: "bg-teal text-white",
  },
  {
    id: "suppliers",
    role: "Supplier workspace",
    eyebrow: "Turn capability into opportunity",
    icon: Store,
    description:
      "Maintain a verified commercial profile, focus on relevant opportunities, and manage every commitment after award.",
    capabilities: [
      "Maintain company details and procurement categories",
      "Discover eligible open RFQs",
      "Submit, update, or withdraw quotations",
      "Accept orders, track fulfillment, and submit invoices",
    ],
    tone: "bg-amber text-ink",
  },
  {
    id: "administrators",
    role: "Admin workspace",
    eyebrow: "Protect trust across the network",
    icon: ShieldCheck,
    description:
      "Oversee the controls that keep supplier access, financial exceptions, and operational decisions accountable.",
    capabilities: [
      "Verify or reject supplier applications",
      "Review and resolve disputes",
      "Approve, reject, or retry refund requests",
      "Inspect audit logs, trends, and financial analytics",
    ],
    tone: "bg-ink text-white",
  },
] as const;

const safeguards = [
  {
    icon: BadgeCheck,
    title: "Eligibility before access",
    description: "Supplier verification and category matching determine who can participate in an opportunity.",
  },
  {
    icon: Boxes,
    title: "Transactional awards",
    description: "Quotation award, rejection, RFQ state, purchase order creation, and audit records succeed or roll back together.",
  },
  {
    icon: Scale,
    title: "Quantities stay accountable",
    description: "Over-receipt and over-invoicing controls connect commercial documents to what was actually accepted.",
  },
  {
    icon: CircleDollarSign,
    title: "Payments reconcile",
    description: "Stripe webhook events update the financial record independently of the browser redirect experience.",
  },
] as const;

export default function PlatformPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHero
        eyebrow="The ProcuraX platform"
        title="Procurement that remembers every decision."
        description="A connected operating layer for sourcing, supplier competition, fulfillment, invoicing, and financial exceptions—designed around the real controls in your procurement API."
      >
        <Button asChild size="lg">
          <Link href="/register">
            Create a workspace
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#lifecycle">Explore the lifecycle</Link>
        </Button>
      </PageHero>

      <section className="bg-white py-24 sm:py-32" id="lifecycle">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow">A complete commercial record</p>
            <h2 className="section-title mt-5">From request to reconciliation.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/60">
              Every stage inherits the context of the stage before it. That continuity makes decisions easier to explain and exceptions easier to resolve.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
            {lifecycle.map((item) => (
              <article className="group bg-cream p-7 transition-colors hover:bg-white sm:p-8" key={item.step}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-[0.18em] text-ink/35">{item.step}</span>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-teal shadow-sm transition-transform group-hover:-rotate-3 group-hover:scale-105">
                    <item.icon aria-hidden="true" className="size-5" />
                  </span>
                </div>
                <h3 className="mt-12 text-2xl font-semibold tracking-[-0.04em] text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/55">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 sm:py-32" id="teams">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Role-shaped workspaces</p>
            <h2 className="section-title mt-5">Focused for each team. Connected underneath.</h2>
          </div>

          <div className="mt-16 space-y-5">
            {roleWorkspaces.map((workspace, index) => (
              <article className={`grid overflow-hidden rounded-[2rem] ${workspace.tone} lg:grid-cols-[0.82fr_1.18fr]`} id={workspace.id} key={workspace.role}>
                <div className="p-7 sm:p-10 lg:p-12">
                  <workspace.icon aria-hidden="true" className={`size-8 ${index === 1 ? "text-ink" : "text-mint"}`} />
                  <p className={`mt-10 text-xs font-bold uppercase tracking-[0.16em] ${index === 1 ? "text-ink/55" : "text-mint"}`}>
                    {workspace.eyebrow}
                  </p>
                  <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{workspace.role}</h3>
                  <p className={`mt-5 max-w-lg text-sm leading-6 ${index === 1 ? "text-ink/60" : "text-white/60"}`}>
                    {workspace.description}
                  </p>
                </div>
                <div className={`grid gap-px p-3 sm:grid-cols-2 sm:p-4 ${index === 1 ? "bg-ink/10" : "bg-white/10"}`}>
                  {workspace.capabilities.map((capability) => (
                    <div className={`flex min-h-32 items-end rounded-2xl p-5 text-sm font-semibold leading-6 sm:p-6 ${index === 1 ? "bg-white/55" : "bg-white/[0.07]"}`} key={capability}>
                      <span>
                        <span className={`mb-4 block size-2 rounded-full ${index === 1 ? "bg-teal" : "bg-mint"}`} />
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow text-mint">Controls are part of the product</p>
              <h2 className="section-title mt-5 text-white">Integrity is not an afterthought.</h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/55">
                ProcuraX combines workflow rules, ownership checks, immutable snapshots, and audit events so the interface reflects what the platform can safely allow.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {safeguards.map((item) => (
                <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 sm:p-7" key={item.title}>
                  <item.icon aria-hidden="true" className="size-6 text-mint" />
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.025em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="eyebrow">Ready for a clearer workflow?</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
              Start with the workspace built for your role.
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/register">
              Get started
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
