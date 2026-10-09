import type { Metadata } from "next";
import { ArrowRight, CircleHelp, Plus } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about ProcuraX roles, supplier verification, RFQs, receiving, invoicing, Stripe payments, refunds, and disputes.",
};

const faqGroups = [
  {
    category: "Accounts and access",
    questions: [
      {
        question: "Which account type should I choose?",
        answer:
          "Choose Buyer if your organization creates RFQs, evaluates quotations, receives goods, and pays invoices. Choose Supplier if your organization responds to opportunities, fulfills purchase orders, and submits invoices. Administrator accounts are provisioned for platform operations.",
      },
      {
        question: "Why does a supplier need verification?",
        answer:
          "Supplier verification protects the sourcing network. An administrator reviews supplier onboarding information before the supplier can participate in eligible procurement opportunities.",
      },
      {
        question: "Can one account act as both buyer and supplier?",
        answer:
          "ProcuraX uses fixed primary roles so permissions and ownership stay unambiguous. A user account is assigned Buyer, Supplier, or Administrator access rather than switching roles inside the same account.",
      },
    ],
  },
  {
    category: "Sourcing and fulfillment",
    questions: [
      {
        question: "What happens after an RFQ is published?",
        answer:
          "Published RFQs become available to eligible verified suppliers. Suppliers can submit one quotation per RFQ before the deadline, and the buyer can later start evaluation and award a winning quotation.",
      },
      {
        question: "How is a purchase order created?",
        answer:
          "Awarding a quotation creates the purchase order automatically. The award, competing quotation outcomes, RFQ status, purchase order, and audit events are written within one transaction so the commercial record cannot be left partially updated.",
      },
      {
        question: "Does ProcuraX support partial deliveries?",
        answer:
          "Yes. Buyers can record multiple goods receipts against a purchase order. Each receipt records received, accepted, and rejected quantities while preventing quantities from exceeding the order.",
      },
    ],
  },
  {
    category: "Invoices and payments",
    questions: [
      {
        question: "What quantities can a supplier invoice?",
        answer:
          "Invoices are backed by goods receipts. A supplier can invoice accepted quantities that have not already been invoiced, which prevents invoicing ahead of verified delivery or invoicing the same quantity twice.",
      },
      {
        question: "Are payments simulated?",
        answer:
          "No. Approved invoices use Stripe Checkout. The backend controls the payment amount, tracks the checkout session and PaymentIntent, and reconciles status using signed Stripe webhook events.",
      },
      {
        question: "How do refunds and disputes work?",
        answer:
          "A buyer can request a partial or full refund against an eligible payment, and an administrator reviews the request before Stripe processing. Buyers and suppliers can also open disputes tied to a purchase order or invoice for administrator review and resolution.",
      },
    ],
  },
] as const;

export default function FaqPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHero
        eyebrow="Frequently asked questions"
        title="Clear answers before the next action."
        description="Understand the roles, controls, and commercial workflows that shape how ProcuraX moves procurement from sourcing to settlement."
      >
        <Button asChild size="lg">
          <Link href="/platform">
            Explore the platform
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.5fr_1fr] lg:gap-20">
            <div>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-amber text-ink">
                <CircleHelp aria-hidden="true" className="size-5" />
              </span>
              <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-ink">Browse by topic</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-ink/55">
                These answers reflect the platform’s implemented permissions and business rules, not generic procurement assumptions.
              </p>
              <nav className="mt-8 hidden space-y-2 lg:block" aria-label="FAQ categories">
                {faqGroups.map((group, index) => (
                  <a className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-ink/55 transition-colors hover:bg-cream hover:text-teal" href={`#faq-${index + 1}`} key={group.category}>
                    <span className="font-mono text-[0.65rem] text-ink/30">0{index + 1}</span>
                    {group.category}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-12">
              {faqGroups.map((group, groupIndex) => (
                <section id={`faq-${groupIndex + 1}`} key={group.category}>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-teal">{group.category}</p>
                  <div className="divide-y divide-ink/10 border-y border-ink/10">
                    {group.questions.map((item) => (
                      <details className="group" key={item.question}>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-semibold tracking-[-0.02em] text-ink [&::-webkit-details-marker]:hidden">
                          {item.question}
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-cream text-teal transition-transform group-open:rotate-45">
                            <Plus aria-hidden="true" className="size-4" />
                          </span>
                        </summary>
                        <p className="max-w-2xl pb-7 pr-12 text-sm leading-7 text-ink/55">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="eyebrow">Ready to choose your path?</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
              Find the onboarding route for your organization.
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">
              View onboarding paths
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
