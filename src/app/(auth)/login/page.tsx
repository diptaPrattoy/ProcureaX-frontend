import type { Metadata } from "next";
import { ArrowLeft, BadgeCheck, GitBranch, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { AuthenticatedPanel } from "@/components/auth/authenticated-panel";
import { DemoAccess } from "@/components/auth/demo-access";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/brand/logo";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in securely to your ProcuraX buyer, supplier, or administrator workspace.",
};

const trustPoints = [
  { icon: LockKeyhole, label: "HttpOnly session cookies" },
  { icon: GitBranch, label: "Rotating refresh tokens" },
  { icon: ShieldCheck, label: "Role checks at every boundary" },
] as const;

type LoginPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="grid min-h-svh bg-cream lg:grid-cols-[0.82fr_1.18fr]">
      <section className="relative hidden overflow-hidden bg-ink px-10 py-12 text-white lg:flex lg:flex-col xl:px-16 xl:py-14">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -right-40 top-1/4 size-[30rem] rounded-full bg-teal/35 blur-3xl" />
        <Logo className="relative z-10 text-white" />

        <div className="relative z-10 my-auto max-w-xl py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-3 py-1.5 text-xs font-bold text-mint">
            <BadgeCheck aria-hidden="true" className="size-4" />
            Secure procurement access
          </span>
          <h2 className="mt-8 text-[clamp(3.5rem,5.5vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
            Pick up where the deal left off.
          </h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/55">
            Return to sourcing, quotations, orders, deliveries, invoices, and decisions—all in one accountable record.
          </p>

          <ul className="mt-10 space-y-4">
            {trustPoints.map((point) => (
              <li className="flex items-center gap-3 text-sm font-semibold text-white/70" key={point.label}>
                <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-mint">
                  <point.icon aria-hidden="true" className="size-4" />
                </span>
                {point.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
          Buyer · Supplier · Administrator
        </p>
      </section>

      <section className="relative flex min-h-svh items-center px-5 py-24 sm:px-8 lg:px-14 xl:px-20">
        <div className="absolute left-5 top-6 sm:left-8 lg:left-14 lg:top-10 xl:left-20">
          <Logo className="lg:hidden" />
        </div>
        <Link className="absolute right-5 top-7 inline-flex items-center gap-2 text-sm font-bold text-ink/55 transition hover:text-teal sm:right-8 lg:right-14 lg:top-11 xl:right-20" href="/">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to site
        </Link>

        <div className="mx-auto w-full max-w-[36rem]">
          <Suspense fallback={<LoginPanelSkeleton />}>
            <LoginExperience searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function LoginExperience({ searchParams }: LoginPageProps) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  if (user) return <AuthenticatedPanel user={user} />;

  const nextPath = typeof params.next === "string" && params.next.startsWith("/") && !params.next.startsWith("//")
    ? params.next
    : undefined;

  return (
    <div>
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] text-ink sm:text-6xl">Sign in to ProcuraX.</h1>
      <p className="mt-4 max-w-lg text-base leading-7 text-ink/55">
        Use your account details, or open a role workspace instantly for evaluation.
      </p>
      <LoginForm nextPath={nextPath} />
      <DemoAccess />
      <p className="mt-7 text-center text-sm text-ink/50">
        New to ProcuraX?{" "}
        <Link className="font-bold text-teal underline-offset-4 hover:underline" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function LoginPanelSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading sign-in" className="animate-pulse">
      <div className="h-4 w-32 rounded-full bg-teal/15" />
      <div className="mt-6 h-16 max-w-md rounded-3xl bg-ink/10" />
      <div className="mt-8 h-13 rounded-xl bg-white" />
      <div className="mt-5 h-13 rounded-xl bg-white" />
      <div className="mt-5 h-13 rounded-xl bg-teal/15" />
    </div>
  );
}
