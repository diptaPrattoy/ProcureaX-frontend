"use client";

import { Check, LoaderCircle, X } from "lucide-react";
import { useActionState } from "react";
import { supplierVerificationAction, type AdminActionState } from "@/app/(workspace)/admin-actions";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = { status: "idle" };
export function SupplierReviewActions({ id, status }: { id: string; status: string }) { const [state, action, pending] = useActionState(supplierVerificationAction, initial); return <form action={action} className="mt-5 grid gap-3"><input name="supplierId" type="hidden" value={id} /><textarea className="min-h-20 rounded-xl border border-ink/15 bg-cream p-3 text-sm outline-none" maxLength={500} name="note" placeholder="Decision note (required for rejection)" /><div className="flex flex-wrap gap-2"><Button disabled={pending || status === "VERIFIED"} name="status" type="submit" value="VERIFIED">{pending ? <LoaderCircle className="animate-spin" /> : <Check />} Verify</Button><Button disabled={pending || status === "REJECTED"} name="status" type="submit" value="REJECTED" variant="outline"><X /> Reject</Button></div>{state.message ? <p className={`text-xs font-semibold ${state.status === "error" ? "text-red-700" : "text-teal"}`} role="status">{state.message}</p> : null}</form>; }
