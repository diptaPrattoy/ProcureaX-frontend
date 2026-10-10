"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access";
import type { UserRole } from "@/lib/auth/contracts";
import { PurchaseOrderApiError, transitionPurchaseOrder } from "@/lib/purchase-orders/api";

export type OrderActionState = { status: "idle" | "error" | "success"; message?: string };
const actionConfig = {
  accept: { roles: ["SUPPLIER"] as UserRole[], message: "Purchase order accepted." },
  reject: { roles: ["SUPPLIER"] as UserRole[], message: "Purchase order rejected." },
  "start-fulfillment": { roles: ["SUPPLIER"] as UserRole[], message: "Fulfillment started." },
  cancel: { roles: ["BUYER"] as UserRole[], message: "Purchase order cancelled." },
} as const;

export async function purchaseOrderAction(_state: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const id = String(formData.get("purchaseOrderId") ?? ""); const action = String(formData.get("action") ?? "") as keyof typeof actionConfig; const config = actionConfig[action];
  if (!config) return { status: "error", message: "Unsupported purchase-order action." };
  const user = await requireRole(config.roles, "/workspace");
  try { await transitionPurchaseOrder(id, action); } catch (error) { return { status: "error", message: error instanceof PurchaseOrderApiError ? error.message : "The order could not be updated." }; }
  const base = user.role === "BUYER" ? "/buyer/orders" : "/supplier/orders"; revalidatePath(base); revalidatePath(`${base}/${id}`);
  return { status: "success", message: config.message };
}
