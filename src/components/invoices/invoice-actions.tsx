"use client";

import { Check, LoaderCircle, SearchCheck, X } from "lucide-react";
import { useActionState } from "react";

import { invoiceTransitionAction, type InvoiceActionState } from "@/app/(workspace)/invoice-actions";
import { Button } from "@/components/ui/button";
import type { InvoiceDetail } from "@/lib/invoices/contracts";

const initial: InvoiceActionState = { status: "idle" };
export function InvoiceActions({ invoice, role }: { invoice: InvoiceDetail; role: "BUYER" | "SUPPLIER" }) { if (role === "BUYER" && invoice.status === "SUBMITTED") return <Action id={invoice.id} action="start-review" icon={SearchCheck} label="Start review" />; if (role === "BUYER" && invoice.status === "UNDER_REVIEW") return <div className="flex flex-col gap-3 sm:items-end"><div className="flex gap-3"><Action id={invoice.id} action="approve" icon={Check} label="Approve" /><Reject id={invoice.id} /></div></div>; if (role === "SUPPLIER" && invoice.status === "SUBMITTED") return <Action id={invoice.id} action="cancel" icon={X} label="Cancel invoice" variant="outline" />; return null; }
function Action({ id, action, icon: Icon, label, variant = "default" }: { id: string; action: string; icon: typeof Check; label: string; variant?: "default" | "outline" }) { const [state, formAction, pending] = useActionState(invoiceTransitionAction, initial); return <div><form action={formAction}><input name="invoiceId" type="hidden" value={id} /><input name="action" type="hidden" value={action} /><Button disabled={pending} type="submit" variant={variant}>{pending ? <LoaderCircle className="animate-spin" /> : <Icon />}{pending ? "Updating..." : label}</Button></form>{state.message ? <p className={`mt-2 text-xs ${state.status === "error" ? "text-red-700" : "text-teal"}`}>{state.message}</p> : null}</div>; }
function Reject({ id }: { id: string }) { const [state, formAction, pending] = useActionState(invoiceTransitionAction, initial); return <form action={formAction} className="flex flex-col items-end gap-2"><input name="invoiceId" type="hidden" value={id} /><input name="action" type="hidden" value="reject" /><input className="h-10 w-56 rounded-xl border border-ink/15 bg-white px-3 text-sm" maxLength={500} minLength={5} name="reason" placeholder="Rejection reason" required /><Button disabled={pending} type="submit" variant="outline">{pending ? <LoaderCircle className="animate-spin" /> : <X />}{pending ? "Rejecting..." : "Reject"}</Button>{state.message ? <p className={`text-xs ${state.status === "error" ? "text-red-700" : "text-teal"}`}>{state.message}</p> : null}</form>; }
