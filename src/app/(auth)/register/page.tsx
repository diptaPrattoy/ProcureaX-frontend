import type { Metadata } from "next";
import { ArrowLeft, Building2, Check, FileCheck2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { RegistrationForm } from "@/components/auth/registration-form";
import { RegistrationSuccessPanel } from "@/components/auth/registration-success-panel";
import { Logo } from "@/components/brand/logo";
import { getCurrentUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a ProcuraX buyer or supplier account.",
};

type RegisterPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const benefits = ["One accountable procurement record", "Secure role-based workspace", "Clear activity and decision trails"];

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <main className="min-h-svh bg-cream">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Logo />
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-ink/55 transition hover:text-teal" href="/"><ArrowLeft className="size-4" /> Back to site</Link>
      </header>
      <Suspense fallback={<RegistrationSkeleton />}>
        <RegistrationExperience searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function RegistrationExperience({ searchParams }: RegisterPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (user) return <div className="mx-auto max-w-xl px-5 py-16"><RegistrationSuccessPanel user={user} /></div>;

  const role = params.role === "supplier" ? "SUPPLIER" : "BUYER";
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:px-10 lg:pb-24 lg:pt-14">
      <section className="lg:sticky lg:top-16 lg:self-start">
        <p className="eyebrow">Join the network</p>
        <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-ink sm:text-6xl">Build better business, from the first request.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-ink/55">Choose how your organization participates, then create a secure workspace connected to the ProcuraX API.</p>
        <ul className="mt-8 space-y-4">
          {benefits.map((benefit) => <li className="flex items-center gap-3 text-sm font-semibold text-ink/65" key={benefit}><span className="flex size-7 items-center justify-center rounded-full bg-mint/50 text-teal"><Check className="size-4" /></span>{benefit}</li>)}
        </ul>
      </section>

      <section className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-[0_30px_100px_-50px_rgba(13,30,28,0.35)] sm:p-8 lg:p-10">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-cream p-1.5">
          <RoleLink active={role === "BUYER"} href="/register?role=buyer" icon={ShoppingBag} label="Buyer" />
          <RoleLink active={role === "SUPPLIER"} href="/register?role=supplier" icon={Building2} label="Supplier" />
        </div>
        <div className="mt-8 flex items-start justify-between gap-5">
          <div><p className="eyebrow">{role === "BUYER" ? "Source with clarity" : "Win the right work"}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">Create your {role.toLowerCase()} account.</h2></div>
          <FileCheck2 className="hidden size-7 text-teal sm:block" />
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/50">{role === "BUYER" ? "Publish needs, compare qualified responses, and manage awards." : "Present your company, respond to opportunities, and manage delivery."}</p>
        <RegistrationForm key={role} role={role} />
        <p className="mt-6 text-center text-sm text-ink/50">Already registered? <Link className="font-bold text-teal hover:underline" href="/login">Sign in</Link></p>
      </section>
    </div>
  );
}

function RoleLink({ active, href, icon: Icon, label }: { active: boolean; href: string; icon: typeof ShoppingBag; label: string }) {
  return <Link aria-current={active ? "page" : undefined} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition", active ? "bg-ink text-white shadow-sm" : "text-ink/50 hover:text-ink")} href={href}><Icon className="size-4" />{label}</Link>;
}

function RegistrationSkeleton() {
  return <div aria-label="Loading registration" className="mx-auto grid max-w-7xl animate-pulse gap-12 px-5 py-16 lg:grid-cols-2"><div className="h-72 rounded-[2rem] bg-ink/5" /><div className="h-[42rem] rounded-[2rem] bg-white" /></div>;
}
