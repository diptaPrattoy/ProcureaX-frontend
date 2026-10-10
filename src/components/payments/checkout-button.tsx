"use client";

import { CreditCard, LoaderCircle, LockKeyhole } from "lucide-react";
import { useActionState } from "react";

import { startCheckoutAction, type CheckoutActionState } from "@/app/(workspace)/payment-actions";
import { Button } from "@/components/ui/button";

const initialState: CheckoutActionState = { status: "idle" };

export function CheckoutButton({ invoiceId, resume }: { invoiceId: string; resume: boolean }) {
  const [state, action, pending] = useActionState(startCheckoutAction, initialState);
  return (
    <form action={action} className="min-w-56">
      <input name="invoiceId" type="hidden" value={invoiceId} />
      <Button className="w-full" disabled={pending} size="lg" type="submit">
        {pending ? <LoaderCircle className="animate-spin" /> : <CreditCard />}
        {pending ? "Opening Stripe…" : resume ? "Resume Stripe checkout" : "Pay securely with Stripe"}
      </Button>
      <p className="mt-2 flex items-center justify-center gap-1 text-xs text-ink/40"><LockKeyhole className="size-3" /> Secure checkout powered by Stripe</p>
      {state.status === "error" ? <p className="mt-2 text-center text-xs font-semibold text-red-700" role="alert">{state.message}</p> : null}
    </form>
  );
}
