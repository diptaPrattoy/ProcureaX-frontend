import { ArrowLeft, CreditCard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Checkout cancelled" };

export default function PaymentCancelPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-cream p-5" id="main-content" tabIndex={-1}>
      <div className="absolute inset-0 hero-grid" />
      <section className="relative w-full max-w-lg rounded-[2rem] border border-ink/10 bg-white p-7 shadow-xl sm:p-10">
        <Logo />
        <div className="mt-10 flex size-16 items-center justify-center rounded-2xl bg-amber/25 text-ink"><CreditCard className="size-8" /></div>
        <p className="eyebrow mt-7">No charge made</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink">Checkout cancelled.</h1>
        <p className="mt-4 leading-7 text-ink/55">Your payment was not completed. Return to the invoice whenever you are ready to resume its secure Stripe checkout.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><Button asChild size="lg"><Link href="/buyer/invoices"><ArrowLeft /> Back to invoices</Link></Button><Button asChild size="lg" variant="outline"><Link href="/buyer/payments">Payment history</Link></Button></div>
      </section>
    </main>
  );
}
