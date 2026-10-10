import { CircleCheckBig, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment submitted" };

export default function PaymentSuccessPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink p-5">
      <div className="absolute inset-0 hero-grid opacity-20" />
      <div className="absolute -right-24 -top-24 size-80 rounded-full bg-mint/15 blur-3xl" />
      <section className="relative w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl sm:p-10">
        <Logo />
        <div className="mt-10 flex size-16 items-center justify-center rounded-2xl bg-mint/35 text-teal"><CircleCheckBig className="size-8" /></div>
        <p className="eyebrow mt-7">Checkout complete</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink">Payment submitted.</h1>
        <p className="mt-4 leading-7 text-ink/55">Stripe accepted the checkout. ProcuraX will mark the invoice paid as soon as the secure confirmation arrives.</p>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-cream p-4 text-sm text-ink/55"><Clock3 className="mt-0.5 size-4 shrink-0 text-teal" /><p>This normally takes a few moments. Your payment history always shows the latest status.</p></div>
        <Button asChild className="mt-7 w-full" size="lg"><Link href="/buyer/payments">View payment history</Link></Button>
      </section>
    </main>
  );
}
