import type { Metadata } from "next";
import { ArrowRight, Eye, GitBranch, Handshake, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why ProcuraX is designed around accountable decisions, connected records, and role-specific procurement workflows.",
};

const principles = [
  {
    icon: Eye,
    title: "Clarity over clutter",
    description:
      "The interface should make the current state, responsible party, and next valid action obvious without exposing unnecessary complexity.",
  },
  {
    icon: GitBranch,
    title: "Context stays connected",
    description:
      "A quotation should lead cleanly to its award, purchase order, receipts, invoices, payments, and any later exception.",
  },
  {
    icon: ShieldCheck,
    title: "Controls earn trust",
    description:
      "Verification, ownership, transaction boundaries, audit history, and server-calculated financial values are product features.",
  },
  {
    icon: Handshake,
    title: "Fairness for both sides",
    description:
      "Buyers need confidence in commitments; suppliers need clear opportunities, expectations, and evidence of accepted delivery.",
  },
] as const;

const foundations = [
  {
    number: "01",
    title: "Domain-first workflows",
    description:
      "Screens follow the real procurement lifecycle rather than forcing complex work into generic create, read, update, and delete views.",
  },
  {
    number: "02",
    title: "Role-specific decisions",
    description:
      "Buyers, suppliers, and administrators see different actions because each role carries different responsibilities and permissions.",
  },
  {
    number: "03",
    title: "Exceptions remain visible",
    description:
      "Rejected quantities, invoice decisions, disputes, refund reviews, and failed payments remain part of the commercial record.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHero
        eyebrow="About ProcuraX"
        title="Built for decisions people can defend."
        description="Procurement creates commitments between organizations. ProcuraX is designed to make those commitments clear, traceable, and easier for every participant to manage."
      >
        <Button asChild size="lg">
          <Link href="/platform">
            Explore the platform
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24 lg:px-10">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-amber text-ink">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <p className="eyebrow mt-8">Why it exists</p>
            <h2 className="section-title mt-5">Procurement deserves a shared source of truth.</h2>
          </div>
          <div className="space-y-7 text-lg leading-8 text-ink/60 lg:pt-20">
            <p>
              Important purchasing work often becomes fragmented across inboxes, spreadsheets, approval messages, and payment portals. The result is less confidence at the moments where confidence matters most.
            </p>
            <p>
              ProcuraX brings the commercial record together. Sourcing requirements, supplier responses, award decisions, purchase orders, delivered quantities, invoice reviews, and payments remain connected instead of becoming isolated documents.
            </p>
            <p className="border-l-2 border-amber pl-6 font-semibold text-ink">
              The goal is simple: help each role move quickly without losing accountability.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Product principles</p>
            <h2 className="section-title mt-5">The rules behind the interface.</h2>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <article className={`rounded-[1.75rem] p-7 sm:p-9 ${index === 0 ? "bg-teal text-white" : index === 3 ? "bg-amber text-ink" : "border border-ink/10 bg-white text-ink"}`} key={principle.title}>
                <principle.icon aria-hidden="true" className={`size-7 ${index === 0 ? "text-mint" : "text-teal"}`} />
                <h3 className="mt-12 text-2xl font-semibold tracking-[-0.035em]">{principle.title}</h3>
                <p className={`mt-4 max-w-lg text-sm leading-6 ${index === 0 ? "text-white/60" : "text-ink/55"}`}>
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <Layers3 aria-hidden="true" className="size-8 text-mint" />
              <p className="eyebrow mt-8 text-mint">How we think</p>
              <h2 className="section-title mt-5 text-white">A dashboard is not the product. The workflow is.</h2>
            </div>
            <div className="space-y-3">
              {foundations.map((foundation) => (
                <article className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.05] p-6 sm:grid-cols-[4rem_1fr] sm:p-7" key={foundation.number}>
                  <span className="font-mono text-xs font-bold tracking-[0.18em] text-mint">{foundation.number}</span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.025em]">{foundation.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">{foundation.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="eyebrow">See the principles in action</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
              Follow the complete procurement lifecycle.
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/platform">
              View platform
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
