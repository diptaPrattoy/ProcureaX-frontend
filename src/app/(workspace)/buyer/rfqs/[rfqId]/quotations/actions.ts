"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access";
import { awardQuotation, QuotationApiError, startRfqEvaluation } from "@/lib/quotations/api";

export type EvaluationActionState = { status: "idle" | "error" | "success"; message?: string; poNumber?: string };

function errorMessage(error: unknown) { return error instanceof QuotationApiError ? error.message : "The request could not be completed."; }

export async function startEvaluationAction(_state: EvaluationActionState, formData: FormData): Promise<EvaluationActionState> {
  const rfqId = String(formData.get("rfqId") ?? "");
  await requireRole(["BUYER"], `/buyer/rfqs/${rfqId}/quotations`);
  try { await startRfqEvaluation(rfqId); }
  catch (error) { return { status: "error", message: errorMessage(error) }; }
  revalidatePath(`/buyer/rfqs/${rfqId}`); revalidatePath(`/buyer/rfqs/${rfqId}/quotations`); revalidatePath("/buyer/quotations");
  return { status: "success", message: "Evaluation started. Eligible quotations are now under review." };
}

export async function awardQuotationAction(_state: EvaluationActionState, formData: FormData): Promise<EvaluationActionState> {
  const rfqId = String(formData.get("rfqId") ?? ""); const quotationId = String(formData.get("quotationId") ?? "");
  await requireRole(["BUYER"], `/buyer/rfqs/${rfqId}/quotations`);
  try { const purchaseOrder = await awardQuotation(rfqId, quotationId); revalidatePath(`/buyer/rfqs/${rfqId}`); revalidatePath(`/buyer/rfqs/${rfqId}/quotations`); revalidatePath("/buyer/quotations"); return { status: "success", message: "Quotation awarded and purchase order issued.", poNumber: purchaseOrder.poNumber }; }
  catch (error) { return { status: "error", message: errorMessage(error) }; }
}
