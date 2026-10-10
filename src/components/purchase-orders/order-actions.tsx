"use client";

import { Check, LoaderCircle, PackageCheck, X } from "lucide-react";
import { useActionState } from "react";

import { purchaseOrderAction, type OrderActionState } from "@/app/(workspace)/purchase-order-actions";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/auth/contracts";
import type { PurchaseOrderStatus } from "@/lib/purchase-orders/contracts";

const initial: OrderActionState = { status: "idle" };
export function OrderActions({ id, role, status }: { id: string; role: UserRole; status: PurchaseOrderStatus }) {
  if (role === "SUPPLIER" && status === "ISSUED") return <div className="flex flex-wrap gap-3"><TransitionButton action="accept" icon={Check} label="Accept order" orderId={id} /><TransitionButton action="reject" icon={X} label="Reject" orderId={id} variant="outline" /></div>;
  if (role === "SUPPLIER" && status === "ACCEPTED") return <TransitionButton action="start-fulfillment" icon={PackageCheck} label="Start fulfillment" orderId={id} />;
  if (role === "BUYER" && status === "ISSUED") return <TransitionButton action="cancel" icon={X} label="Cancel order" orderId={id} variant="outline" />;
  return null;
}
function TransitionButton({ action, icon: Icon, label, orderId, variant = "default" }: { action: "accept" | "reject" | "start-fulfillment" | "cancel"; icon: typeof Check; label: string; orderId: string; variant?: "default" | "outline" }) { const [state, formAction, pending] = useActionState(purchaseOrderAction, initial); return <div><form action={formAction}><input name="purchaseOrderId" type="hidden" value={orderId} /><input name="action" type="hidden" value={action} /><Button disabled={pending} type="submit" variant={variant}>{pending ? <LoaderCircle className="animate-spin" /> : <Icon />}{pending ? "Updating..." : label}</Button></form>{state.message ? <p className={`mt-2 max-w-48 text-xs ${state.status === "error" ? "text-red-700" : "text-teal"}`} role="status">{state.message}</p> : null}</div>; }
