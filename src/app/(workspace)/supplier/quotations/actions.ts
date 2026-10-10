"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access";
import { QuotationApiError, withdrawQuotation } from "@/lib/quotations/api";

export type WithdrawState = { status: "idle" | "error" | "success"; message?: string };
export async function withdrawQuotationAction(_state: WithdrawState, formData: FormData): Promise<WithdrawState> { const quotationId = String(formData.get("quotationId") ?? ""); await requireRole(["SUPPLIER"], "/supplier/quotations"); try { await withdrawQuotation(quotationId); } catch (error) { return { status: "error", message: error instanceof QuotationApiError ? error.message : "The quotation could not be withdrawn." }; } revalidatePath("/supplier/quotations"); return { status: "success", message: "Quotation withdrawn." }; }
