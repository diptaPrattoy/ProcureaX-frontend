"use client";

import { CircleAlert, LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { openDisputeAction, type CaseActionState } from "@/app/(workspace)/case-actions";
import { Button } from "@/components/ui/button";

const initial: CaseActionState = { status: "idle" };
export function OpenDisputeForm({ target, targetId }: { target: "invoices" | "purchase-orders"; targetId: string }) { const [state, action, pending] = useActionState(openDisputeAction, initial); return <details className="mt-6 rounded-2xl border border-ink/10 bg-white p-5"><summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-ink/65"><CircleAlert className="size-4 text-amber-600" /> Report a transaction issue</summary><form action={action} className="mt-5 grid gap-3"><input name="target" type="hidden" value={target} /><input name="targetId" type="hidden" value={targetId} /><input className="h-11 rounded-xl border border-ink/15 bg-cream px-4 text-sm outline-none" maxLength={160} minLength={5} name="subject" placeholder="Short issue summary" required /><textarea className="min-h-28 rounded-xl border border-ink/15 bg-cream p-4 text-sm outline-none" maxLength={5000} minLength={20} name="description" placeholder="Describe what happened, expected outcome, and useful context…" required /><Button className="justify-self-start" disabled={pending} type="submit" variant="outline">{pending ? <LoaderCircle className="animate-spin" /> : <CircleAlert />}{pending ? "Opening…" : "Open dispute"}</Button>{state.status === "error" ? <p className="text-sm font-semibold text-red-700" role="alert">{state.message}</p> : null}</form></details>; }
