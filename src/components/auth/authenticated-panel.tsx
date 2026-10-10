import { ArrowRight, BadgeCheck, Building2, LogOut, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

import { logoutAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import type { PublicUser } from "@/lib/auth/contracts";

const roleDetails = {
  BUYER: { label: "Buyer workspace", icon: Building2 },
  SUPPLIER: { label: "Supplier workspace", icon: Truck },
  ADMIN: { label: "Administration workspace", icon: ShieldCheck },
} as const;

export function AuthenticatedPanel({ user }: { user: PublicUser }) {
  const role = roleDetails[user.role];
  const RoleIcon = role.icon;

  return (
    <div className="rounded-[2rem] border border-teal/15 bg-white p-7 shadow-[0_28px_90px_-60px_rgba(16,47,45,0.55)] sm:p-9">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-teal text-white shadow-sm shadow-teal/20">
        <BadgeCheck aria-hidden="true" className="size-6" />
      </span>
      <p className="eyebrow mt-7">Session active</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
        Welcome back, {user.firstName}.
      </h1>
      <p className="mt-4 text-sm leading-6 text-ink/55">
        You are securely signed in as <span className="font-semibold text-ink">{user.email}</span>.
      </p>

      <div className="mt-7 flex items-center gap-4 rounded-2xl border border-ink/10 bg-cream p-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-amber/30 text-ink">
          <RoleIcon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">{role.label}</p>
          <p className="mt-0.5 text-xs text-ink/45">Account status: {user.status.toLowerCase()}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Button asChild size="lg">
          <Link href="/workspace">
            Open workspace
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <form action={logoutAction}>
          <Button className="w-full" size="lg" type="submit" variant="outline">
            <LogOut aria-hidden="true" />
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
