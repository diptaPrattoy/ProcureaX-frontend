"use client";

import { LoaderCircle, Undo2 } from "lucide-react";
import { useActionState } from "react";

import { withdrawQuotationAction, type WithdrawState } from "@/app/(workspace)/supplier/quotations/actions";
import { Button } from "@/components/ui/button";

const initial: WithdrawState = { status: "idle" };
export function WithdrawButton({ quotationId }: { quotationId: string }) { const [state, action, pending] = useActionState(withdrawQuotationAction, initial); return <div><form action={action}><input name="quotationId" type="hidden" value={quotationId} /><Button disabled={pending} size="sm" type="submit" variant="outline">{pending ? <LoaderCircle className="animate-spin" /> : <Undo2 />}{pending ? "Withdrawing..." : "Withdraw"}</Button></form>{state.message ? <p className={`mt-2 text-xs ${state.status === "error" ? "text-red-700" : "text-teal"}`}>{state.message}</p> : null}</div>; }
