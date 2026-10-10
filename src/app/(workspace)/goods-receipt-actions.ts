"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access";
import { createGoodsReceipt, GoodsReceiptApiError } from "@/lib/goods-receipts/api";
import { createReceiptInputSchema } from "@/lib/goods-receipts/contracts";

export type ReceiptActionState = { status: "idle" | "error" | "success"; message?: string };
export async function recordReceiptAction(_state: ReceiptActionState, formData: FormData): Promise<ReceiptActionState> { const purchaseOrderId = String(formData.get("purchaseOrderId") ?? ""); await requireRole(["BUYER"], `/buyer/orders/${purchaseOrderId}`); let items: unknown = []; try { items = JSON.parse(String(formData.get("items") ?? "[]")); } catch { /* validation handles malformed items */ } const notes = String(formData.get("notes") ?? "").trim() || undefined; const result = createReceiptInputSchema.safeParse({ notes, items }); if (!result.success) return { status: "error", message: result.error.issues[0]?.message ?? "Check the received quantities." }; try { const receipt = await createGoodsReceipt(purchaseOrderId, result.data); revalidatePath(`/buyer/orders/${purchaseOrderId}`); revalidatePath("/buyer/receiving"); revalidatePath("/supplier/deliveries"); return { status: "success", message: `${receipt.receiptNumber} recorded successfully.` }; } catch (error) { return { status: "error", message: error instanceof GoodsReceiptApiError ? error.message : "The receipt could not be recorded." }; } }
