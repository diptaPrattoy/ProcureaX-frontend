"use client";

import { Building2, LoaderCircle, ShieldCheck, Truck } from "lucide-react";
import { useActionState } from "react";

import { demoLoginAction } from "@/app/(auth)/login/actions";
import type { UserRole } from "@/lib/auth/contracts";
import type { DemoLoginActionState } from "@/lib/auth/form-state";

const initialState: DemoLoginActionState = { status: "idle" };

const demoRoles = [
  {
    role: "BUYER" as const,
    label: "Buyer",
    description: "Source and approve",
    icon: Building2,
  },
  {
    role: "SUPPLIER" as const,
    label: "Supplier",
    description: "Quote and deliver",
    icon: Truck,
  },
  {
    role: "ADMIN" as const,
    label: "Admin",
    description: "Verify and govern",
    icon: ShieldCheck,
  },
];

export function DemoAccess() {
  return (
    <div className="mt-8 border-t border-ink/10 pt-7">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-ink/10" />
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink/40">One-click evaluation access</p>
        <span className="h-px flex-1 bg-ink/10" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {demoRoles.map((item) => (
          <DemoRoleButton key={item.role} {...item} />
        ))}
      </div>
      <p className="mt-4 text-center text-xs leading-5 text-ink/40">
        Demo credentials stay on the server and are never sent to your browser.
      </p>
    </div>
  );
}

type DemoRoleButtonProps = {
  role: UserRole;
  label: string;
  description: string;
  icon: typeof Building2;
};

function DemoRoleButton({ role, label, description, icon: Icon }: DemoRoleButtonProps) {
  const [state, formAction, pending] = useActionState(demoLoginAction, initialState);

  return (
    <form action={formAction}>
      <input name="role" type="hidden" value={role} />
      <button
        className="group flex h-full min-h-24 w-full flex-col items-start rounded-2xl border border-ink/10 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-[0_16px_40px_-30px_rgba(8,127,117,0.7)] disabled:pointer-events-none disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-teal/8 text-teal">
          {pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Icon aria-hidden="true" className="size-4" />}
        </span>
        <span className="mt-3 text-sm font-bold text-ink">{pending ? "Opening…" : label}</span>
        <span className="mt-0.5 text-[0.68rem] text-ink/40">{description}</span>
      </button>
      {state.message ? <p className="mt-2 text-xs font-semibold leading-5 text-red-700" role="alert">{state.message}</p> : null}
    </form>
  );
}
