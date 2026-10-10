import type { Metadata } from "next";
import { ArrowRight, Building2, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/access";

export const metadata: Metadata = { title: "Workspace" };

const roleDetails = {
  BUYER: { icon: Building2, label: "Buyer", destination: "/buyer", next: "Create and manage sourcing events" },
  SUPPLIER: { icon: Truck, label: "Supplier", destination: "/supplier", next: "Discover opportunities and submit quotations" },
  ADMIN: { icon: ShieldCheck, label: "Administrator", destination: "/admin", next: "Review platform operations and supplier verification" },
} as const;

export default function WorkspacePage() {
  return (
    <main className="grid min-h-svh place-items-center bg-cream px-5 py-16">
      <Suspense fallback={<div className="h-96 w-full max-w-2xl animate-pulse rounded-[2rem] bg-white" />}>
        <WorkspaceAccess />
      </Suspense>
    </main>
  );
}

async function WorkspaceAccess() {
  const user = await requireUser("/workspace");
  const details = roleDetails[user.role];
  const Icon = details.icon;

  return (
    <section className="w-full max-w-2xl rounded-[2rem] border border-ink/10 bg-white p-8 shadow-[0_30px_100px_-50px_rgba(13,30,28,0.35)] sm:p-12">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-teal text-white"><Icon className="size-6" /></span>
        <p className="eyebrow mt-7">Protected workspace</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Welcome, {user.firstName}.</h1>
        <p className="mt-4 text-base leading-7 text-ink/55">Your authenticated {details.label.toLowerCase()} session is active. {details.next} from your role-specific dashboard.</p>
        <div className="mt-7 rounded-2xl bg-cream p-4 text-sm"><span className="font-bold text-ink">Access:</span> <span className="text-ink/55">{details.label} only</span></div>
        <Button asChild className="mt-7" size="lg"><Link href={details.destination}>Continue to dashboard <ArrowRight /></Link></Button>
        <p className="mt-4 text-xs text-ink/40">The full dashboard shell arrives in Commit 9.</p>
    </section>
  );
}
