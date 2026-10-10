import "server-only";

import { z } from "zod";
import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { refundListSchema, refundSchema } from "@/lib/refunds/contracts";

const errorSchema = z.object({ message: z.string() });
const listEnvelope = z.object({ success: z.literal(true), data: refundListSchema });
const detailEnvelope = z.object({ success: z.literal(true), data: refundSchema });
export class RefundApiError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = "RefundApiError"; } }
async function request(path: string, init?: RequestInit) { const token = await getStoredAccessToken(); if (!token) throw new RefundApiError("Authentication required.", 401); const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json"); const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null); if (!response) throw new RefundApiError("The refund service is temporarily unavailable.", 503); const payload: unknown = await response.json().catch(() => null); if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new RefundApiError(parsed.success ? parsed.data.message : "The refund request failed.", response.status); } return payload; }
export async function listRefunds(query: URLSearchParams) { return listEnvelope.parse(await request(`refunds?${query}`)).data; }
export async function getRefund(id: string) { return detailEnvelope.parse(await request(`refunds/${id}`)).data; }
export async function requestRefund(paymentId: string, input: { amount?: number; reason: string }) { const headers = new Headers({ "Content-Type": "application/json" }); return detailEnvelope.parse(await request(`payments/${paymentId}/refunds`, { method: "POST", headers, body: JSON.stringify(input) })).data; }
export async function cancelRefund(id: string) { return detailEnvelope.parse(await request(`refunds/${id}/cancel`, { method: "POST" })).data; }
