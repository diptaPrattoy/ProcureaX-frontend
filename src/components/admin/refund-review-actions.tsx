"use client";

import { Check, LoaderCircle, RotateCcw, X } from "lucide-react";
import { useActionState } from "react";
import { adminRefundAction, type AdminActionState } from "@/app/(workspace)/admin-actions";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = { status: "idle" };
export function RefundReviewActions({ id, status }: { id: string; status: string }) { const [state, action, pending] = useActionState(adminRefundAction, initial); if (status !== "REQUESTED" && status !== "FAILED") return null; return <form action={action} className="rounded-[1.5rem] border border-ink/10 bg-white p-6"><input name="refundId" type="hidden" value={id} /><p className="font-bold">Administrator decision</p>{status === "REQUESTED" ? <textarea className="mt-4 min-h-24 w-full rounded-xl border border-ink/15 bg-cream p-4 text-sm outline-none" maxLength={1000} name="note" placeholder="Review note (required when rejecting)" /> : null}<div className="mt-4 flex flex-wrap gap-3">{status === "REQUESTED" ? <><Button disabled={pending} name="action" type="submit" value="approve">{pending ? <LoaderCircle className="animate-spin" /> : <Check />} Approve refund</Button><Button disabled={pending} name="action" type="submit" value="reject" variant="outline"><X /> Reject</Button></> : <Button disabled={pending} name="action" type="submit" value="retry"><RotateCcw /> Retry Stripe</Button>}</div>{state.message ? <p className={`mt-3 text-sm font-semibold ${state.status === "error" ? "text-red-700" : "text-teal"}`} role="status">{state.message}</p> : null}</form>; }
