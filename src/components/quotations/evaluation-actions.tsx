"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Award, LoaderCircle, Play, X } from "lucide-react";
import { useActionState, useState } from "react";

import { awardQuotationAction, startEvaluationAction, type EvaluationActionState } from "@/app/(workspace)/buyer/rfqs/[rfqId]/quotations/actions";
import { Button } from "@/components/ui/button";

const initial: EvaluationActionState = { status: "idle" };

export function StartEvaluationButton({ rfqId }: { rfqId: string }) {
  const [state, action, pending] = useActionState(startEvaluationAction, initial);
  return <div><form action={action}><input name="rfqId" type="hidden" value={rfqId} /><Button disabled={pending} size="lg" type="submit">{pending ? <LoaderCircle className="animate-spin" /> : <Play />}{pending ? "Starting..." : "Start evaluation"}</Button></form>{state.message ? <p className={`mt-2 text-xs font-semibold ${state.status === "error" ? "text-red-700" : "text-teal"}`} role="status">{state.message}</p> : null}</div>;
}

export function AwardQuotationButton({ company, quotationId, rfqId, total }: { company: string; quotationId: string; rfqId: string; total: string }) {
  const [open, setOpen] = useState(false); const [state, action, pending] = useActionState(awardQuotationAction, initial);
  return <Dialog.Root onOpenChange={setOpen} open={open}><Dialog.Trigger asChild><Button size="sm"><Award /> Award</Button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm" /><Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] bg-white p-7 shadow-2xl outline-none"><div className="flex items-start justify-between gap-5"><div><p className="eyebrow">Final decision</p><Dialog.Title className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">Award to {company}?</Dialog.Title></div><Dialog.Close asChild><Button aria-label="Close" size="icon" variant="ghost"><X /></Button></Dialog.Close></div><Dialog.Description className="mt-4 text-sm leading-6 text-ink/55">This creates a purchase order for <strong className="text-ink">{total}</strong>, awards this quotation, and rejects the other active quotations. This action cannot be undone.</Dialog.Description>{state.message ? <p className={`mt-4 rounded-xl p-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-800" : "bg-mint/30 text-teal"}`} role="status">{state.message}{state.poNumber ? ` PO: ${state.poNumber}` : ""}</p> : null}<form action={action} className="mt-6 flex justify-end gap-3"><input name="rfqId" type="hidden" value={rfqId} /><input name="quotationId" type="hidden" value={quotationId} /><Dialog.Close asChild><Button type="button" variant="ghost">Cancel</Button></Dialog.Close><Button disabled={pending} type="submit">{pending ? <LoaderCircle className="animate-spin" /> : <Award />}{pending ? "Issuing PO..." : "Confirm award"}</Button></form></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
