"use client";

import { LoaderCircle, RotateCcw } from "lucide-react";
import { useActionState } from "react";
import { requestRefundAction, type CaseActionState } from "@/app/(workspace)/case-actions";
import { Button } from "@/components/ui/button";

const initial: CaseActionState = { status: "idle" };
export function RefundRequestForm({ paymentId, amount, currency }: { paymentId: string; amount: string | number; currency: string }) {
  const [state, action, pending] = useActionState(requestRefundAction, initial);
  return <details className="mt-5 rounded-[1.5rem] border border-ink/10 bg-white p-6"><summary className="flex cursor-pointer list-none items-center justify-between font-bold text-ink"><span className="flex items-center gap-2"><RotateCcw className="size-4 text-teal" /> Request a refund</span><span className="text-xs text-ink/40">Up to {money(amount, currency)}</span></summary><form action={action} className="mt-5 grid gap-4"><input name="paymentId" type="hidden" value={paymentId} /><label className="grid gap-2 text-sm font-bold">Amount <span className="text-xs font-normal text-ink/40">Leave blank to request the full remaining balance.</span><input className="h-11 rounded-xl border border-ink/15 bg-cream px-4 font-normal outline-none" max={Number(amount)} min="0.01" name="amount" placeholder={String(amount)} step="0.01" type="number" /></label><label className="grid gap-2 text-sm font-bold">Reason<textarea className="min-h-28 resize-y rounded-xl border border-ink/15 bg-cream p-4 font-normal outline-none" maxLength={1000} minLength={10} name="reason" placeholder="Explain why this payment should be refunded…" required /></label><Button disabled={pending} type="submit">{pending ? <LoaderCircle className="animate-spin" /> : <RotateCcw />}{pending ? "Submitting…" : "Submit refund request"}</Button>{state.status === "error" ? <p className="text-sm font-semibold text-red-700" role="alert">{state.message}</p> : null}</form></details>;
}
function money(value: string | number, currency: string) { return new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(value)); }
