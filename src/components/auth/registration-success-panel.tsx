import { BadgeCheck, LogOut, MailCheck } from "lucide-react";

import { logoutAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import type { PublicUser } from "@/lib/auth/contracts";

export function RegistrationSuccessPanel({ user }: { user: PublicUser }) {
  const supplierPending = user.role === "SUPPLIER" && user.supplierProfile?.verificationStatus === "PENDING";
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-[0_24px_80px_-40px_rgba(13,30,28,0.35)] sm:p-10">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-mint/35 text-teal"><BadgeCheck className="size-7" /></span>
      <p className="eyebrow mt-7">Account created</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink">Welcome, {user.firstName}.</h1>
      <p className="mt-4 leading-7 text-ink/55">
        {supplierPending ? "Your supplier workspace is ready and your company profile is awaiting verification." : "Your buyer workspace is ready for the next stage of procurement."}
      </p>
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-cream p-4 text-sm leading-6 text-ink/60">
        <MailCheck className="mt-1 size-4 shrink-0 text-teal" />
        <p>We sent a verification link to <strong className="text-ink">{user.email}</strong>.</p>
      </div>
      <form action={logoutAction} className="mt-7">
        <Button className="w-full" type="submit" variant="outline"><LogOut /> Sign out</Button>
      </form>
    </div>
  );
}
