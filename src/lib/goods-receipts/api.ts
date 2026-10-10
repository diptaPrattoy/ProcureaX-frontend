import "server-only";

import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { createReceiptInputSchema, receiptDetailSchema, receiptListSchema, type CreateReceiptInput } from "@/lib/goods-receipts/contracts";

const errorSchema = z.object({ message: z.string() });
const listEnvelope = z.object({ success: z.literal(true), data: receiptListSchema });
const detailEnvelope = z.object({ success: z.literal(true), data: receiptDetailSchema });
export class GoodsReceiptApiError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = "GoodsReceiptApiError"; } }
async function request(path: string, init?: RequestInit) { const token = await getStoredAccessToken(); if (!token) throw new GoodsReceiptApiError("Authentication required.", 401); const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json"); const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null); if (!response) throw new GoodsReceiptApiError("The receiving service is temporarily unavailable.", 503); const payload: unknown = await response.json().catch(() => null); if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new GoodsReceiptApiError(parsed.success ? parsed.data.message : "The goods-receipt request failed.", response.status); } return payload; }
export async function listGoodsReceipts(purchaseOrderId: string) { return listEnvelope.parse(await request(`purchase-orders/${purchaseOrderId}/goods-receipts?limit=50`)).data; }
export async function getGoodsReceipt(id: string) { return detailEnvelope.parse(await request(`goods-receipts/${id}`)).data; }
export async function createGoodsReceipt(purchaseOrderId: string, input: CreateReceiptInput) { const headers = new Headers({ "Content-Type": "application/json" }); return detailEnvelope.parse(await request(`purchase-orders/${purchaseOrderId}/goods-receipts`, { method: "POST", headers, body: JSON.stringify(createReceiptInputSchema.parse(input)) })).data; }
