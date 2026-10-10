"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/access";
import { QuotationApiError, submitQuotation } from "@/lib/quotations/api";
import { submitQuotationInputSchema } from "@/lib/quotations/contracts";

export type SubmitQuotationState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string[] | undefined> };
const optional = (data: FormData, name: string) => { const value = String(data.get(name) ?? "").trim(); return value || undefined; };

export async function submitQuotationAction(_state: SubmitQuotationState, formData: FormData): Promise<SubmitQuotationState> {
  const rfqId = String(formData.get("rfqId") ?? ""); await requireRole(["SUPPLIER"], `/supplier/opportunities/${rfqId}`);
  let items: unknown = []; try { items = JSON.parse(String(formData.get("items") ?? "[]")); } catch { /* schema reports invalid items */ }
  const result = submitQuotationInputSchema.safeParse({ currency: formData.get("currency"), taxAmount: formData.get("taxAmount") || 0, deliveryDays: formData.get("deliveryDays"), validUntil: formData.get("validUntil"), terms: optional(formData, "terms"), notes: optional(formData, "notes"), items });
  if (!result.success) return { status: "error", message: "Review the quotation fields and try again.", fieldErrors: result.error.flatten().fieldErrors };
  try { await submitQuotation(rfqId, result.data); } catch (error) { return { status: "error", message: error instanceof QuotationApiError ? error.message : "The quotation could not be submitted." }; }
  revalidatePath("/supplier/opportunities"); revalidatePath("/supplier/quotations"); redirect("/supplier/quotations?submitted=true");
}
