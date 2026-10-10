"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole, requireUser } from "@/lib/auth/access";
import { DisputeApiError, openDispute } from "@/lib/disputes/api";
import { openDisputeSchema } from "@/lib/disputes/contracts";
import { cancelRefund, RefundApiError, requestRefund } from "@/lib/refunds/api";
import { requestRefundSchema } from "@/lib/refunds/contracts";

export type CaseActionState = { status: "idle" | "error"; message?: string };

export async function requestRefundAction(_state: CaseActionState, formData: FormData): Promise<CaseActionState> {
  const paymentId = String(formData.get("paymentId") ?? "");
  await requireRole(["BUYER"], `/buyer/payments/${paymentId}`);
  const rawAmount = String(formData.get("amount") ?? "").trim();
  const parsed = requestRefundSchema.safeParse({ amount: rawAmount ? rawAmount : undefined, reason: formData.get("reason") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the refund details." };
  let refundId: string;
  try { refundId = (await requestRefund(paymentId, parsed.data)).id; } catch (error) { return { status: "error", message: error instanceof RefundApiError ? error.message : "The refund could not be requested." }; }
  revalidatePath("/buyer/refunds"); revalidatePath(`/buyer/payments/${paymentId}`); redirect(`/buyer/refunds/${refundId}`);
}

export async function cancelRefundAction(formData: FormData) {
  const refundId = String(formData.get("refundId") ?? "");
  await requireRole(["BUYER"], `/buyer/refunds/${refundId}`);
  try { await cancelRefund(refundId); } catch { return; }
  revalidatePath("/buyer/refunds"); revalidatePath(`/buyer/refunds/${refundId}`);
}

export async function openDisputeAction(_state: CaseActionState, formData: FormData): Promise<CaseActionState> {
  const user = await requireUser();
  if (user.role !== "BUYER" && user.role !== "SUPPLIER") return { status: "error", message: "Only transaction participants can open disputes." };
  const target = String(formData.get("target") ?? ""); const targetId = String(formData.get("targetId") ?? "");
  if (target !== "invoices" && target !== "purchase-orders") return { status: "error", message: "Invalid dispute target." };
  const parsed = openDisputeSchema.safeParse({ subject: formData.get("subject"), description: formData.get("description") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the dispute details." };
  let disputeId: string;
  try { disputeId = (await openDispute(target, targetId, parsed.data)).id; } catch (error) { return { status: "error", message: error instanceof DisputeApiError ? error.message : "The dispute could not be opened." }; }
  const base = `/${user.role.toLowerCase()}/disputes`; revalidatePath(base); redirect(`${base}/${disputeId}`);
}
