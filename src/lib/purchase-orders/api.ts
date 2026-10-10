import "server-only";

import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { purchaseOrderDetailSchema, purchaseOrderListSchema } from "@/lib/purchase-orders/contracts";

const errorSchema = z.object({ message: z.string() });
const listEnvelope = z.object({ success: z.literal(true), data: purchaseOrderListSchema });
const detailEnvelope = z.object({ success: z.literal(true), data: purchaseOrderDetailSchema });

export class PurchaseOrderApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = "PurchaseOrderApiError"; }
}

async function request(path: string, init?: RequestInit) {
  const token = await getStoredAccessToken(); if (!token) throw new PurchaseOrderApiError("Authentication required.", 401);
  const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json");
  const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null);
  if (!response) throw new PurchaseOrderApiError("The purchase-order service is temporarily unavailable.", 503);
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new PurchaseOrderApiError(parsed.success ? parsed.data.message : "The purchase-order request failed.", response.status); }
  return payload;
}

export async function listPurchaseOrders(query: URLSearchParams) { return listEnvelope.parse(await request(`purchase-orders?${query}`)).data; }
export async function getPurchaseOrder(id: string) { return detailEnvelope.parse(await request(`purchase-orders/${id}`)).data; }
export async function transitionPurchaseOrder(id: string, action: "accept" | "reject" | "start-fulfillment" | "cancel") { return detailEnvelope.parse(await request(`purchase-orders/${id}/${action}`, { method: "POST" })).data; }
