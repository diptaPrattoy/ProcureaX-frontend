import type { Metadata } from "next";
import { ArrowRight, BadgeHelp, Landmark, LogIn, Store } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find the right ProcuraX onboarding or support path for buyers, suppliers, and existing platform users.",
};

const supportPaths = [
  {
    icon: Landmark,
    title: "I purchase for an organization",
    description:
      "Create a buyer account to prepare RFQs, compare supplier offers, manage orders, and review invoices.",
    action: "Register as a buyer",
    href: "/register?role=buyer",
    tone: "bg-teal text-white",
  },
  {
    icon: Store,
    title: "I supply goods or services",
    description:
      "Create a supplier account, complete your company profile, select categories, and begin verification.",
    action: "Register as a supplier",
    href: "/register?role=supplier",
    tone: "bg-amber text-ink",
  },
  {
    icon: LogIn,
    title: "I already have an account",
    description:
      "Sign in to reach your role-specific workspace, notifications, activity history, and active procurement records.",
    action: "Sign in",
    href: "/login",
    tone: "bg-ink text-white",
  },
] as const;

const preparation = [
  "Choose whether you are joining as a buyer or supplier.",
  "Use a work email that can receive verification messages.",
  "Suppliers should have company registration and category details ready.",
  "For workflow questions, review the platform overview and FAQ first.",
] as const;

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHero
        eyebrow="Contact and onboarding"
        title="Start in the right place."
        description="ProcuraX routes each organization through the account and support path that matches its role. Choose your path below, or review common questions before getting started."
      >
        <Button asChild size="lg">
          <Link href="#support-paths">
            Find your path
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/faq">Read the FAQ</Link>
        </Button>
      </PageHero>

      <section className="bg-white py-24 sm:py-32" id="support-paths">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Choose a support path</p>
            <h2 className="section-title mt-5">Tell us where you are starting.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/60">
              Each option leads to the correct account flow so the platform can apply the right permissions and onboarding requirements.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {supportPaths.map((path, index) => (
              <article className={`group flex min-h-[27rem] flex-col rounded-[1.75rem] p-7 sm:p-8 ${path.tone}`} key={path.title}>
                <path.icon aria-hidden="true" className={`size-7 ${index === 1 ? "text-teal" : "text-mint"}`} />
                <div className="mt-auto">
                  <p className={`text-xs font-bold uppercase tracking-[0.15em] ${index === 1 ? "text-ink/45" : "text-white/45"}`}>
                    Path 0{index + 1}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em]">{path.title}</h3>
                  <p className={`mt-4 text-sm leading-6 ${index === 1 ? "text-ink/60" : "text-white/55"}`}>{path.description}</p>
                  <Link className={`mt-7 inline-flex items-center gap-2 text-sm font-bold ${index === 1 ? "text-ink" : "text-white"}`} href={path.href}>
                    {path.action}
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-teal shadow-sm">
              <BadgeHelp aria-hidden="true" className="size-5" />
            </span>
            <p className="eyebrow mt-8">Before onboarding</p>
            <h2 className="section-title mt-5">A few things worth preparing.</h2>
          </div>
          <ol className="space-y-3 lg:pt-4">
            {preparation.map((item, index) => (
              <li className="flex gap-5 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6" key={item}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal/10 font-mono text-xs font-bold text-teal">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-medium leading-6 text-ink/65">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink py-20 text-white sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="eyebrow text-mint">Need workflow context first?</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              See how each procurement stage connects.
            </h2>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/platform">
              Explore platform
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
